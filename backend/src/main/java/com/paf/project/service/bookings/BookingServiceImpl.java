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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, 
                              FacilityRepository facilityRepository, 
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BookingResponse createBooking(String userId, BookingRequest request) {
        // Check if facility exists and is active
        Facility facility = facilityRepository.findByResourceId(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!"ACTIVE".equalsIgnoreCase(facility.getStatus())) {
            throw new ResourceConflictException("This facility is currently unavailable for bookings.");
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

        return toResponse(bookingRepository.save(booking));
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

        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse cancelBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        booking.setStatus("CANCELLED");
        return toResponse(bookingRepository.save(booking));
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
