package com.paf.project.service.incidents;

import com.paf.project.model.auth.User;
import com.paf.project.model.incidents.IncidentTicket;
import com.paf.project.model.incidents.TicketComment;
import com.paf.project.repository.auth.UserRepository;
import com.paf.project.repository.incidents.TicketRepository;
import com.paf.project.service.incidents.dto.AssignTicketRequest;
import com.paf.project.service.incidents.dto.CreateCommentRequest;
import com.paf.project.service.incidents.dto.CreateTicketRequest;
import com.paf.project.service.incidents.dto.UpdateCommentRequest;
import com.paf.project.service.incidents.dto.UpdateTicketStatusRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IncidentTicketService {
    private static final List<String> VALID_PRIORITIES = List.of("LOW", "MEDIUM", "HIGH", "CRITICAL");
    private static final Map<String, String> NEXT_STATUS = Map.of(
            "OPEN", "IN_PROGRESS",
            "IN_PROGRESS", "RESOLVED",
            "RESOLVED", "CLOSED"
    );

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public IncidentTicketService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<IncidentTicket> getTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public IncidentTicket createTicket(CreateTicketRequest request) {
        User reporter = getExistingUser(request.createdByUserId());
        ensureRole(reporter, List.of("USER", "ADMIN", "TECHNICIAN"), "Only valid users can create tickets.");
        validatePriority(request.priority());
        validateAttachments(request.imageAttachments());

        Instant now = Instant.now();
        IncidentTicket ticket = new IncidentTicket();
        ticket.setLocation(request.location().trim());
        ticket.setCategory(request.category().trim());
        ticket.setDescription(request.description().trim());
        ticket.setPriority(request.priority().trim().toUpperCase());
        ticket.setPreferredContactName(request.preferredContactName().trim());
        ticket.setPreferredContactEmail(request.preferredContactEmail().trim());
        ticket.setPreferredContactPhone(request.preferredContactPhone().trim());
        ticket.setImageAttachments(request.imageAttachments().stream().map(String::trim).toList());
        ticket.setCreatedByUserId(reporter.getId());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);

        return ticketRepository.save(ticket);
    }

    public IncidentTicket assignTicket(String ticketId, AssignTicketRequest request) {
        User admin = getExistingUser(request.adminUserId());
        ensureRole(admin, List.of("ADMIN"), "Only admins can assign tickets.");

        User assignee = getExistingUser(request.assigneeUserId());
        ensureRole(assignee, List.of("TECHNICIAN", "ADMIN"), "Tickets can only be assigned to technicians or admins.");

        IncidentTicket ticket = getTicket(ticketId);
        ticket.setAssignedStaffUserId(assignee.getId());
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    public IncidentTicket updateStatus(String ticketId, UpdateTicketStatusRequest request) {
        IncidentTicket ticket = getTicket(ticketId);
        User actor = getExistingUser(request.actorUserId());
        String nextStatus = request.status().trim().toUpperCase();

        if ("REJECTED".equals(nextStatus)) {
            ensureRole(actor, List.of("ADMIN"), "Only admins can reject tickets.");
            if (request.rejectionReason() == null || request.rejectionReason().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejection reason is required.");
            }
            if ("CLOSED".equals(ticket.getStatus())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Closed tickets cannot be rejected.");
            }
            ticket.setStatus("REJECTED");
            ticket.setRejectionReason(request.rejectionReason().trim());
            ticket.setResolutionNotes(blankToNull(request.resolutionNotes()));
        } else {
            String allowedNext = NEXT_STATUS.get(ticket.getStatus());
            if (allowedNext == null || !allowedNext.equals(nextStatus)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ticket status transition.");
            }
            ensureWorkflowAccess(actor, ticket);
            if (!"CLOSED".equals(nextStatus) && (request.resolutionNotes() == null || request.resolutionNotes().isBlank())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resolution or progress notes are required.");
            }
            ticket.setStatus(nextStatus);
            ticket.setResolutionNotes(blankToNull(request.resolutionNotes()));
            if (!"REJECTED".equals(nextStatus)) {
                ticket.setRejectionReason(null);
            }
        }

        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    public TicketComment addComment(String ticketId, CreateCommentRequest request) {
        IncidentTicket ticket = getTicket(ticketId);
        User actor = getExistingUser(request.actorUserId());
        Instant now = Instant.now();

        TicketComment comment = new TicketComment(
                UUID.randomUUID().toString(),
                actor.getId(),
                actor.getRole(),
                request.message().trim(),
                now,
                now
        );

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(now);
        ticketRepository.save(ticket);
        return comment;
    }

    public TicketComment updateComment(String ticketId, String commentId, UpdateCommentRequest request) {
        IncidentTicket ticket = getTicket(ticketId);
        User actor = getExistingUser(request.actorUserId());
        TicketComment comment = getComment(ticket, commentId);
        ensureCommentOwnership(actor, comment);

        comment.setMessage(request.message().trim());
        comment.setUpdatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());
        ticketRepository.save(ticket);
        return comment;
    }

    public IncidentTicket deleteComment(String ticketId, String commentId, String actorUserId) {
        IncidentTicket ticket = getTicket(ticketId);
        User actor = getExistingUser(actorUserId);
        TicketComment comment = getComment(ticket, commentId);
        ensureCommentOwnership(actor, comment);

        ticket.getComments().removeIf(existing -> existing.getId().equals(commentId));
        ticket.setUpdatedAt(Instant.now());
        return ticketRepository.save(ticket);
    }

    private IncidentTicket getTicket(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found."));
    }

    private User getExistingUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private void validatePriority(String priority) {
        String normalized = priority.trim().toUpperCase();
        if (!VALID_PRIORITIES.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Priority must be LOW, MEDIUM, HIGH, or CRITICAL.");
        }
    }

    private void validateAttachments(List<String> attachments) {
        if (attachments == null || attachments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one image attachment is required.");
        }
        if (attachments.size() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only up to 3 image attachments are allowed.");
        }
        boolean invalidAttachment = attachments.stream().anyMatch(item -> item == null || item.isBlank());
        if (invalidAttachment) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image attachments cannot be empty.");
        }
    }

    private void ensureRole(User actor, List<String> roles, String message) {
        if (!roles.contains(actor.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, message);
        }
    }

    private void ensureWorkflowAccess(User actor, IncidentTicket ticket) {
        boolean canManage = "ADMIN".equals(actor.getRole())
                || "TECHNICIAN".equals(actor.getRole());
        if (!canManage) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only a technician or an admin can update this ticket.");
        }
        if ("TECHNICIAN".equals(actor.getRole()) && ticket.getAssignedStaffUserId() == null) {
            ticket.setAssignedStaffUserId(actor.getId());
        }
    }

    private TicketComment getComment(IncidentTicket ticket, String commentId) {
        return ticket.getComments().stream()
                .filter(comment -> comment.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found."));
    }

    private void ensureCommentOwnership(User actor, TicketComment comment) {
        boolean allowed = actor.getId().equals(comment.getAuthorUserId()) || "ADMIN".equals(actor.getRole());
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the comment owner or an admin can edit/delete this comment.");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
