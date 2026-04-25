import axiosClient from '../../api/axiosClient';

// User endpoints
export const createBooking = (bookingData) => axiosClient.post('/api/bookings', bookingData);
export const cancelBooking = (id) => axiosClient.delete(`/api/bookings/${id}`);
export const updateBooking = (id, bookingData) => axiosClient.put(`/api/bookings/${id}`, bookingData);
export const getMyBookings = (search = '') => {
    const url = search ? `/api/bookings/my?query=${encodeURIComponent(search)}` : '/api/bookings/my';
    return axiosClient.get(url);
};
export const getBookingCheckIn = (token) => axiosClient.get(`/api/bookings/check-in/${encodeURIComponent(token)}`);
export const confirmBookingCheckIn = (token) => axiosClient.post(`/api/bookings/check-in/${encodeURIComponent(token)}`);

// Admin endpoints
export const getAllBookings = (status) => axiosClient.get('/api/bookings', { params: { status } });
export const processBookingAction = (id, actionData) => axiosClient.put(`/api/bookings/${id}/action`, actionData);
export const getBookingAnalytics = () => axiosClient.get('/api/bookings/analytics');

