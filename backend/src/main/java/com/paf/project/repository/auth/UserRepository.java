package com.paf.project.repository.auth;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.project.model.auth.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByOauthProviderId(String oauthProviderId);

    // Changed from String to User.Role to match the entity
    List<User> findByRole(User.Role role);

    boolean existsByEmail(String email);
}
