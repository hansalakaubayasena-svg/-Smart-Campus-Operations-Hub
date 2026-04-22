package com.paf.project.dto.incidents;

import com.paf.project.model.incidents.IncidentTicket;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class CreateTicketRequest {
    private String resourceId;

    @NotBlank(message = "Resource or issue title is required")
    private String resourceName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @Valid
    @NotNull(message = "Preferred contact details are required")
    private PreferredContact preferredContact;

    @Valid
    @Size(max = 3, message = "You can upload up to 3 images")
    private List<AttachmentPayload> attachments = new ArrayList<>();

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public PreferredContact getPreferredContact() { return preferredContact; }
    public void setPreferredContact(PreferredContact preferredContact) { this.preferredContact = preferredContact; }

    public List<AttachmentPayload> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentPayload> attachments) { this.attachments = attachments; }

    public static class PreferredContact {
        @NotBlank(message = "Preferred contact name is required")
        private String name;

        @NotBlank(message = "Preferred contact email is required")
        private String email;

        @NotBlank(message = "Preferred contact phone is required")
        private String phone;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public IncidentTicket.ContactDetails toContactDetails() {
            return new IncidentTicket.ContactDetails(name, email, phone);
        }
    }

    public static class AttachmentPayload {
        @NotBlank(message = "Attachment name is required")
        private String fileName;

        @NotBlank(message = "Attachment content type is required")
        private String contentType;

        @NotBlank(message = "Attachment data is required")
        private String dataUrl;

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }

        public String getDataUrl() { return dataUrl; }
        public void setDataUrl(String dataUrl) { this.dataUrl = dataUrl; }

        public IncidentTicket.Attachment toAttachment() {
            return new IncidentTicket.Attachment(fileName, contentType, dataUrl);
        }
    }
}
