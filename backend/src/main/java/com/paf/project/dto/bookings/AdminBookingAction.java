package com.paf.project.dto.bookings;

public class AdminBookingAction {
    private String status; // APPROVED / REJECTED
    private String notes;

    public AdminBookingAction() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
