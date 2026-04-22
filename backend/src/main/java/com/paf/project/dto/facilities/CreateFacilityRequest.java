package com.paf.project.dto.facilities;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateFacilityRequest(
        @NotBlank(message = "resourceId is required")
        String resourceId,

        @NotNull(message = "resourceKind is required")
        ResourceKind resourceKind,

        @NotBlank(message = "type is required")
        @Size(max = 120, message = "type must be at most 120 characters")
        String type,

        @NotBlank(message = "category is required")
        @Size(max = 120, message = "category must be at most 120 characters")
        String category,

        @NotBlank(message = "nameOrModel is required")
        @Size(max = 120, message = "nameOrModel must be at most 120 characters")
        String nameOrModel,

        @Min(value = 0, message = "capacity must be 0 or greater")
        Integer capacity,

        @Min(value = 0, message = "quantity must be 0 or greater")
        Integer quantity,

        @NotBlank(message = "location is required")
        @Size(max = 120, message = "location must be at most 120 characters")
        String location,

        @Size(max = 1000, message = "description must be at most 1000 characters")
        String description,

        @NotEmpty(message = "availabilityWindows is required")
        List<@NotBlank(message = "availabilityWindows values cannot be blank") String> availabilityWindows,

        String imageUrl,

        @NotNull(message = "status is required")
        FacilityStatus status
) {
}
