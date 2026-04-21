package com.paf.project.repository.auth;

import com.paf.project.model.auth.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOauthProviderId(String oauthProviderId);
    List<User> findByRole(User.Role role);
    boolean existsByEmail(String email);
}
