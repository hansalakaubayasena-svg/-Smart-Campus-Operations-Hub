package com.paf.project.model.auth;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String email;

    private String fullName;

    private Role role = Role.STUDENT;

    private String password;

    private String oauthProviderId;

    private LocalDateTime createdAt;

    public enum Role {
        STUDENT, LECTURER, TECHNICIAN, MANAGER, ADMINISTRATOR
    }
}
