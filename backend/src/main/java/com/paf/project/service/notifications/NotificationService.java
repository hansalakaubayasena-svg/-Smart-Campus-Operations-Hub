package com.paf.project.service.notifications;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paf.project.core.exception.CustomExceptions.BadRequestException;
import com.paf.project.core.exception.CustomExceptions.ForbiddenException;
import com.paf.project.core.exception.CustomExceptions.ResourceNotFoundException;
import com.paf.project.dto.notifications.NotificationResponse;
import com.paf.project.dto.notifications.SendNotificationRequest;
import com.paf.project.model.notifications.Notification;
import com.paf.project.model.notifications.Notification.NotificationType;
import com.paf.project.repository.auth.UserRepository;
import com.paf.project.repository.notifications.NotificationRepository;
import com.paf.project.service.auth.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;
    private final UserService            userService;

    // ─────────────────────────────────────────────────────────────────────────
    // INTEGRATION METHOD — called by Module B (Bookings) and Module C (Tickets)
    // This is the only method other modules ever need to call.
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Creates a single notification for one recipient.
     * Title is auto-derived from the type so callers don't have to supply it.
     *
     * Usage from Module B:
     *   notificationService.notify(booking.getUserId(),
     *       NotificationType.BOOKING_APPROVED,
     *       "Your booking for Lab A on 25 Apr has been approved.",
     *       booking.getId(), "BOOKING");
     *
     * Usage from Module C:
     *   notificationService.notify(ticket.getUserId(),
     *       NotificationType.TICKET_RESOLVED,
     *       "Your ticket 'Broken projector' has been resolved.",
     *       ticket.getId(), "TICKET");
     */
    public void notify(String userId,
                       NotificationType type,
                       String message,
                       String referenceId,
                       String referenceType) {

        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(deriveTitleFromType(type));
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setReferenceType(referenceType);
        notificationRepository.save(n);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // USER-FACING
    // ─────────────────────────────────────────────────────────────────────────

    public List<NotificationResponse> getMyNotifications() {
        String userId = getCurrentUserId();
        return notificationRepository
                .findByUserIdOrderByCreationTimeDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCount() {
        return notificationRepository.countByUserIdAndReadFalse(getCurrentUserId());
    }

    public List<NotificationResponse> getMyRecentForBell() {
        String userId = getCurrentUserId();
        return notificationRepository
                .findTop5ByUserIdOrderByCreationTimeDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public void markAsRead(String id) {
        Notification n = getOwnedNotification(id);
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead() {
        Notification n = new Notification();
        n.setRead(true);
        n.setUserId(getCurrentUserId());
        // Since MongoDB doesn't support bulk update via repository method,
        // we'll need to fetch all unread notifications for this user and update them
        notificationRepository.findByUserIdAndReadFalseOrderByCreationTimeDesc(getCurrentUserId())
                .forEach(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                });
    }

    public void deleteMyNotification(String id) {
        getOwnedNotification(id); // ownership check
        notificationRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN — SEND
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional
    public void adminSend(SendNotificationRequest req) {
        NotificationType type = req.getType() != null ? req.getType() : NotificationType.GENERAL;

        switch (req.getTargetType().toUpperCase()) {

            case "USER" -> {
                if (req.getUserId() == null)
                    throw new BadRequestException("userId is required for targetType USER");
                createAndSave(req.getUserId(), type, req.getTitle(),
                        req.getMessage(), req.getReferenceId(), req.getReferenceType());
            }

            case "SELECTED" -> {
                if (req.getUserIds() == null || req.getUserIds().isEmpty())
                    throw new BadRequestException("userIds is required for targetType SELECTED");
                req.getUserIds().forEach(uid ->
                        createAndSave(uid, type, req.getTitle(),
                                req.getMessage(), req.getReferenceId(), req.getReferenceType()));
            }

            case "ROLE" -> {
                if (req.getRole() == null)
                    throw new BadRequestException("role is required for targetType ROLE");
                userRepository.findByRole(req.getRole())
                        .forEach(u -> createAndSave(u.getId(), type, req.getTitle(),
                                req.getMessage(), req.getReferenceId(), req.getReferenceType()));
            }

            case "ALL" -> {
                userRepository.findAll()
                        .forEach(u -> createAndSave(u.getId(), type, req.getTitle(),
                                req.getMessage(), req.getReferenceId(), req.getReferenceType()));
            }

            default -> throw new BadRequestException(
                    "Invalid targetType: " + req.getTargetType() +
                    ". Must be USER | SELECTED | ROLE | ALL");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN — MANAGE
    // ─────────────────────────────────────────────────────────────────────────

    public List<NotificationResponse> getAllNotifications(String userId,
                                                          NotificationType type,
                                                          Boolean isRead) {
        return notificationRepository.findWithFilters(userId, type, isRead)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public NotificationResponse adminUpdate(String id, String title, String message) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        if (title   != null && !title.isBlank())   n.setTitle(title);
        if (message != null && !message.isBlank()) n.setMessage(message);
        return NotificationResponse.from(notificationRepository.save(n));
    }

    public void adminDelete(String id) {
        if (!notificationRepository.existsById(id))
            throw new ResourceNotFoundException("Notification", id);
        notificationRepository.deleteById(id);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private void createAndSave(String userId,
                                NotificationType type,
                                String title,
                                String message,
                                String referenceId,
                                String referenceType) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setReferenceType(referenceType);
        notificationRepository.save(n);
    }

    /**
     * Fetches a notification only if it belongs to the current user.
     * Throws 404 if not found, 403 if owned by someone else.
     */
    private Notification getOwnedNotification(String id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        if (!n.getUserId().equals(getCurrentUserId()))
            throw new ForbiddenException("You do not have access to this notification");
        return n;
    }

    private String getCurrentUserId() {
        return userService.getCurrentUser().getId();
    }

    /**
     * Auto-generates a short human-readable title from the notification type.
     * Module B/C callers only need to pass the message — title is derived here.
     */
    private String deriveTitleFromType(NotificationType type) {
        return switch (type) {
            case BOOKING_PENDING        -> "Booking Submitted";
            case BOOKING_APPROVED       -> "Booking Approved";
            case BOOKING_REJECTED       -> "Booking Rejected";
            case BOOKING_CANCELLED      -> "Booking Cancelled";
            case TICKET_OPEN            -> "Ticket Created";
            case TICKET_IN_PROGRESS     -> "Ticket In Progress";
            case TICKET_RESOLVED        -> "Ticket Resolved";
            case TICKET_CLOSED          -> "Ticket Closed";
            case TICKET_REJECTED        -> "Ticket Rejected";
            case TICKET_ASSIGNED        -> "Technician Assigned";
            case TICKET_COMMENT_ADDED   -> "New Comment on Ticket";
            case GENERAL                -> "Notification";
        };
    }
}
