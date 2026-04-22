package com.paf.project.dto.facilities;

public record FacilityFilter(
        ResourceKind resourceKind,
        String type,
        String category,
        Integer minCapacity,
        Integer maxCapacity,
        Integer minQuantity,
        Integer maxQuantity,
        String location,
        String search
) {
}
