package com.paf.project.service.facilities;

import com.paf.project.dto.facilities.CreateFacilityCategoryRequest;
import com.paf.project.dto.facilities.CreateFacilityTypeRequest;
import com.paf.project.dto.facilities.FacilityCategoryResponse;
import com.paf.project.dto.facilities.FacilityTaxonomyResponse;
import com.paf.project.dto.facilities.FacilityTypeResponse;
import com.paf.project.exception.ResourceNotFoundException;
import com.paf.project.model.facilities.FacilityCategoryOption;
import com.paf.project.model.facilities.FacilityTypeOption;
import com.paf.project.repository.facilities.FacilityCategoryRepository;
import com.paf.project.repository.facilities.FacilityTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class FacilityTaxonomyServiceImpl implements FacilityTaxonomyService {
    private final FacilityTypeRepository facilityTypeRepository;
    private final FacilityCategoryRepository facilityCategoryRepository;

    public FacilityTaxonomyServiceImpl(
            FacilityTypeRepository facilityTypeRepository,
            FacilityCategoryRepository facilityCategoryRepository
    ) {
        this.facilityTypeRepository = facilityTypeRepository;
        this.facilityCategoryRepository = facilityCategoryRepository;
    }

    @Override
    public FacilityTaxonomyResponse getTaxonomy() {
        List<FacilityTypeResponse> types = facilityTypeRepository.findAll()
                .stream()
                .map(type -> new FacilityTypeResponse(
                        type.getId(),
                        type.getName(),
                        facilityCategoryRepository.findByTypeId(type.getId())
                                .stream()
                                .map(category -> new FacilityCategoryResponse(
                                        category.getId(),
                                        type.getId(),
                                        type.getName(),
                                        category.getName()
                                ))
                                .toList()
                ))
                .toList();
        return new FacilityTaxonomyResponse(types);
    }

    @Override
    public FacilityTypeResponse createType(CreateFacilityTypeRequest request) {
        String name = normalizeDisplayName(request.name());
        FacilityTypeOption existing = facilityTypeRepository.findByNameIgnoreCase(name).orElse(null);
        if (existing != null) {
            return new FacilityTypeResponse(existing.getId(), existing.getName(), getCategoriesForType(existing));
        }

        FacilityTypeOption saved = facilityTypeRepository.save(new FacilityTypeOption(null, name));
        return new FacilityTypeResponse(saved.getId(), saved.getName(), List.of());
    }

    @Override
    public FacilityCategoryResponse createCategory(String typeId, CreateFacilityCategoryRequest request) {
        FacilityTypeOption type = facilityTypeRepository.findById(typeId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility type not found."));

        String name = normalizeDisplayName(request.name());
        FacilityCategoryOption existing = facilityCategoryRepository.findByTypeIdAndNameIgnoreCase(typeId, name).orElse(null);
        if (existing != null) {
            return new FacilityCategoryResponse(existing.getId(), type.getId(), type.getName(), existing.getName());
        }

        FacilityCategoryOption saved = facilityCategoryRepository.save(new FacilityCategoryOption(null, typeId, name));
        return new FacilityCategoryResponse(saved.getId(), type.getId(), type.getName(), saved.getName());
    }

    @Override
    public void deleteType(String typeId) {
        FacilityTypeOption type = facilityTypeRepository.findById(typeId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility type not found."));

        facilityCategoryRepository.findByTypeId(type.getId())
                .forEach(facilityCategoryRepository::delete);
        facilityTypeRepository.delete(type);
    }

    @Override
    public void deleteCategory(String typeId, String categoryId) {
        FacilityTypeOption type = facilityTypeRepository.findById(typeId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility type not found."));

        FacilityCategoryOption category = facilityCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility category not found."));

        if (!type.getId().equals(category.getTypeId())) {
            throw new ResourceNotFoundException("Facility category not found.");
        }

        facilityCategoryRepository.delete(category);
    }

    @Override
    public String resolveTypeName(String typeName) {
        String normalized = normalizeDisplayName(typeName);
        return facilityTypeRepository.findByNameIgnoreCase(normalized)
                .map(FacilityTypeOption::getName)
                .orElseThrow(() -> new ResourceNotFoundException("Facility type not found."));
    }

    @Override
    public String resolveCategoryName(String typeName, String categoryName) {
        String resolvedTypeName = resolveTypeName(typeName);
        FacilityTypeOption type = facilityTypeRepository.findByNameIgnoreCase(resolvedTypeName)
                .orElseThrow(() -> new ResourceNotFoundException("Facility type not found."));

        String normalizedCategory = normalizeDisplayName(categoryName);
        return facilityCategoryRepository.findByTypeIdAndNameIgnoreCase(type.getId(), normalizedCategory)
                .map(FacilityCategoryOption::getName)
                .orElseGet(() -> facilityCategoryRepository.save(new FacilityCategoryOption(null, type.getId(), normalizedCategory)).getName());
    }

    private List<FacilityCategoryResponse> getCategoriesForType(FacilityTypeOption type) {
        return facilityCategoryRepository.findByTypeId(type.getId())
                .stream()
                .map(category -> new FacilityCategoryResponse(category.getId(), type.getId(), type.getName(), category.getName()))
                .toList();
    }

    private String normalizeDisplayName(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.trim().replace('_', ' ');
        if (normalized.isBlank()) {
            return "";
        }
        return toTitleCase(normalized.toLowerCase(Locale.ROOT));
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
}
