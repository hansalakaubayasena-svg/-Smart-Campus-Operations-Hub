package com.paf.project.dto.incidents;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AddCommentRequest {
    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 500, message = "Comment must be under 500 characters")
    private String message;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
