package com.paf.project.dto.incidents;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateTicketStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;

    @Size(max = 1000, message = "Resolution notes must be under 1000 characters")
    private String resolutionNotes;

    @Size(max = 500, message = "Rejection reason must be under 500 characters")
    private String rejectionReason;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
