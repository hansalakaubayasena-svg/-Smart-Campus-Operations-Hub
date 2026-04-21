package com.paf.project.service.bookings;

import com.paf.project.dto.bookings.AdminBookingAction;
import com.paf.project.dto.bookings.BookingRequest;
import com.paf.project.dto.bookings.BookingResponse;
import java.util.List;

public interface BookingService {
    BookingResponse createBooking(String userId, BookingRequest request);
    List<BookingResponse> getUserBookings(String userId);
    List<BookingResponse> getAllBookings(String status);
    BookingResponse processBookingAction(String bookingId, AdminBookingAction action);
    BookingResponse cancelBooking(String userId, String bookingId);
}
