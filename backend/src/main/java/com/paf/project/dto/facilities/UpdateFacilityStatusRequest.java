package com.paf.project.dto.facilities;

import jakarta.validation.constraints.NotNull;

public record UpdateFacilityStatusRequest(
        @NotNull(message = "status is required")
        FacilityStatus status
) {
}
