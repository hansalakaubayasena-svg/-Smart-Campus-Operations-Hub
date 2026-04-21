package com.paf.project.dto.facilities;

import java.util.List;

public record FacilityTaxonomyResponse(
        List<FacilityTypeResponse> types
) {
}
