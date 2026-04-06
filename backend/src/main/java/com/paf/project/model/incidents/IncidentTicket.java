package com.paf.project.model.incidents;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "incident_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicket {
    @Id
    private String id;
    private String resourceId;
    private String description;
    private String category;
    private String priority; // LOW / MEDIUM / HIGH
    private String status; // OPEN / IN_PROGRESS / RESOLVED / CLOSED
}
