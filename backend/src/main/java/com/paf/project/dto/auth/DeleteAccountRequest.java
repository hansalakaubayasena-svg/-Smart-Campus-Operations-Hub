package com.paf.project.dto.auth;

import lombok.Data;

@Data
public class DeleteAccountRequest {
    // Null is acceptable for OAuth-only accounts (no password set)
    private String password;
}
