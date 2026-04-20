package com.paf.project.model.facilities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "facilities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {
    @Id
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String status; // ACTIVE / OUT_OF_SERVICE
}
