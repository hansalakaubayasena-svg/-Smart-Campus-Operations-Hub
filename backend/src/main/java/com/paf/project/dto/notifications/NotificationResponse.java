package com.paf.project.dto.notifications;

import java.time.LocalDateTime;

import com.paf.project.model.notifications.Notification;

import lombok.Data;

/**
 * API response shape for a single notification.
 * Adds a derived `category` field so the frontend can toggle
 * booking / ticket / general preferences without string-matching enum names.
 */
@Data
public class NotificationResponse {

    private Long id;
    private Long userId;
    private Notification.NotificationType type;
    private String category;   // "BOOKING" | "TICKET" | "GENERAL"
    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long referenceId;
    private String referenceType;

    public static NotificationResponse from(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(n.getId());
        dto.setUserId(n.getUserId());
        dto.setType(n.getType());
        dto.setCategory(deriveCategory(n.getType()));
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setIsRead(n.getRead());
        dto.setCreatedAt(n.getCreationTime());
        dto.setReferenceId(n.getReferenceId());
        dto.setReferenceType(n.getReferenceType());
        return dto;
    }

    private static String deriveCategory(Notification.NotificationType type) {
        String name = type.name();
        if (name.startsWith("BOOKING")) return "BOOKING";
        if (name.startsWith("TICKET"))  return "TICKET";
        return "GENERAL";
    }
}
