package com.paf.project.dto.facilities;

public record FacilityFilter(
        String type,
        String category,
        Integer minCapacity,
        Integer maxCapacity,
        String location,
        String search
) {
}
