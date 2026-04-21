package com.paf.project.service.incidents.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignTicketRequest(
        @NotBlank String adminUserId,
        @NotBlank String assigneeUserId
) {
}
