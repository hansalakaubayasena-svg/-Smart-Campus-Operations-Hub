// src/services/admin/adminApi.js
import axiosClient from "../../api/axiosClient";

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ User Management                                                            ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Fetch all users with optional filtering
 * @param {Object} options - Query options
 * @param {string} [options.role] - Filter by role (ADMIN, FACILITY_MANAGER, STUDENT)
 * @param {string} [options.search] - Search by name or email
 * @param {number} [options.page] - Page number (1-indexed)
 * @param {number} [options.size] - Page size
 * @returns {Promise<Array>} List of users
 */
export async function fetchAllUsers(options = {}) {
  const params = new URLSearchParams();
  if (options.role) params.append("role", options.role);
  if (options.search) params.append("search", options.search);
  if (options.page) params.append("page", options.page);
  if (options.size) params.append("size", options.size);

  const response = await axiosClient.get(`/admin/users?${params.toString()}`);
  return response.data;
}

/**
 * Get user details by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User details
 */
export async function fetchUserById(userId) {
  const response = await axiosClient.get(`/admin/users/${userId}`);
  return response.data;
}

/**
 * Update user details
 * @param {number} userId - User ID
 * @param {Object} data - User data to update
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserById(userId, data) {
  const response = await axiosClient.put(`/admin/users/${userId}`, data);
  return response.data;
}

/**
 * Delete a user by ID
 * @param {number} userId - User ID to delete
 * @returns {Promise<void>}
 */
export async function deleteUserById(userId) {
  await axiosClient.delete(`/admin/users/${userId}`);
}

/**
 * Assign role to user
 * @param {number} userId - User ID
 * @param {string} role - Role (ADMIN, FACILITY_MANAGER, STUDENT)
 * @returns {Promise<Object>} Updated user
 */
