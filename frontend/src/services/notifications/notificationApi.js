// src/services/notifications/notificationApi.js
import axiosClient from "../../api/axiosClient";

// ── User-facing ───────────────────────────────────────────────────────────────

export const fetchMyNotifications = async () => {
  const res = await axiosClient.get("/api/notifications");
  return res.data.data; // List<NotificationResponse>
};

export const fetchBellNotifications = async () => {
  const res = await axiosClient.get("/api/notifications/bell");
  return res.data.data; // Last 5
};

export const fetchUnreadCount = async () => {
  const res = await axiosClient.get("/api/notifications/unread-count");
  return res.data.data.count; // number
};

export const markNotificationRead = async (id) => {
  await axiosClient.put(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await axiosClient.put("/api/notifications/read-all");
};

export const deleteMyNotification = async (id) => {
  await axiosClient.delete(`/api/notifications/${id}`);
};

// ── Admin — Send ──────────────────────────────────────────────────────────────

export const adminSendNotification = async (payload) => {
  // payload shape: { title, message, targetType, userId?, userIds?, role?, type?, referenceId?, referenceType? }
  await axiosClient.post("/api/notifications/send", payload);
};

// ── Admin — Manage ────────────────────────────────────────────────────────────

export const adminFetchAllNotifications = async (filters = {}) => {
  // filters: { userId, type, isRead }
  const params = {};
  if (filters.userId !== undefined && filters.userId !== null)
    params.userId = filters.userId;
  if (filters.type !== undefined && filters.type !== null)
    params.type = filters.type;
  if (filters.isRead !== undefined && filters.isRead !== null)
    params.isRead = filters.isRead;
  const res = await axiosClient.get("/api/notifications/admin/all", { params });
  return res.data.data;
};

export const adminUpdateNotification = async (id, { title, message }) => {
  const res = await axiosClient.put(`/api/notifications/admin/${id}`, {
    title,
    message,
  });
  return res.data.data;
};

export const adminDeleteNotification = async (id) => {
  await axiosClient.delete(`/api/notifications/admin/${id}`);
};
