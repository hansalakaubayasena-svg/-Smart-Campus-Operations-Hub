package com.paf.project.core.util;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private int status;
    private String message;
    private T data;
    private Object errors;
    private LocalDateTime timestamp;

    // ── Constructor ──────────────
    private ApiResponse(boolean success, int status, String message, T data, Object errors) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    // ── Success Responses ────────────────────────────

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, 200, "Success", data, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, 200, message, data, null);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(true, 201, message, data, null);
    }

    public static <T> ApiResponse<T> noContent(String message) {
        return new ApiResponse<>(true, 204, message, null, null);
    }

    // ── Error Responses ──────────────────────────────

    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(false, status, message, null, null);
    }

    public static <T> ApiResponse<T> error(int status, String message, Object errors) {
        return new ApiResponse<>(false, status, message, null, errors);
    }

    // ── Getters ──────────────────────────────────────

    public boolean isSuccess() { return success; }
    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public Object getErrors() { return errors; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
