package com.paf.project.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class CustomExceptions {

    // ── 404 Not Found ────────────────────────────────
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
        public ResourceNotFoundException(String resource, Long id) {
            super(resource + " not found with id: " + id);
        }
        public ResourceNotFoundException(String resource, String field, String value) {
            super(resource + " not found with " + field + ": " + value);
        }
    }

    // ── 409 Conflict ─────────────────────────────────
    @ResponseStatus(HttpStatus.CONFLICT)
    public static class ResourceConflictException extends RuntimeException {
        public ResourceConflictException(String message) {
            super(message);
        }
    }

    // ── 400 Bad Request ──────────────────────────────
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String message) {
            super(message);
        }
    }

    // ── 403 Forbidden ────────────────────────────────
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException(String message) {
            super(message);
        }
        public ForbiddenException() {
            super("You do not have permission to perform this action");
        }
    }

    // ── 401 Unauthorized ─────────────────────────────
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
        public UnauthorizedException() {
            super("Authentication is required to access this resource");
        }
    }

    // ── 422 Unprocessable ────────────────────────────
    @ResponseStatus(HttpStatus.CONFLICT)
    public static class UnprocessableEntityException extends RuntimeException {
        public UnprocessableEntityException(String message) {
            super(message);
        }
    }

    // ── Booking Conflict ─────────────────────────────
    @ResponseStatus(HttpStatus.CONFLICT)
    public static class BookingConflictException extends RuntimeException {
        public BookingConflictException(String message) {
            super(message);
        }
    }

    // ── File Upload ──────────────────────────────────
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class FileUploadException extends RuntimeException {
        public FileUploadException(String message) {
            super(message);
        }
    }
}
