package com.paf.project.dto.facilities;

public record FacilityFilter(
        FacilityType type,
        Integer minCapacity,
        Integer maxCapacity,
        String location,
        String search
) {
}
