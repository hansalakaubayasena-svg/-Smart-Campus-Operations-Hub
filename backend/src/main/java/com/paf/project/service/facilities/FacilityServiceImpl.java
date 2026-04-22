package com.paf.project.service.facilities;

import com.paf.project.dto.facilities.CreateFacilityRequest;
import com.paf.project.dto.facilities.FacilityFilter;
import com.paf.project.dto.facilities.FacilityResponse;
import com.paf.project.dto.facilities.ResourceKind;
import com.paf.project.dto.facilities.UpdateFacilityRequest;
import com.paf.project.dto.facilities.UpdateFacilityStatusRequest;
import com.paf.project.core.exception.CustomExceptions.BadRequestException;
import com.paf.project.exception.ResourceConflictException;
import com.paf.project.exception.ResourceNotFoundException;
import com.paf.project.model.facilities.Facility;
import com.paf.project.repository.facilities.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final CloudinaryService cloudinaryService;
    private final FacilityTaxonomyService facilityTaxonomyService;

    public FacilityServiceImpl(
            FacilityRepository facilityRepository,
            CloudinaryService cloudinaryService,
            FacilityTaxonomyService facilityTaxonomyService
    ) {
        this.facilityRepository = facilityRepository;
        this.cloudinaryService = cloudinaryService;
        this.facilityTaxonomyService = facilityTaxonomyService;
    }

    @Override
    public List<FacilityResponse> getFacilities(FacilityFilter filter) {
        return facilityRepository.findAll()
                .stream()
                .filter(facility -> matchesResourceKind(filter.resourceKind(), facility))
                .filter(facility -> matches(filter.type(), facility.getType()))
                .filter(facility -> matches(filter.category(), facility.getCategory()))
                .filter(facility -> matchesCapacityRange(filter, facility))
                .filter(facility -> matchesQuantityRange(filter, facility))
                .filter(facility -> isLocationMatch(facility, filter.location()))
                .filter(facility -> isSearchMatch(facility, filter.search()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public FacilityResponse getByResourceId(String resourceId) {
        return toResponse(getRequiredByResourceId(resourceId));
    }

    @Override
    public FacilityResponse create(CreateFacilityRequest request) {
        if (facilityRepository.existsByResourceId(request.resourceId())) {
            throw new ResourceConflictException("Facility with resourceId '" + request.resourceId() + "' already exists.");
        }

        Facility facility = new Facility();
        facility.setResourceId(request.resourceId());
        ResourceKind resourceKind = request.resourceKind();
        validateResourceMetrics(resourceKind, request.capacity(), request.quantity());
        facility.setResourceKind(resourceKind.name());
        facility.setType(facilityTaxonomyService.resolveTypeName(request.type()));
        facility.setCategory(facilityTaxonomyService.resolveCategoryName(request.type(), request.category()));
        facility.setNameOrModel(request.nameOrModel());
        facility.setCapacity(resourceKind == ResourceKind.FACILITY ? request.capacity() : null);
        facility.setQuantity(resourceKind == ResourceKind.ASSET ? request.quantity() : null);
        facility.setLocation(request.location());
        facility.setDescription(request.description());
        facility.setAvailabilityWindows(request.availabilityWindows());
        facility.setImageUrl(request.imageUrl());
        facility.setStatus(request.status().name());

        return toResponse(facilityRepository.save(facility));
    }

    @Override
    public FacilityResponse update(String resourceId, UpdateFacilityRequest request) {
        Facility facility = getRequiredByResourceId(resourceId);
        ResourceKind resourceKind = request.resourceKind();
        validateResourceMetrics(resourceKind, request.capacity(), request.quantity());

        facility.setResourceKind(resourceKind.name());
        facility.setType(facilityTaxonomyService.resolveTypeName(request.type()));
        facility.setCategory(facilityTaxonomyService.resolveCategoryName(request.type(), request.category()));
        facility.setNameOrModel(request.nameOrModel());
        facility.setCapacity(resourceKind == ResourceKind.FACILITY ? request.capacity() : null);
        facility.setQuantity(resourceKind == ResourceKind.ASSET ? request.quantity() : null);
        facility.setLocation(request.location());
        facility.setDescription(request.description());
        facility.setAvailabilityWindows(request.availabilityWindows());
        facility.setImageUrl(request.imageUrl());
        facility.setStatus(request.status().name());

        return toResponse(facilityRepository.save(facility));
    }

    @Override
    public FacilityResponse updateStatus(String resourceId, UpdateFacilityStatusRequest request) {
        Facility facility = getRequiredByResourceId(resourceId);
        facility.setStatus(request.status().name());
        return toResponse(facilityRepository.save(facility));
    }

    @Override
    public FacilityResponse updateImage(String resourceId, MultipartFile file) {
        Facility facility = getRequiredByResourceId(resourceId);
        facility.setImageUrl(uploadImage(file));
        return toResponse(facilityRepository.save(facility));
    }

    @Override
    public String uploadImage(MultipartFile file) {
        return cloudinaryService.uploadImage(file);
    }

    @Override
    public void delete(String resourceId) {
        Facility facility = getRequiredByResourceId(resourceId);
        facilityRepository.delete(Objects.requireNonNull(facility));
    }

    private Facility getRequiredByResourceId(String resourceId) {
        return facilityRepository.findByResourceId(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility with resourceId '" + resourceId + "' not found."));
    }

    private boolean isLocationMatch(Facility facility, String location) {
        if (location == null || location.isBlank()) {
            return true;
        }
        return normalize(facility.getLocation()).contains(normalize(location));
    }

    private boolean matchesResourceKind(ResourceKind filterKind, Facility facility) {
        if (filterKind == null) {
            return true;
        }
        return resolveResourceKind(facility) == filterKind;
    }

    private boolean matchesCapacityRange(FacilityFilter filter, Facility facility) {
        if (filter.minCapacity() == null && filter.maxCapacity() == null) {
            return true;
        }
        Integer capacity = facility.getCapacity();
        if (capacity == null) {
            return false;
        }
        return (filter.minCapacity() == null || capacity >= filter.minCapacity())
                && (filter.maxCapacity() == null || capacity <= filter.maxCapacity());
    }

    private boolean matchesQuantityRange(FacilityFilter filter, Facility facility) {
        if (filter.minQuantity() == null && filter.maxQuantity() == null) {
            return true;
        }
        Integer quantity = facility.getQuantity();
        if (quantity == null) {
            return false;
        }
        return (filter.minQuantity() == null || quantity >= filter.minQuantity())
                && (filter.maxQuantity() == null || quantity <= filter.maxQuantity());
    }

    private boolean isSearchMatch(Facility facility, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String q = normalize(search);
        return normalize(facility.getResourceId()).contains(q)
                || normalize(facility.getNameOrModel()).contains(q)
                || normalize(facility.getLocation()).contains(q)
                || normalize(facility.getType()).contains(q)
                || normalize(facility.getCategory()).contains(q);
    }

    private boolean matches(String filterValue, String actualValue) {
        if (filterValue == null || filterValue.isBlank() || "All".equalsIgnoreCase(filterValue)) {
            return true;
        }
        return normalize(actualValue).equals(normalize(filterValue));
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim().replace('_', ' ');
    }

    private String displayLabel(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return toTitleCase(normalize(value));
    }

    private String toTitleCase(String value) {
        String[] words = value.trim().split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String word : words) {
            if (word.isBlank()) {
                continue;
            }
            if (!builder.isEmpty()) {
                builder.append(' ');
            }
            builder.append(Character.toUpperCase(word.charAt(0)));
            if (word.length() > 1) {
                builder.append(word.substring(1).toLowerCase(Locale.ROOT));
            }
        }
        return builder.toString();
    }

    private String defaultCategoryForType(String type) {
        return displayLabel(type);
    }

    private ResourceKind resolveResourceKind(Facility facility) {
        if (facility.getResourceKind() != null && !facility.getResourceKind().isBlank()) {
            try {
                return ResourceKind.valueOf(facility.getResourceKind().trim().toUpperCase(Locale.ROOT));
            } catch (IllegalArgumentException ignored) {
                // fall through to legacy inference
            }
        }
        return facility.getQuantity() != null ? ResourceKind.ASSET : ResourceKind.FACILITY;
    }

    private void validateResourceMetrics(ResourceKind resourceKind, Integer capacity, Integer quantity) {
        if (resourceKind == ResourceKind.FACILITY) {
            if (capacity == null) {
                throw new BadRequestException("capacity is required for FACILITY resources.");
            }
            return;
        }

        if (resourceKind == ResourceKind.ASSET && quantity == null) {
            throw new BadRequestException("quantity is required for ASSET resources.");
        }
    }

    private FacilityResponse toResponse(Facility facility) {
        ResourceKind resourceKind = resolveResourceKind(facility);
        return new FacilityResponse(
                facility.getId(),
                facility.getResourceId(),
                resourceKind,
                displayLabel(facility.getType()),
                displayLabel(facility.getCategory() == null || facility.getCategory().isBlank()
                        ? defaultCategoryForType(facility.getType())
                        : facility.getCategory()),
                facility.getNameOrModel(),
                facility.getCapacity(),
                facility.getQuantity(),
                facility.getLocation(),
                facility.getDescription(),
                facility.getAvailabilityWindows(),
                facility.getImageUrl(),
                facility.getStatus() != null ? com.paf.project.dto.facilities.FacilityStatus.valueOf(facility.getStatus().toUpperCase(Locale.ROOT)) : null
        );
    }
}
