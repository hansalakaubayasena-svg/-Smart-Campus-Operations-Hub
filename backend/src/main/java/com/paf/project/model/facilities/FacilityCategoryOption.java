package com.paf.project.model.facilities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "facility_categories")
public class FacilityCategoryOption {
    @Id
    private String id;

    @Indexed
    private String typeId;

    private String name;

    public FacilityCategoryOption() {
    }

    public FacilityCategoryOption(String id, String typeId, String name) {
        this.id = id;
        this.typeId = typeId;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
