package com.paf.project.dto.notifications;

import java.util.List;

import com.paf.project.model.auth.User;
import com.paf.project.model.notifications.Notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Single DTO for all admin send modes.
 *
 * targetType → required fields:
 *   "USER"     → userId
 *   "SELECTED" → userIds
 *   "ROLE"     → role
 *   "ALL"      → (none)
 */
@Data
public class SendNotificationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "targetType is required: USER | SELECTED | ROLE | ALL")
    private String targetType;

    // Conditional — checked in service based on targetType
    private String userId;
    private List<String> userIds;
    private User.Role role;

    // Optional — for booking/ticket manual sends from admin panel
    private Notification.NotificationType type;  // defaults to GENERAL if null
    private String referenceId;
    private String referenceType;
}