export async function assignRoleToUser(userId, role) {
  const response = await axiosClient.put(`/admin/users/${userId}/role`, {
    role,
  });
  return response.data;
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ Statistics & Dashboard                                                     ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Fetch admin dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export async function fetchDashboardStats() {
  const response = await axiosClient.get("/admin/statistics");
  return response.data;
}

/**
 * Get system health status
 * @returns {Promise<Object>} System health information
 */
export async function fetchSystemHealth() {
  const response = await axiosClient.get("/admin/health");
  return response.data;
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ Facilities Management                                                      ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Fetch all facilities
 * @param {Object} options - Query options
 * @returns {Promise<Array>} List of facilities
 */
export async function fetchAllFacilities(options = {}) {
  const params = new URLSearchParams();
  if (options.status) params.append("status", options.status);
  if (options.page) params.append("page", options.page);
  if (options.size) params.append("size", options.size);

  const response = await axiosClient.get(`/admin/facilities?${params.toString()}`);
  return response.data;
}

/**
 * Create a new facility
 * @param {Object} data - Facility data
 * @returns {Promise<Object>} Created facility
 */
export async function createFacility(data) {
  const response = await axiosClient.post("/admin/facilities", data);
  return response.data;
}

/**
 * Update facility details
 * @param {number} facilityId - Facility ID
 * @param {Object} data - Facility data to update
 * @returns {Promise<Object>} Updated facility
 */
export async function updateFacility(facilityId, data) {
  const response = await axiosClient.put(`/admin/facilities/${facilityId}`, data);
  return response.data;
}

/**
 * Delete a facility
 * @param {number} facilityId - Facility ID
 * @returns {Promise<void>}
 */
export async function deleteFacility(facilityId) {
  await axiosClient.delete(`/admin/facilities/${facilityId}`);
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ Booking Management                                                         ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Fetch all bookings with optional filtering
 * @param {Object} options - Query options
 * @param {string} [options.status] - Filter by status (PENDING, APPROVED, CANCELLED, COMPLETED)
 * @param {string} [options.facility] - Filter by facility
 * @param {number} [options.page] - Page number
 * @param {number} [options.size] - Page size
 * @returns {Promise<Array>} List of bookings
 */
export async function fetchAllBookings(options = {}) {
  const params = new URLSearchParams();
  if (options.status) params.append("status", options.status);
  if (options.facility) params.append("facility", options.facility);
  if (options.page) params.append("page", options.page);
  if (options.size) params.append("size", options.size);

  const response = await axiosClient.get(`/admin/bookings?${params.toString()}`);
  return response.data;
}

/**
 * Approve a booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} Updated booking
 */
export async function approveBooking(bookingId) {
  const response = await axiosClient.put(`/admin/bookings/${bookingId}/approve`);
  return response.data;
}

/**
 * Reject/cancel a booking
 * @param {number} bookingId - Booking ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Updated booking
 */
export async function rejectBooking(bookingId, reason) {
  const response = await axiosClient.put(`/admin/bookings/${bookingId}/reject`, {
    reason,
  });
  return response.data;
}

/**
 * Delete a booking (admin override)
 * @param {number} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export async function deleteBooking(bookingId) {
  await axiosClient.delete(`/admin/bookings/${bookingId}`);
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ Tickets Management                                                         ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Fetch all support tickets
 * @param {Object} options - Query options
 * @param {string} [options.status] - Filter by status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
 * @param {string} [options.priority] - Filter by priority (LOW, MEDIUM, HIGH)
 * @param {number} [options.page] - Page number
 * @param {number} [options.size] - Page size
 * @returns {Promise<Array>} List of tickets
 */
export async function fetchAllTickets(options = {}) {
  const params = new URLSearchParams();
  if (options.status) params.append("status", options.status);
  if (options.priority) params.append("priority", options.priority);
  if (options.page) params.append("page", options.page);
  if (options.size) params.append("size", options.size);

  const response = await axiosClient.get(`/admin/tickets?${params.toString()}`);
  return response.data;
}

/**
 * Get ticket details
 * @param {number} ticketId - Ticket ID
 * @returns {Promise<Object>} Ticket details
 */
export async function fetchTicketById(ticketId) {
  const response = await axiosClient.get(`/admin/tickets/${ticketId}`);
  return response.data;
}

/**
 * Update ticket status
 * @param {number} ticketId - Ticket ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated ticket
 */
export async function updateTicketStatus(ticketId, status) {
  const response = await axiosClient.put(`/admin/tickets/${ticketId}`, {
    status,
  });
  return response.data;
}

/**
 * Add comment/reply to ticket
 * @param {number} ticketId - Ticket ID
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} Updated ticket
 */
export async function replyToTicket(ticketId, comment) {
  const response = await axiosClient.post(
    `/admin/tickets/${ticketId}/comments`,
    { comment }
  );
  return response.data;
}

/**
 * Close/resolve ticket
 * @param {number} ticketId - Ticket ID
 * @param {string} resolution - Resolution notes
 * @returns {Promise<Object>} Updated ticket
 */
export async function resolveTicket(ticketId, resolution) {
  const response = await axiosClient.put(
    `/admin/tickets/${ticketId}/resolve`,
    { resolution }
  );
  return response.data;
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ Reports & Analytics                                                        ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Generate admin report
 * @param {Object} options - Report options
 * @param {string} [options.type] - Report type (users, bookings, facilities, usage)
 * @param {string} [options.dateRange] - Date range (week, month, quarter, year)
 * @returns {Promise<Object>} Report data
 */
export async function generateReport(options = {}) {
  const params = new URLSearchParams();
  if (options.type) params.append("type", options.type);
  if (options.dateRange) params.append("dateRange", options.dateRange);

  const response = await axiosClient.get(`/admin/reports?${params.toString()}`);
  return response.data;
}

/**
 * Export data to CSV
 * @param {string} dataType - Type of data to export (users, bookings, facilities)
 * @returns {Promise<Blob>} CSV file content
 */
export async function exportDataAsCSV(dataType) {
  const response = await axiosClient.get(`/admin/export/${dataType}`, {
    responseType: "blob",
  });
  return response.data;
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║ System Configuration & Maintenance                                         ║
// ╚════════════════════════════════════════════════════════════════════════════╝

/**
 * Trigger system maintenance mode
 * @returns {Promise<Object>} Maintenance status
 */
export async function toggleMaintenanceMode() {
  const response = await axiosClient.post("/admin/maintenance/toggle");
  return response.data;
}

/**
 * Clear application cache
 * @returns {Promise<void>}
 */
export async function clearApplicationCache() {
  await axiosClient.post("/admin/maintenance/clear-cache");
}

/**
 * Fetch system logs
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Number of logs to fetch
 * @param {string} [options.level] - Log level (ERROR, WARN, INFO)
 * @returns {Promise<Array>} System logs
 */
export async function fetchSystemLogs(options = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append("limit", options.limit);
  if (options.level) params.append("level", options.level);

  const response = await axiosClient.get(`/admin/logs?${params.toString()}`);
  return response.data;
}
