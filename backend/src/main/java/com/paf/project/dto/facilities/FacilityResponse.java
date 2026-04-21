package com.paf.project.dto.facilities;

import java.util.List;

public record FacilityResponse(
        String id,
        String resourceId,
        String type,
        String category,
        String nameOrModel,
        Integer capacity,
        String location,
        String description,
        List<String> availabilityWindows,
        String imageUrl,
        FacilityStatus status
) {
}
