import axiosClient from '../../api/axiosClient';

// User endpoints
export const createBooking = (bookingData) => axiosClient.post('/api/bookings', bookingData);
export const getMyBookings = () => axiosClient.get('/api/bookings/my');
export const cancelBooking = (id) => axiosClient.delete(`/api/bookings/${id}`);

// Admin endpoints
export const getAllBookings = (status) => axiosClient.get('/api/bookings', { params: { status } });
export const processBookingAction = (id, actionData) => axiosClient.put(`/api/bookings/${id}/action`, actionData);
