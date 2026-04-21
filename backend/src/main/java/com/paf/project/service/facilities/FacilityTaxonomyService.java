package com.paf.project.service.facilities;

import com.paf.project.dto.facilities.CreateFacilityCategoryRequest;
import com.paf.project.dto.facilities.CreateFacilityTypeRequest;
import com.paf.project.dto.facilities.FacilityCategoryResponse;
import com.paf.project.dto.facilities.FacilityTaxonomyResponse;
import com.paf.project.dto.facilities.FacilityTypeResponse;

public interface FacilityTaxonomyService {
    FacilityTaxonomyResponse getTaxonomy();

    FacilityTypeResponse createType(CreateFacilityTypeRequest request);

    FacilityCategoryResponse createCategory(String typeId, CreateFacilityCategoryRequest request);

    void deleteType(String typeId);

    void deleteCategory(String typeId, String categoryId);

    String resolveTypeName(String typeName);

    String resolveCategoryName(String typeName, String categoryName);
}
