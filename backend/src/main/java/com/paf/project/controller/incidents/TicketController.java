package com.paf.project.controller.incidents;

import com.paf.project.core.exception.CustomExceptions.BadRequestException;
import com.paf.project.core.exception.CustomExceptions.ForbiddenException;
import com.paf.project.core.exception.CustomExceptions.ResourceNotFoundException;
import com.paf.project.core.util.ApiResponse;
import com.paf.project.dto.incidents.AddCommentRequest;
import com.paf.project.dto.incidents.AssignTicketRequest;
import com.paf.project.dto.incidents.CreateTicketRequest;
import com.paf.project.dto.incidents.StaffOptionResponse;
import com.paf.project.dto.incidents.UpdateCommentRequest;
import com.paf.project.dto.incidents.UpdateTicketStatusRequest;
import com.paf.project.model.auth.User;
import com.paf.project.model.incidents.IncidentTicket;
import com.paf.project.repository.auth.UserRepository;
import com.paf.project.repository.incidents.TicketRepository;
import com.paf.project.service.auth.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private static final List<String> VALID_PRIORITIES = List.of("LOW", "MEDIUM", "HIGH", "CRITICAL");
    private static final List<String> VALID_STATUSES = List.of("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED");

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public TicketController(TicketRepository ticketRepository, UserRepository userRepository, UserService userService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        User currentUser = userService.getCurrentUser();
        validatePriority(request.getPriority());
        List<CreateTicketRequest.AttachmentPayload> attachments =
            request.getAttachments() == null ? List.of() : request.getAttachments();
        validateAttachments(attachments);

        LocalDateTime now = LocalDateTime.now();
        IncidentTicket ticket = new IncidentTicket();
        ticket.setResourceId(blankToNull(request.getResourceId()));
        ticket.setResourceName(request.getResourceName().trim());
        ticket.setLocation(request.getLocation().trim());
        ticket.setCategory(request.getCategory().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(request.getPriority().trim().toUpperCase(Locale.ROOT));
        ticket.setStatus("OPEN");
        ticket.setReporterUserId(currentUser.getId());
        ticket.setReporterName(currentUser.getFullName());
        ticket.setReporterEmail(currentUser.getEmail());
        ticket.setPreferredContact(request.getPreferredContact().toContactDetails());
        ticket.setAttachments(attachments.stream()
            .map(CreateTicketRequest.AttachmentPayload::toAttachment)
            .collect(Collectors.toCollection(ArrayList::new)));
        ticket.setComments(new ArrayList<>());
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);

        IncidentTicket saved = ticketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created("Ticket created successfully", saved));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<IncidentTicket>>> getTickets(
        @RequestParam(required = false) String status
    ) {
        User currentUser = userService.getCurrentUser();
        List<IncidentTicket> tickets = isStaff(currentUser)
            ? ticketRepository.findAllByOrderByCreatedAtDesc()
            : ticketRepository.findByReporterUserIdOrderByCreatedAtDesc(currentUser.getId());

        if (status != null && !status.isBlank()) {
            String normalized = status.trim().toUpperCase(Locale.ROOT);
            tickets = tickets.stream()
                .filter(ticket -> Objects.equals(ticket.getStatus(), normalized))
                .collect(Collectors.toList());
        }

        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved", tickets));
    }

    @GetMapping("/staff-options")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StaffOptionResponse>>> getStaffOptions() {
        User currentUser = userService.getCurrentUser();
        if (!isStaff(currentUser)) {
            throw new ForbiddenException("Only staff members can assign tickets");
        }

        List<StaffOptionResponse> staff = userRepository.findAll().stream()
            .filter(this::isStaff)
            .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
            .map(user -> new StaffOptionResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Staff list retrieved", staff));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> getTicketById(@PathVariable String id) {
        User currentUser = userService.getCurrentUser();
        IncidentTicket ticket = findTicket(id);
        assertTicketAccess(ticket, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved", ticket));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> assignTicket(
        @PathVariable String id,
        @Valid @RequestBody AssignTicketRequest request
    ) {
        User currentUser = userService.getCurrentUser();
        if (!isStaff(currentUser)) {
            throw new ForbiddenException("Only staff members can assign tickets");
        }

        IncidentTicket ticket = findTicket(id);
        User assignee = userRepository.findById(request.getStaffUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.getStaffUserId()));

        if (!isStaff(assignee)) {
            throw new BadRequestException("Tickets can only be assigned to staff members");
        }

        ticket.setAssignedStaffId(assignee.getId());
        ticket.setAssignedStaffName(assignee.getFullName());
        ticket.setAssignedStaffEmail(assignee.getEmail());
        ticket.setUpdatedAt(LocalDateTime.now());

        if ("OPEN".equals(ticket.getStatus())) {
            ticket.setStatus("IN_PROGRESS");
        }

        return ResponseEntity.ok(ApiResponse.success("Ticket assigned successfully", ticketRepository.save(ticket)));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> updateTicketStatus(
        @PathVariable String id,
        @Valid @RequestBody UpdateTicketStatusRequest request
    ) {
        User currentUser = userService.getCurrentUser();
        if (!isStaff(currentUser)) {
            throw new ForbiddenException("Only staff members can update ticket status");
        }

        IncidentTicket ticket = findTicket(id);
        String nextStatus = request.getStatus().trim().toUpperCase(Locale.ROOT);
        validateStatus(nextStatus);
        validateStatusTransition(ticket, nextStatus, currentUser);

        LocalDateTime now = LocalDateTime.now();
        ticket.setStatus(nextStatus);
        ticket.setUpdatedAt(now);

        if ("RESOLVED".equals(nextStatus) || "CLOSED".equals(nextStatus)) {
            if (request.getResolutionNotes() == null || request.getResolutionNotes().isBlank()) {
                throw new BadRequestException("Resolution notes are required when resolving a ticket");
            }
            ticket.setResolutionNotes(request.getResolutionNotes().trim());
            if (ticket.getResolvedAt() == null) {
                ticket.setResolvedAt(now);
            }
            ticket.setRejectionReason(null);
        }

        if ("REJECTED".equals(nextStatus)) {
            if (!User.Role.ADMINISTRATOR.equals(currentUser.getRole())) {
                throw new ForbiddenException("Only administrators can reject tickets");
            }
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new BadRequestException("Rejection reason is required when rejecting a ticket");
            }
            ticket.setRejectionReason(request.getRejectionReason().trim());
            ticket.setResolutionNotes(null);
            ticket.setResolvedAt(null);
            ticket.setClosedAt(null);
        }

        if ("IN_PROGRESS".equals(nextStatus) || "OPEN".equals(nextStatus)) {
            ticket.setRejectionReason(null);
            if (!"OPEN".equals(nextStatus)) {
                ticket.setResolutionNotes(blankToNull(request.getResolutionNotes()));
            }
            ticket.setResolvedAt(null);
            ticket.setClosedAt(null);
        }

        if ("CLOSED".equals(nextStatus)) {
            ticket.setClosedAt(now);
        }

        return ResponseEntity.ok(ApiResponse.success("Ticket status updated", ticketRepository.save(ticket)));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> addComment(
        @PathVariable String id,
        @Valid @RequestBody AddCommentRequest request
    ) {
        User currentUser = userService.getCurrentUser();
        IncidentTicket ticket = findTicket(id);
        assertTicketAccess(ticket, currentUser);

        LocalDateTime now = LocalDateTime.now();
        IncidentTicket.Comment comment = new IncidentTicket.Comment(
            currentUser.getId(),
            currentUser.getFullName(),
            currentUser.getRole().name(),
            request.getMessage().trim(),
            now,
            now
        );

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(now);

        return ResponseEntity.ok(ApiResponse.success("Comment added", ticketRepository.save(ticket)));
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> updateComment(
        @PathVariable String ticketId,
        @PathVariable String commentId,
        @Valid @RequestBody UpdateCommentRequest request
    ) {
        User currentUser = userService.getCurrentUser();
        IncidentTicket ticket = findTicket(ticketId);
        assertTicketAccess(ticket, currentUser);

        IncidentTicket.Comment comment = ticket.getComments().stream()
            .filter(item -> Objects.equals(item.getId(), commentId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!canManageComment(currentUser, comment)) {
            throw new ForbiddenException("You can only edit your own comments");
        }

        comment.setMessage(request.getMessage().trim());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(ApiResponse.success("Comment updated", ticketRepository.save(ticket)));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<IncidentTicket>> deleteComment(
        @PathVariable String ticketId,
        @PathVariable String commentId
    ) {
        User currentUser = userService.getCurrentUser();
        IncidentTicket ticket = findTicket(ticketId);
        assertTicketAccess(ticket, currentUser);

        IncidentTicket.Comment comment = ticket.getComments().stream()
            .filter(item -> Objects.equals(item.getId(), commentId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!canManageComment(currentUser, comment)) {
            throw new ForbiddenException("You can only delete your own comments");
        }

        ticket.getComments().removeIf(item -> Objects.equals(item.getId(), commentId));
        ticket.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(ApiResponse.success("Comment deleted", ticketRepository.save(ticket)));
    }

    private IncidentTicket findTicket(String id) {
        return ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket", id));
    }

    private void assertTicketAccess(IncidentTicket ticket, User user) {
        if (isStaff(user)) {
            return;
        }
        if (!Objects.equals(ticket.getReporterUserId(), user.getId())) {
            throw new ForbiddenException("You can only access your own tickets");
        }
    }

    private boolean canManageComment(User user, IncidentTicket.Comment comment) {
        return Objects.equals(user.getId(), comment.getAuthorUserId())
            || User.Role.ADMINISTRATOR.equals(user.getRole());
    }

    private boolean isStaff(User user) {
        return user.getRole() != User.Role.STUDENT;
    }

    private void validatePriority(String priority) {
        String normalized = priority.trim().toUpperCase(Locale.ROOT);
        if (!VALID_PRIORITIES.contains(normalized)) {
            throw new BadRequestException("Priority must be one of LOW, MEDIUM, HIGH, CRITICAL");
        }
    }

    private void validateStatus(String status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new BadRequestException("Invalid status supplied");
        }
    }

    private void validateAttachments(List<CreateTicketRequest.AttachmentPayload> attachments) {
        if (attachments == null || attachments.isEmpty()) {
            return;
        }
        if (attachments.size() > 3) {
            throw new BadRequestException("You can upload up to 3 image attachments");
        }

        boolean invalidAttachment = attachments.stream().anyMatch(item ->
            item.getContentType() == null
                || !item.getContentType().toLowerCase(Locale.ROOT).startsWith("image/")
                || item.getDataUrl() == null
                || !item.getDataUrl().startsWith("data:image/")
        );

        if (invalidAttachment) {
            throw new BadRequestException("Only image attachments are allowed");
        }
    }

    private void validateStatusTransition(IncidentTicket ticket, String nextStatus, User currentUser) {
        String currentStatus = ticket.getStatus();

        if ("CLOSED".equals(currentStatus)) {
            throw new BadRequestException("Closed tickets cannot be changed");
        }
        if ("REJECTED".equals(currentStatus)) {
            throw new BadRequestException("Rejected tickets cannot be changed");
        }
        if ("OPEN".equals(nextStatus) && !"OPEN".equals(currentStatus)) {
            throw new BadRequestException("Tickets cannot move back to OPEN");
        }
        if ("CLOSED".equals(nextStatus) && !"RESOLVED".equals(currentStatus)) {
            throw new BadRequestException("Only resolved tickets can be closed");
        }
        if (("IN_PROGRESS".equals(nextStatus) || "RESOLVED".equals(nextStatus)) && needsAssignee(ticket)) {
            ticket.setAssignedStaffId(currentUser.getId());
            ticket.setAssignedStaffName(currentUser.getFullName());
            ticket.setAssignedStaffEmail(currentUser.getEmail());
        }
    }

    private boolean needsAssignee(IncidentTicket ticket) {
        return ticket.getAssignedStaffId() == null || ticket.getAssignedStaffId().isBlank();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
