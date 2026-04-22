package com.paf.project.service.bookings;

import com.paf.project.dto.bookings.AdminBookingAction;
import com.paf.project.dto.bookings.BookingRequest;
import com.paf.project.dto.bookings.BookingResponse;
import com.paf.project.exception.ResourceConflictException;
import com.paf.project.exception.ResourceNotFoundException;
import com.paf.project.model.bookings.Booking;
import com.paf.project.model.auth.User;
import com.paf.project.model.facilities.Facility;
import com.paf.project.repository.bookings.BookingRepository;
import com.paf.project.repository.auth.UserRepository;
import com.paf.project.repository.facilities.FacilityRepository;
import com.paf.project.model.notifications.Notification.NotificationType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final com.paf.project.service.notifications.NotificationService notificationService;

    public BookingServiceImpl(BookingRepository bookingRepository, 
                              FacilityRepository facilityRepository, 
                              UserRepository userRepository,
                              com.paf.project.service.notifications.NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public BookingResponse createBooking(String userId, BookingRequest request) {
        // Check if facility exists and is active
        Facility facility = facilityRepository.findByResourceId(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!"ACTIVE".equalsIgnoreCase(facility.getStatus())) {
            throw new ResourceConflictException("This facility is currently unavailable for bookings.");
        }

        if (request.getExpectedAttendees() != null && facility.getCapacity() != null) {
            if (request.getExpectedAttendees() > facility.getCapacity()) {
                throw new ResourceConflictException("Expected attendees exceed the facility capacity (" + facility.getCapacity() + ").");
            }
        }

        // Check for overlaps
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                request.getFacilityId(), request.getStartTime(), request.getEndTime());
        
        if (!overlaps.isEmpty()) {
            throw new ResourceConflictException("The requested time slot overlaps with an existing booking.");
        }

        Booking booking = new Booking();
        booking.setFacilityId(request.getFacilityId());
        booking.setUserId(userId);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus("PENDING");
        Booking savedBooking = bookingRepository.save(booking);

        // Notify user
        notificationService.notify(userId, 
                NotificationType.BOOKING_PENDING, 
                "Your booking request for " + facility.getNameOrModel() + " has been submitted.", 
                savedBooking.getId(), "BOOKING");

        return toResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings(String status) {
        List<Booking> bookings;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            bookings = bookingRepository.findByStatus(status.toUpperCase());
        } else {
            bookings = bookingRepository.findAll();
        }
        return bookings.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse processBookingAction(String bookingId, AdminBookingAction action) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(action.getStatus().toUpperCase());
        booking.setAdminNotes(action.getNotes());
        Booking savedBooking = bookingRepository.save(booking);

        // Notify user of the action
        NotificationType type = "APPROVED".equalsIgnoreCase(action.getStatus()) ? 
                NotificationType.BOOKING_APPROVED : NotificationType.BOOKING_REJECTED;
        
        String facilityName = facilityRepository.findByResourceId(booking.getFacilityId())
                .map(Facility::getNameOrModel)
                .orElse("facility");

        notificationService.notify(booking.getUserId(), 
                type, 
                "Your booking for " + facilityName + " has been " + action.getStatus().toLowerCase() + ". " + 
                (action.getNotes() != null ? "Note: " + action.getNotes() : ""), 
                savedBooking.getId(), "BOOKING");

        return toResponse(savedBooking);
    }

    @Override
    public BookingResponse cancelBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus("CANCELLED");
        Booking savedBooking = bookingRepository.save(booking);

        // Notify user
        notificationService.notify(userId, 
                NotificationType.BOOKING_CANCELLED, 
                "Your booking has been cancelled successfully.", 
                savedBooking.getId(), "BOOKING");

        return toResponse(savedBooking);
    }

    private BookingResponse toResponse(Booking booking) {
        String facilityName = facilityRepository.findByResourceId(booking.getFacilityId())
                .map(Facility::getNameOrModel)
                .orElse("Unknown Facility");
        
        String userName = userRepository.findById(booking.getUserId())
                .map(User::getFullName)
                .orElse("Unknown User");

        return new BookingResponse(
                booking.getId(),
                booking.getFacilityId(),
                facilityName,
                booking.getUserId(),
                userName,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getAdminNotes(),
                booking.getCreatedAt()
        );
    }
}
