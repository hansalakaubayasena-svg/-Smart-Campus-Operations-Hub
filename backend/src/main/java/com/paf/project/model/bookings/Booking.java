package com.paf.project.model.bookings;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;
    private String facilityId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private String status; // PENDING / APPROVED / REJECTED / CANCELLED
}
