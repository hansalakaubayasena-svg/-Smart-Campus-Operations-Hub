package com.paf.project.service.bookings;

import com.paf.project.dto.bookings.AdminBookingAction;
import com.paf.project.dto.bookings.BookingRequest;
import com.paf.project.dto.bookings.BookingResponse;
import java.util.List;

public interface BookingService {

    /**
     * Creates a new booking request.
     * 
     * @param userId  The ID of the user making the request.
     * @param request The booking details (facility, time, purpose).
     * @return The created booking response.
     */
    BookingResponse createBooking(String userId, BookingRequest request);

    /**
     * Retrieves all bookings for a specific user, optionally filtered by search query.
     * 
     * @param userId The user's ID.
     * @param search The search query.
     * @return List of bookings.
     */
    List<BookingResponse> getUserBookings(String userId, String search);

    /**
     * Retrieves all bookings in the system, optionally filtered by status.
     * 
     * @param status The status filter (ALL, PENDING, APPROVED, REJECTED).
     * @return List of all matching bookings.
     */
    List<BookingResponse> getAllBookings(String status);

    /**
     * Processes an admin action (Approve/Reject) on a booking.
     * 
     * @param bookingId The ID of the booking to process.
     * @param action    The action details (status and notes).
     * @return The updated booking response.
     */
    BookingResponse processBookingAction(String bookingId, AdminBookingAction action);

    /**
     * Allows a user to cancel their own booking request.
     * 
     * @param userId    The ID of the user.
     * @param bookingId The ID of the booking.
     * @return The updated booking response with CANCELLED status.
     */
    BookingResponse cancelBooking(String userId, String bookingId);

    /**
     * Allows a user to update their own booking request.
     * If the booking was already APPROVED, it reverts to PENDING.
     * 
     * @param userId    The ID of the user.
     * @param bookingId The ID of the booking to update.
     * @param request   The updated booking details.
     * @return The updated booking response.
     */
    BookingResponse updateBooking(String userId, String bookingId, BookingRequest request);

    /**
     * Retrieves analytical data for bookings.
     * @return A map containing analytics data.
     */
    java.util.Map<String, Object> getBookingAnalytics();

    /**
     * Deletes a booking from the system.
     * @param id The ID of the booking to delete.
     */
    void deleteBooking(String id);
}
