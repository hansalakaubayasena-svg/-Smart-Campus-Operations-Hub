package com.paf.project.model.incidents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "incident_tickets")
public class IncidentTicket {
    @Id
    private String id;
    private String resourceId;
    private String resourceName;
    private String location;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String reporterUserId;
    private String reporterName;
    private String reporterEmail;
    private ContactDetails preferredContact;
    private List<Attachment> attachments = new ArrayList<>();
    private String assignedStaffId;
    private String assignedStaffName;
    private String assignedStaffEmail;
    private String resolutionNotes;
    private String rejectionReason;
    private List<Comment> comments = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    public IncidentTicket() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReporterUserId() { return reporterUserId; }
    public void setReporterUserId(String reporterUserId) { this.reporterUserId = reporterUserId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public ContactDetails getPreferredContact() { return preferredContact; }
    public void setPreferredContact(ContactDetails preferredContact) { this.preferredContact = preferredContact; }

    public List<Attachment> getAttachments() { return attachments; }
    public void setAttachments(List<Attachment> attachments) { this.attachments = attachments; }

    public String getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(String assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }

    public String getAssignedStaffEmail() { return assignedStaffEmail; }
    public void setAssignedStaffEmail(String assignedStaffEmail) { this.assignedStaffEmail = assignedStaffEmail; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public static class ContactDetails {
        private String name;
        private String email;
        private String phone;

        public ContactDetails() {}

        public ContactDetails(String name, String email, String phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class Attachment {
        private String id = UUID.randomUUID().toString();
        private String fileName;
        private String contentType;
        private String dataUrl;

        public Attachment() {}

        public Attachment(String fileName, String contentType, String dataUrl) {
            this.fileName = fileName;
            this.contentType = contentType;
            this.dataUrl = dataUrl;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }

        public String getDataUrl() { return dataUrl; }
        public void setDataUrl(String dataUrl) { this.dataUrl = dataUrl; }
    }

    public static class Comment {
        private String id = UUID.randomUUID().toString();
        private String authorUserId;
        private String authorName;
        private String authorRole;
        private String message;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Comment() {}

        public Comment(String authorUserId, String authorName, String authorRole, String message,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.authorUserId = authorUserId;
            this.authorName = authorName;
            this.authorRole = authorRole;
            this.message = message;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getAuthorUserId() { return authorUserId; }
        public void setAuthorUserId(String authorUserId) { this.authorUserId = authorUserId; }

        public String getAuthorName() { return authorName; }
        public void setAuthorName(String authorName) { this.authorName = authorName; }

        public String getAuthorRole() { return authorRole; }
        public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}
