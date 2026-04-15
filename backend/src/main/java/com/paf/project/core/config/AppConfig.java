package com.paf.project.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AppConfig {

    // Declared as a Spring Bean so it can be injected anywhere via constructor
    // Cost factor 12 = strong hashing, ~300ms per hash — right balance for production
    // Single instance shared across the app — BCryptPasswordEncoder is thread-safe
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
