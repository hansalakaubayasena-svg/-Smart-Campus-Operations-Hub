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

    @PostMapping
    public ResponseEntity<BookingResponse> create(@RequestBody BookingRequest request) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.createBooking(userId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<BookingResponse>> getAll(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @PutMapping("/{id}/action")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<BookingResponse> processAction(@PathVariable String id, @RequestBody AdminBookingAction action) {
        return ResponseEntity.ok(bookingService.processBookingAction(id, action));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponse> cancel(@PathVariable String id) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.cancelBooking(userId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> update(@PathVariable String id, @RequestBody BookingRequest request) {
        String userId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(bookingService.updateBooking(userId, id, request));
    }
}
