package com.paf.project.service.incidents.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateTicketRequest(
        @NotBlank String createdByUserId,
        @NotBlank String location,
        @NotBlank String category,
        @NotBlank String description,
        @NotBlank String priority,
        @NotBlank String preferredContactName,
        @Email @NotBlank String preferredContactEmail,
        @NotBlank String preferredContactPhone,
        @NotEmpty @Size(max = 3) List<String> imageAttachments
) {
}
