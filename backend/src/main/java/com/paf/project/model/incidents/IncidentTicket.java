package com.paf.project.model.incidents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "incident_tickets")
public class IncidentTicket {
    @Id
    private String id;
    private String resourceId;
    private String description;
    private String category;
    private String priority; // LOW / MEDIUM / HIGH
    private String status; // OPEN / IN_PROGRESS / RESOLVED / CLOSED

    public IncidentTicket() {}

    public IncidentTicket(String id, String resourceId, String description, String category, String priority, String status) {
        this.id = id;
        this.resourceId = resourceId;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
