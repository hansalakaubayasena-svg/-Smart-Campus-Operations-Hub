package com.paf.project.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    // Only required when changing password — null is fine otherwise
    private String currentPassword;

    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;
}
