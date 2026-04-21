package com.paf.project.dto.facilities;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFacilityTypeRequest(
        @NotBlank(message = "type name is required")
        @Size(max = 120, message = "type name must be at most 120 characters")
        String name
) {
}
