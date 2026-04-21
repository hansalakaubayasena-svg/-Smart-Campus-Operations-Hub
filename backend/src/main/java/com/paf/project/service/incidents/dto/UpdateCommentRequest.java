package com.paf.project.service.incidents.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateCommentRequest(
        @NotBlank String actorUserId,
        @NotBlank String message
) {
}
