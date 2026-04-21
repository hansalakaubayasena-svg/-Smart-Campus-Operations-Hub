package com.paf.project.dto.facilities;

import java.util.List;

public record FacilityTypeResponse(
        String id,
        String name,
        List<FacilityCategoryResponse> categories
) {
}
