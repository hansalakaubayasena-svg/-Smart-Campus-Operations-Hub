package com.paf.project.model.notifications;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean read = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime creationTime;

    private Long referenceId;

    private String referenceType;

    @PrePersist
    protected void onCreate() {
        if (creationTime == null) creationTime = LocalDateTime.now();
        if (read == null)         read         = false;
    }

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
