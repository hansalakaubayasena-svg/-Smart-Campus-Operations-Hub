package com.paf.project.controller.facilities;

import com.paf.project.dto.facilities.CreateFacilityCategoryRequest;
import com.paf.project.dto.facilities.CreateFacilityTypeRequest;
import com.paf.project.dto.facilities.FacilityCategoryResponse;
import com.paf.project.dto.facilities.FacilityTaxonomyResponse;
import com.paf.project.dto.facilities.FacilityTypeResponse;
import com.paf.project.service.facilities.FacilityTaxonomyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/facilities/taxonomy")
@Validated
public class FacilityTaxonomyController {
    private final FacilityTaxonomyService facilityTaxonomyService;

    public FacilityTaxonomyController(FacilityTaxonomyService facilityTaxonomyService) {
        this.facilityTaxonomyService = facilityTaxonomyService;
    }

    @GetMapping
    public ResponseEntity<FacilityTaxonomyResponse> getTaxonomy(@RequestHeader("X-ROLE") String role) {
        assertCanRead(role);
        return ResponseEntity.ok(facilityTaxonomyService.getTaxonomy());
    }

    @PostMapping("/types")
    public ResponseEntity<FacilityTypeResponse> createType(
            @RequestHeader("X-ROLE") String role,
            @Valid @RequestBody CreateFacilityTypeRequest request
    ) {
        assertAdmin(role);
        return ResponseEntity.ok(facilityTaxonomyService.createType(request));
    }

    @PostMapping("/types/{typeId}/categories")
    public ResponseEntity<FacilityCategoryResponse> createCategory(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String typeId,
            @Valid @RequestBody CreateFacilityCategoryRequest request
    ) {
        assertAdmin(role);
        return ResponseEntity.ok(facilityTaxonomyService.createCategory(typeId, request));
    }

    @DeleteMapping("/types/{typeId}")
    public ResponseEntity<Void> deleteType(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String typeId
    ) {
        assertAdmin(role);
        facilityTaxonomyService.deleteType(typeId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/types/{typeId}/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String typeId,
            @PathVariable String categoryId
    ) {
        assertAdmin(role);
        facilityTaxonomyService.deleteCategory(typeId, categoryId);
        return ResponseEntity.noContent().build();
    }

    private void assertCanRead(String role) {
        if (!"ADMIN".equalsIgnoreCase(role) && !"USER".equalsIgnoreCase(role)) {
            throw new SecurityException("Only ADMIN or USER can access facilities taxonomy.");
        }
    }

    private void assertAdmin(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new SecurityException("Only ADMIN can modify facilities taxonomy.");
        }
    }
}
