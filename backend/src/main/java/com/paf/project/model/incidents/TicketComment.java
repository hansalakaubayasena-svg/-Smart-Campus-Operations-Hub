package com.paf.project.model.incidents;

import java.time.Instant;

public class TicketComment {
    private String id;
    private String authorUserId;
    private String authorRole;
    private String message;
    private Instant createdAt;
    private Instant updatedAt;

    public TicketComment() {
    }

    public TicketComment(String id, String authorUserId, String authorRole, String message, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.authorUserId = authorUserId;
        this.authorRole = authorRole;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthorUserId() {
        return authorUserId;
    }

    public void setAuthorUserId(String authorUserId) {
        this.authorUserId = authorUserId;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
