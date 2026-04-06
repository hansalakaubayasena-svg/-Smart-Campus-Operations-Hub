package com.paf.project.dto.facilities;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateFacilityRequest(
        @NotNull(message = "type is required")
        FacilityType type,

        @NotBlank(message = "nameOrModel is required")
        @Size(max = 120, message = "nameOrModel must be at most 120 characters")
        String nameOrModel,

        @NotNull(message = "capacity is required")
        @Min(value = 0, message = "capacity must be 0 or greater")
        Integer capacity,

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
