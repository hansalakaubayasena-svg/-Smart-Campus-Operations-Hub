package com.paf.project.dto.facilities;

import java.util.List;

public record FacilityResponse(
        String id,
        String resourceId,
        FacilityType type,
        String nameOrModel,
        Integer capacity,
        String location,
        List<String> availabilityWindows,
        String imageUrl,
        FacilityStatus status
) {
}
