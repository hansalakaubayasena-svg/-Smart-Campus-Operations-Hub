package com.paf.project.dto.incidents;

import jakarta.validation.constraints.NotBlank;

public class AssignTicketRequest {
    @NotBlank(message = "Staff user id is required")
    private String staffUserId;

    public String getStaffUserId() { return staffUserId; }
    public void setStaffUserId(String staffUserId) { this.staffUserId = staffUserId; }
}
