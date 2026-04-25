package com.paf.project.repository.bookings;

import com.paf.project.model.bookings.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(String status);

    java.util.Optional<Booking> findByCheckInToken(String checkInToken);

    List<Booking> findByUserIdAndPurposeContainingIgnoreCase(String userId, String purpose);


    @Query("{ 'facilityId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "  $and: [ { 'startTime': { $lt: ?2 } }, { 'endTime': { $gt: ?1 } } ] }")
    List<Booking> findOverlappingBookings(String facilityId, LocalDateTime startTime, LocalDateTime endTime);
}
