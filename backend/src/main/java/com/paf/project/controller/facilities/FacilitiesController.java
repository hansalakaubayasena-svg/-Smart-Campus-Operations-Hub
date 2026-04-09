package com.paf.project.controller.facilities;

import com.paf.project.dto.facilities.CreateFacilityRequest;
import com.paf.project.dto.facilities.FacilityFilter;
import com.paf.project.dto.facilities.FacilityResponse;
import com.paf.project.dto.facilities.FacilityType;
import com.paf.project.dto.facilities.UpdateFacilityRequest;
import com.paf.project.dto.facilities.UpdateFacilityStatusRequest;
import com.paf.project.service.facilities.FacilityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@Validated
public class FacilitiesController {

    private final FacilityService facilityService;

    public FacilitiesController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<List<FacilityResponse>> getFacilities(
            @RequestHeader("X-ROLE") String role,
            @RequestParam(required = false) FacilityType type,
            @RequestParam(required = false) @Min(0) Integer minCapacity,
            @RequestParam(required = false) @Min(0) Integer maxCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, name = "q") String search
    ) {
        assertCanRead(role);
        FacilityFilter filter = new FacilityFilter(type, minCapacity, maxCapacity, location, search);
        return ResponseEntity.ok(facilityService.getFacilities(filter));
    }

    @GetMapping("/{resourceId}")
    public ResponseEntity<FacilityResponse> getFacility(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String resourceId
    ) {
        assertCanRead(role);
        return ResponseEntity.ok(facilityService.getByResourceId(resourceId));
    }

    @PostMapping
    public ResponseEntity<FacilityResponse> createFacility(
            @RequestHeader("X-ROLE") String role,
            @Valid @RequestBody CreateFacilityRequest request
    ) {
        assertAdmin(role);
        FacilityResponse created = facilityService.create(request);
        return ResponseEntity
            .created(URI.create("/api/facilities/" + created.resourceId()))
            .body(created);
    }

    @PutMapping("/{resourceId}")
    public ResponseEntity<FacilityResponse> updateFacility(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String resourceId,
            @Valid @RequestBody UpdateFacilityRequest request
    ) {
        assertAdmin(role);
        return ResponseEntity.ok(facilityService.update(resourceId, request));
    }

    @PatchMapping("/{resourceId}/status")
    public ResponseEntity<FacilityResponse> updateFacilityStatus(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String resourceId,
            @Valid @RequestBody UpdateFacilityStatusRequest request
    ) {
        assertAdmin(role);
        return ResponseEntity.ok(facilityService.updateStatus(resourceId, request));
    }

    @PutMapping(path = "/{resourceId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FacilityResponse> updateFacilityImage(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String resourceId,
            @RequestParam("file") MultipartFile file
    ) {
        assertAdmin(role);
        return ResponseEntity.ok(facilityService.updateImage(resourceId, file));
    }

    @PostMapping(path = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFacilityImage(
            @RequestHeader("X-ROLE") String role,
            @RequestParam("file") MultipartFile file
    ) {
        assertAdmin(role);
        String imageUrl = facilityService.uploadImage(file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void> deleteFacility(
            @RequestHeader("X-ROLE") String role,
            @PathVariable String resourceId
    ) {
        assertAdmin(role);
        facilityService.delete(resourceId);
        return ResponseEntity.noContent().build();
    }

    private void assertCanRead(String role) {
        String normalized = normalizeRole(role);
        if (!"ADMIN".equals(normalized) && !"USER".equals(normalized)) {
            throw new SecurityException("Only ADMIN or USER can access facilities catalogue.");
        }
    }

    private void assertAdmin(String role) {
        String normalized = normalizeRole(role);
        if (!"ADMIN".equals(normalized)) {
            throw new SecurityException("Only ADMIN can modify facilities catalogue.");
        }
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "";
        }
        return role.trim().toUpperCase(Locale.ROOT);
    }
}
