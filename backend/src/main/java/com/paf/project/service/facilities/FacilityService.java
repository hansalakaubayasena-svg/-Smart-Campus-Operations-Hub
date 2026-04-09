package com.paf.project.service.facilities;

import com.paf.project.dto.facilities.CreateFacilityRequest;
import com.paf.project.dto.facilities.FacilityFilter;
import com.paf.project.dto.facilities.FacilityResponse;
import com.paf.project.dto.facilities.UpdateFacilityRequest;
import com.paf.project.dto.facilities.UpdateFacilityStatusRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FacilityService {
    List<FacilityResponse> getFacilities(FacilityFilter filter);

    FacilityResponse getByResourceId(String resourceId);

    FacilityResponse create(CreateFacilityRequest request);

    FacilityResponse update(String resourceId, UpdateFacilityRequest request);

    FacilityResponse updateStatus(String resourceId, UpdateFacilityStatusRequest request);

    FacilityResponse updateImage(String resourceId, MultipartFile file);

    String uploadImage(MultipartFile file);

    void delete(String resourceId);
}
