package com.paf.project.model.facilities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "facilities")
public class Facility {
    @Id
    private String id;

    @Indexed(unique = true)
    private String resourceId;

    private String name;
    private String resourceKind;
    private String type;
    private String category;
    private String nameOrModel;
    private Integer capacity;
    private Integer quantity;
    private Integer minLoanHours;
    private Integer maxLoanHours;
    private Integer defaultLoanHours;
    private String location;
    private String description;
    private List<String> availabilityWindows;
    private String imageUrl;
    private String status; // ACTIVE / OUT_OF_SERVICE

    // Default Constructor
    public Facility() {
    }

    // All-args Constructor
    public Facility(String id, String resourceId, String name, String resourceKind, String type, String category, String nameOrModel,
                    Integer capacity, Integer quantity, Integer minLoanHours, Integer maxLoanHours, Integer defaultLoanHours,
                    String location, String description, List<String> availabilityWindows, String imageUrl, String status) {
        this.id = id;
        this.resourceId = resourceId;
        this.name = name;
        this.resourceKind = resourceKind;
        this.type = type;
        this.category = category;
        this.nameOrModel = nameOrModel;
        this.capacity = capacity;
        this.quantity = quantity;
        this.minLoanHours = minLoanHours;
        this.maxLoanHours = maxLoanHours;
        this.defaultLoanHours = defaultLoanHours;
        this.location = location;
        this.description = description;
        this.availabilityWindows = availabilityWindows;
        this.imageUrl = imageUrl;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public String getResourceKind() {
        return resourceKind;
    }

    public void setResourceKind(String resourceKind) {
        this.resourceKind = resourceKind;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getNameOrModel() {
        return nameOrModel;
    }

    public void setNameOrModel(String nameOrModel) {
        this.nameOrModel = nameOrModel;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getMinLoanHours() {
        return minLoanHours;
    }

    public void setMinLoanHours(Integer minLoanHours) {
        this.minLoanHours = minLoanHours;
    }

    public Integer getMaxLoanHours() {
        return maxLoanHours;
    }

    public void setMaxLoanHours(Integer maxLoanHours) {
        this.maxLoanHours = maxLoanHours;
    }

    public Integer getDefaultLoanHours() {
        return defaultLoanHours;
    }

    public void setDefaultLoanHours(Integer defaultLoanHours) {
        this.defaultLoanHours = defaultLoanHours;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(List<String> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
