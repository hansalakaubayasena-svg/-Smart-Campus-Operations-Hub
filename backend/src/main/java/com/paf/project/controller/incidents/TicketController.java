package com.paf.project.controller.incidents;

import com.paf.project.model.incidents.IncidentTicket;
import com.paf.project.model.incidents.TicketComment;
import com.paf.project.service.incidents.IncidentTicketService;
import com.paf.project.service.incidents.dto.AssignTicketRequest;
import com.paf.project.service.incidents.dto.CreateCommentRequest;
import com.paf.project.service.incidents.dto.CreateTicketRequest;
import com.paf.project.service.incidents.dto.UpdateCommentRequest;
import com.paf.project.service.incidents.dto.UpdateTicketStatusRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final IncidentTicketService incidentTicketService;

    public TicketController(IncidentTicketService incidentTicketService) {
        this.incidentTicketService = incidentTicketService;
    }

    @GetMapping
    public List<IncidentTicket> getTickets() {
        return incidentTicketService.getTickets();
    }

    @PostMapping
    public IncidentTicket createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return incidentTicketService.createTicket(request);
    }

    @PutMapping("/{ticketId}/assign")
    public IncidentTicket assignTicket(@PathVariable String ticketId, @Valid @RequestBody AssignTicketRequest request) {
        return incidentTicketService.assignTicket(ticketId, request);
    }

    @PutMapping("/{ticketId}/status")
    public IncidentTicket updateStatus(@PathVariable String ticketId, @Valid @RequestBody UpdateTicketStatusRequest request) {
        return incidentTicketService.updateStatus(ticketId, request);
    }

    @PostMapping("/{ticketId}/comments")
    public TicketComment addComment(@PathVariable String ticketId, @Valid @RequestBody CreateCommentRequest request) {
        return incidentTicketService.addComment(ticketId, request);
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public TicketComment updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody UpdateCommentRequest request
    ) {
        return incidentTicketService.updateComment(ticketId, commentId, request);
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public IncidentTicket deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam String actorUserId
    ) {
        return incidentTicketService.deleteComment(ticketId, commentId, actorUserId);
    }
}
