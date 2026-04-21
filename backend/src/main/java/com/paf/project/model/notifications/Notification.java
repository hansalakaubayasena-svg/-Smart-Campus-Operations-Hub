package com.paf.project.model.notifications;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
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

    public Notification() {}

    public Notification(String id, String userId, NotificationType type, String title, String message, Boolean read, LocalDateTime creationTime, String referenceId, String referenceType) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = read;
        this.creationTime = creationTime;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }

    public LocalDateTime getCreationTime() { return creationTime; }
    public void setCreationTime(LocalDateTime creationTime) { this.creationTime = creationTime; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public enum NotificationType {
        BOOKING_PENDING, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED,
        TICKET_OPEN, TICKET_IN_PROGRESS, TICKET_RESOLVED, TICKET_CLOSED, TICKET_REJECTED, TICKET_ASSIGNED, TICKET_COMMENT_ADDED,
        GENERAL
    }
}
