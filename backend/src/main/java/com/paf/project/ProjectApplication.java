package com.paf.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class ProjectApplication {

    public static void main(String[] args) {
        // Try loading from several possible locations
        loadEnvFile();
        SpringApplication.run(ProjectApplication.class, args);
    }

    private static void loadEnvFile() {
        // Possible paths: root, backend folder, or parent folder
        String[] paths = {".env", "backend/.env", "../.env"};
        File envFile = null;

        for (String path : paths) {
            File f = new File(path);
            if (f.exists()) {
                envFile = f;
                break;
            }
        }

        if (envFile == null) {
            System.err.println("⚠️ .env file not found in common locations. Using defaults from application.properties.");
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;

                int equalIndex = line.indexOf('=');
                if (equalIndex == -1) continue;

                String key   = line.substring(0, equalIndex).trim();
                String value = line.substring(equalIndex + 1).trim();

                if (System.getProperty(key) == null) {
                    System.setProperty(key, value);
                }
            }
            System.out.println("✅ Loaded environment variables from: " + envFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("❌ Error reading .env file: " + e.getMessage());
        }
    }
}
