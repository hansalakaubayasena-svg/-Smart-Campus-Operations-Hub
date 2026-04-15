package com.paf.project.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    // Single response shape used for register, login, and /me
    // Frontend always gets the same structure regardless of auth method
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
}
