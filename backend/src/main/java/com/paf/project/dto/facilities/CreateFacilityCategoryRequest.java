package com.paf.project.dto.facilities;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFacilityCategoryRequest(
        @NotBlank(message = "category name is required")
        @Size(max = 120, message = "category name must be at most 120 characters")
        String name
) {
}
