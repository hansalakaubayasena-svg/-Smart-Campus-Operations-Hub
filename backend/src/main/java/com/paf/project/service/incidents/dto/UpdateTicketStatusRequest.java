package com.paf.project.service.incidents.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateTicketStatusRequest(
        @NotBlank String actorUserId,
        @NotBlank String status,
        String resolutionNotes,
        String rejectionReason
) {
}
