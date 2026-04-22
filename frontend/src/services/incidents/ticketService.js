import api from "../api";

const unwrapApiData = (response) => response?.data?.data ?? response?.data ?? response;

const normalizeTicket = (ticket) => {
  if (!ticket) return null;

  return {
    ...ticket,
    id: ticket.id,
    createdByUserId: ticket.createdByUserId ?? ticket.reporterUserId,
    reporterUserId: ticket.reporterUserId ?? ticket.createdByUserId,
    preferredContactName: ticket.preferredContactName ?? ticket.preferredContact?.name ?? "",
    preferredContactEmail: ticket.preferredContactEmail ?? ticket.preferredContact?.email ?? "",
    preferredContactPhone: ticket.preferredContactPhone ?? ticket.preferredContact?.phone ?? "",
    assignedStaffUserId: ticket.assignedStaffUserId ?? ticket.assignedStaffId ?? null,
    imageAttachments:
      ticket.imageAttachments ??
      ticket.attachments?.map((attachment) => attachment.dataUrl).filter(Boolean) ??
      [],
  };
};

const normalizeTickets = (tickets) =>
  Array.isArray(tickets) ? tickets.map(normalizeTicket).filter(Boolean) : [];

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return normalizeTickets(unwrapApiData(response));
};

export const createTicket = async (payload) => {
  const response = await api.post("/tickets", {
    resourceId: payload.resourceId ?? "",
    resourceName: payload.resourceName ?? payload.category ?? "General Issue",
    location: payload.location ?? "Not specified",
    category: payload.category ?? "General",
    description: payload.description ?? "",
    priority: payload.priority ?? "MEDIUM",
    preferredContact: {
      name: payload.preferredContact?.name ?? payload.preferredContactName ?? "User",
      email: payload.preferredContact?.email ?? payload.preferredContactEmail ?? "user@example.com",
      phone: payload.preferredContact?.phone ?? payload.preferredContactPhone ?? "N/A",
    },
    attachments:
      payload.attachments?.map((attachment) => ({
        fileName: attachment.fileName,
        contentType: attachment.contentType,
        dataUrl: attachment.dataUrl,
      })) ?? [],
  });

  return normalizeTicket(unwrapApiData(response));
};

export const assignTicket = async (ticketId, payload) => {
  const response = await api.post(`/tickets/${ticketId}/assign`, {
    staffUserId: String(payload.assigneeUserId ?? payload.staffUserId ?? ""),
  });

  return normalizeTicket(unwrapApiData(response));
};

export const updateTicketStatus = async (ticketId, payload) => {
  const response = await api.post(`/tickets/${ticketId}/status`, {
    status: payload.status,
    resolutionNotes: payload.resolutionNotes ?? payload.solutionText ?? "",
    rejectionReason: payload.rejectionReason ?? "",
  });

  return normalizeTicket(unwrapApiData(response));
};
