package com.paf.project.model.incidents;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long resourceId;
    private String description;
    private String category;
    private String priority; // LOW / MEDIUM / HIGH
    private String status; // OPEN / IN_PROGRESS / RESOLVED / CLOSED
}
