package com.paf.project.dto.facilities;

import java.util.List;

public record FacilityResponse(
        String id,
        String resourceId,
        ResourceKind resourceKind,
        String type,
        String category,
        String nameOrModel,
        Integer capacity,
        Integer quantity,
        Integer minLoanHours,
        Integer maxLoanHours,
        Integer defaultLoanHours,
        String location,
        String description,
        List<String> availabilityWindows,
        String imageUrl,
        FacilityStatus status
) {
}
