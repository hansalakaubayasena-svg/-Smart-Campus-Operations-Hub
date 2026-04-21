package com.paf.project;

import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class ProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectApplication.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.saveAll(List.of(
                        new User(null, "naveen.user", "naveen@student.example.com", "USER"),
                        new User(null, "asha.user", "asha@student.example.com", "USER"),
                        new User(null, "dilan.tech", "dilan@campus.example.com", "TECHNICIAN"),
                        new User(null, "admin.laksh", "admin@campus.example.com", "ADMIN")
                ));
            }
        };
    }
}
