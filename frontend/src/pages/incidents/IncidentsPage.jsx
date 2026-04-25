import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import TicketForm from "../../components/incidents/TicketForm";
import { useAuth } from "../../context/AuthContext";
import { getUsers } from "../../services/auth/authService";
import {
  assignTicket,
  createTicket,
  getTickets,
  updateTicketStatus,
} from "../../services/incidents/ticketService";

const STATUS_COPY = {
  OPEN: "Waiting for a technician to review the issue.",
  IN_PROGRESS: "A technician is actively checking and working on the problem.",
  RESOLVED: "A solution has been provided. Review the technician response.",
  CLOSED: "This ticket is complete and closed.",
  REJECTED: "This ticket was rejected. Check the support note for details.",
};

const PRIORITY_STYLES = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-700",
};

const STATUS_STYLES = {
  OPEN: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-200 text-slate-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const normalizeRole = (role) => {
  if (role === "ADMINISTRATOR" || role === "ADMIN") return "ADMIN";
  if (role === "STUDENT" || role === "USER") return "USER";
  return role ?? "USER";
};

const getDisplayName = (user) =>
  user
    ? user.fullName || user.username || user.email || `User #${user.id ?? "Unknown"}`
    : "";

const getUserById = (users, userId) =>
  users.find((user) => String(user.id) === String(userId)) ?? null;

const IncidentsPage = () => {
  const { user } = useAuth();
  const role = normalizeRole(user?.role);
  const isUser = role === "USER";
  const isTechnician = role === "TECHNICIAN";
  const isAdmin = role === "ADMIN";
  const canManageWorkflow = isTechnician || isAdmin;

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [statusForm, setStatusForm] = useState({
    status: "IN_PROGRESS",
    solutionText: "",
    rejectionReason: "",
  });

  const visibleTickets = useMemo(() => {
    if (!isUser) return tickets;
    return tickets.filter(
      (ticket) => String(ticket.createdByUserId) === String(user?.id ?? user?.userId),
    );
  }, [isUser, tickets, user]);

  const selectedTicket = useMemo(() => {
    if (!visibleTickets.length) return null;
    return (
      visibleTickets.find((ticket) => String(ticket.id) === String(selectedTicketId)) ??
      visibleTickets[0]
    );
  }, [selectedTicketId, visibleTickets]);

  const technicianUsers = useMemo(
    () => users.filter((entry) => normalizeRole(entry.role) === "TECHNICIAN"),
    [users],
  );

  const queueSummary = useMemo(
    () => ({
      total: visibleTickets.length,
      open: visibleTickets.filter((ticket) => ticket.status === "OPEN").length,
      active: visibleTickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
      resolved: visibleTickets.filter((ticket) => ticket.status === "RESOLVED").length,
    }),
    [visibleTickets],
  );

  const allowedStatusOptions = useMemo(() => {
    if (!selectedTicket || !canManageWorkflow) return [];

    if (selectedTicket.status === "OPEN") {
      return isAdmin ? ["IN_PROGRESS", "RESOLVED", "REJECTED"] : ["IN_PROGRESS", "RESOLVED"];
    }
    if (selectedTicket.status === "IN_PROGRESS") {
      return isAdmin ? ["RESOLVED", "REJECTED"] : ["RESOLVED"];
    }
    if (selectedTicket.status === "RESOLVED") {
      return ["CLOSED"];
    }
    return [];
  }, [selectedTicket, canManageWorkflow, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketData, userData] = await Promise.all([
        getTickets(),
        canManageWorkflow || isAdmin ? getUsers() : Promise.resolve([]),
      ]);
      setTickets(ticketData);
      setUsers(userData);
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Ticket data could not be loaded. Please check the backend connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [canManageWorkflow, isAdmin]);

  useEffect(() => {
    if (!visibleTickets.some((ticket) => String(ticket.id) === String(selectedTicketId))) {
      setSelectedTicketId(visibleTickets[0]?.id ?? null);
    }
  }, [selectedTicketId, visibleTickets]);

  useEffect(() => {
    if (!selectedTicket) return;

    const fallbackStatus =
      selectedTicket.status === "OPEN"
        ? "IN_PROGRESS"
        : selectedTicket.status === "IN_PROGRESS"
          ? "RESOLVED"
          : "CLOSED";

    setStatusForm({
      status: fallbackStatus,
      solutionText: selectedTicket.resolutionNotes ?? "",
      rejectionReason: selectedTicket.rejectionReason ?? "",
    });
  }, [selectedTicket]);

  useEffect(() => {
    if (allowedStatusOptions.length && !allowedStatusOptions.includes(statusForm.status)) {
      setStatusForm((current) => ({
        ...current,
        status: allowedStatusOptions[0],
      }));
    }
  }, [allowedStatusOptions, statusForm.status]);

  const pushSuccess = (message) => setFeedback({ type: "success", message });
  const pushError = (error, fallback) =>
    setFeedback({
      type: "error",
      message: error?.response?.data?.message || fallback,
    });

  const handleCreateTicket = async (payload) => {
    setSubmitting(true);
    try {
      await createTicket(payload);
      await loadData();
      pushSuccess("Your ticket was raised successfully. You can now track it below.");
    } catch (error) {
      pushError(error, "Ticket could not be raised right now.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (staffUserId) => {
    if (!selectedTicket) return;

    setSubmitting(true);
    try {
      await assignTicket(selectedTicket.id, {
        assigneeUserId: staffUserId,
      });
      await loadData();
      pushSuccess("Ticket ownership updated successfully.");
    } catch (error) {
      pushError(error, "Technician assignment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedTicket) return;

    setSubmitting(true);
    try {
      await updateTicketStatus(selectedTicket.id, {
        status: statusForm.status,
        resolutionNotes: statusForm.solutionText,
        rejectionReason:
          statusForm.status === "REJECTED" ? statusForm.rejectionReason : "",
      });
      await loadData();
      pushSuccess("Solution saved. The user can now see the latest technician update.");
    } catch (error) {
      pushError(error, "Ticket workflow update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentReporter = getUserById(users, selectedTicket?.createdByUserId);
  const currentAssignee = getUserById(users, selectedTicket?.assignedStaffUserId);
  const technicianResponse =
    selectedTicket?.status === "REJECTED"
      ? selectedTicket?.rejectionReason || "No rejection reason provided yet."
      : selectedTicket?.resolutionNotes || "The technician has not shared a solution yet.";

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              Smart Ticketing Flow
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {isUser
                ? "Raise a ticket and follow every technician update"
                : "Review reported issues and send the solution back to users"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isUser
                ? "Users can submit a maintenance problem once, then monitor status, assigned technician, and final solution without editing the ticket."
                : "Technicians and admins can inspect the queue, take ownership, move workflow stages forward, and publish updates that are immediately visible to the reporting user."}
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Signed In As
              </p>
              <div className="mt-2 flex items-center gap-2">
                {isUser ? (
                  <UserRound className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Wrench className="h-5 w-5 text-amber-600" />
                )}
                <strong className="text-slate-900">{role}</strong>
              </div>
              <p className="mt-2 text-sm text-slate-600">{getDisplayName(user)}</p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Queue Status
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">{queueSummary.total}</p>
              <p className="text-sm text-slate-600">
                {isUser ? "visible to you" : "tickets in the support queue"}
              </p>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Queue
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Open
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{queueSummary.open}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              In Progress
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{queueSummary.active}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Resolved
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{queueSummary.resolved}</p>
          </div>
        </div>
      </section>

      {feedback.message ? (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.type === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          {isUser ? (
            <TicketForm
              actorUser={user}
              onSubmit={handleCreateTicket}
              submitting={submitting}
            />
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">
                Technician Workspace
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Support workflow guidance
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <strong className="text-sm text-slate-900">1. Review ticket</strong>
                  <p className="mt-2 text-sm text-slate-600">
                    Understand the issue, priority, location, and evidence first.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <strong className="text-sm text-slate-900">2. Update progress</strong>
                  <p className="mt-2 text-sm text-slate-600">
                    Move the ticket through the workflow with clear progress notes.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <strong className="text-sm text-slate-900">3. Publish solution</strong>
                  <p className="mt-2 text-sm text-slate-600">
                    The response you save here becomes visible to the reporting user.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {isUser ? "My Tickets" : "Support Queue"}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {isUser ? "Submitted Tickets" : "Reported Tickets"}
                </h2>
              </div>
              {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : null}
            </div>

            <div className="mt-5 space-y-3">
              {!loading && !visibleTickets.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  {isUser
                    ? "You have not raised any ticket yet. Use the form above to report a problem."
                    : "No tickets are available in the queue right now."}
                </div>
              ) : null}

              {visibleTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    String(selectedTicket?.id) === String(ticket.id)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        #{ticket.id} {ticket.resourceName || ticket.category}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{ticket.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {ticket.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>{ticket.imageAttachments?.length ?? 0} evidence files</span>
                    <span>
                      Assigned:{" "}
                      {getDisplayName(getUserById(users, ticket.assignedStaffUserId)) ||
                        (ticket.assignedStaffUserId ? `User #${ticket.assignedStaffUserId}` : "Pending")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {!selectedTicket ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
              Select a ticket to inspect its workflow details.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Ticket Detail
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {selectedTicket.resourceName || selectedTicket.category}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {STATUS_COPY[selectedTicket.status]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      PRIORITY_STYLES[selectedTicket.priority] || PRIORITY_STYLES.MEDIUM
                    }`}
                  >
                    {selectedTicket.priority}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.OPEN
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Reported By
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {currentReporter ? getDisplayName(currentReporter) : `User #${selectedTicket.createdByUserId}`}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Assigned Staff
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {currentAssignee
                      ? getDisplayName(currentAssignee)
                      : selectedTicket.assignedStaffUserId
                        ? `User #${selectedTicket.assignedStaffUserId}`
                        : "Pending assignment"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedTicket.category}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedTicket.location}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  User Description
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Preferred Contact
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedTicket.preferredContactName || "Not provided"}
                </p>
                <p className="text-sm text-slate-600">
                  {selectedTicket.preferredContactEmail || "No email"}{" "}
                  {selectedTicket.preferredContactPhone
                    ? `• ${selectedTicket.preferredContactPhone}`
                    : ""}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Technician Response Visible To User
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-900">
                  {technicianResponse}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Evidence Attachments
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTicket.imageAttachments?.length ? (
                    selectedTicket.imageAttachments.map((attachment, index) => (
                      <a
                        key={`${attachment}-${index}`}
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        Open attachment {index + 1}
                      </a>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No evidence attached.</span>
                  )}
                </div>
              </div>

              {canManageWorkflow ? (
                <div className="space-y-4 rounded-3xl border border-amber-200 bg-amber-50/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                        Technician Actions
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        Update workflow and publish the solution
                      </h3>
                    </div>
                    <Clock3 className="h-5 w-5 text-amber-700" />
                  </div>

                  {isTechnician ? (
                    <button
                      type="button"
                      onClick={() => handleAssign(user?.id ?? user?.userId)}
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Take ownership of this ticket
                    </button>
                  ) : null}

                  {isAdmin && technicianUsers.length ? (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        Assign technician
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {technicianUsers.map((tech) => (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => handleAssign(tech.id)}
                            disabled={submitting}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {getDisplayName(tech)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-left text-sm font-medium text-slate-700">
                      Next Status
                      <select
                        value={statusForm.status}
                        onChange={(event) =>
                          setStatusForm((current) => ({
                            ...current,
                            status: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400"
                        disabled={!allowedStatusOptions.length}
                      >
                        {allowedStatusOptions.length ? (
                          allowedStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))
                        ) : (
                          <option value={selectedTicket.status}>No more updates allowed</option>
                        )}
                      </select>
                    </label>
                    <div className="rounded-2xl bg-white p-4 text-left">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Current Stage
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {selectedTicket.status}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Only valid next-step options are shown.
                      </p>
                    </div>
                  </div>

                  <label className="block text-left text-sm font-medium text-slate-700">
                    Solution / Progress Note
                    <textarea
                      rows={4}
                      value={statusForm.solutionText}
                      onChange={(event) =>
                        setStatusForm((current) => ({
                          ...current,
                          solutionText: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400"
                      placeholder="Write what you checked, what was fixed, and what the user should know."
                    />
                  </label>

                  {statusForm.status === "REJECTED" ? (
                    <label className="block text-left text-sm font-medium text-slate-700">
                      Rejection Reason
                      <textarea
                        rows={3}
                        value={statusForm.rejectionReason}
                        onChange={(event) =>
                          setStatusForm((current) => ({
                            ...current,
                            rejectionReason: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none transition focus:border-amber-400"
                        placeholder="Explain clearly why this ticket cannot proceed."
                      />
                    </label>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={submitting || !allowedStatusOptions.length}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving update...
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4" />
                        Save Technician Update
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    User Access Rule
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    You can view updates, but not edit the ticket
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Once a ticket is submitted, only technicians and admins can move
                    the workflow forward or publish the solution. This keeps the
                    support history clear and trustworthy.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IncidentsPage;
