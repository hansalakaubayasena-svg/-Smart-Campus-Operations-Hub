package com.paf.project.service.facilities;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.paf.project.core.exception.CustomExceptions.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:${CLOUDINARY_CLOUD_NAME:}}") String cloudName,
            @Value("${cloudinary.api-key:${CLOUDINARY_API_KEY:}}") String apiKey,
            @Value("${cloudinary.api-secret:${CLOUDINARY_API_SECRET:}}") String apiSecret
    ) {
        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            throw new FileUploadException("Cloudinary is not configured. Set cloudinary.* or CLOUDINARY_* properties.");
        }

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
        this.cloudinary.config.secure = true;
    }

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Image file is required.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new FileUploadException("Only image files are allowed.");
        }

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "smart-campus/facilities")
            );
            Object secureUrl = result.get("secure_url");
            if (secureUrl == null) {
                throw new FileUploadException("Image upload failed: secure URL was not returned.");
            }
            return secureUrl.toString();
        } catch (IOException e) {
            throw new FileUploadException("Failed to read the uploaded image.");
        } catch (Exception e) {
            throw new FileUploadException("Image upload failed on Cloudinary. Verify credentials and network access.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
