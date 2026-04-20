package com.paf.project.model.notifications;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    private String id;

    private String userId;

    private NotificationType type;

    private String title;

    private String message;

    private Boolean read = false;

    private LocalDateTime creationTime;

    private String referenceId;

    private String referenceType;

    public enum NotificationType {
        BOOKING_PENDING,
        BOOKING_APPROVED,
        BOOKING_REJECTED,
        BOOKING_CANCELLED,

        TICKET_OPEN,
        TICKET_IN_PROGRESS,
        TICKET_RESOLVED,
        TICKET_CLOSED,
        TICKET_REJECTED,
        TICKET_ASSIGNED,
        TICKET_COMMENT_ADDED,

        GENERAL
    }
}
