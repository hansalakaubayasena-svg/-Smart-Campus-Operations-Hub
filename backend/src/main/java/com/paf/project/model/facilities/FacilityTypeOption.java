package com.paf.project.model.facilities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "facility_types")
public class FacilityTypeOption {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    public FacilityTypeOption() {
    }

    public FacilityTypeOption(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
