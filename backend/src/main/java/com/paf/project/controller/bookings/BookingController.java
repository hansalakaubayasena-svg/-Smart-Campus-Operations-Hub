package com.paf.project.controller.bookings;

import com.paf.project.dto.bookings.AdminBookingAction;
import com.paf.project.dto.bookings.BookingRequest;
import com.paf.project.dto.bookings.BookingResponse;
import com.paf.project.service.bookings.BookingService;
import com.paf.project.service.auth.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings") 
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping // Create a new booking request for the current user
    public ResponseEntity<BookingResponse> create(@RequestBody BookingRequest request) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.createBooking(userId, request));
    }

    @GetMapping("/my") // Get personal bookings of the logged-in user with optional search
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam(name = "query", required = false) String query) {
        System.out.println("DEBUG: Searching for bookings with keyword: " + query);
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId, query));
    }

    @GetMapping // Admin only: Retrieve all bookings in the system (filtered by status)
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<BookingResponse>> getAll(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @PutMapping("/{id}/action") // Admin only: Approve or Reject a specific booking
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<BookingResponse> processAction(@PathVariable String id,
            @RequestBody AdminBookingAction action) {
        return ResponseEntity.ok(bookingService.processBookingAction(id, action));
    }

    @DeleteMapping("/{id}") // Allow a user to cancel their own booking
    public ResponseEntity<BookingResponse> cancel(@PathVariable String id) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.cancelBooking(userId, id));
    }

    @PutMapping("/{id}") // Allow a user to edit/update their booking details
    public ResponseEntity<BookingResponse> update(@PathVariable String id, @RequestBody BookingRequest request) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.updateBooking(userId, id, request));
    }

    @GetMapping("/analytics") // Admin only: Fetch data for the analytics dashboard charts
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(bookingService.getBookingAnalytics());
    }

    @DeleteMapping("/{id}/admin") // Admin only: Permanently delete a booking from the system
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
