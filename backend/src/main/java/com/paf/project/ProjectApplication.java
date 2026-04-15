package com.paf.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class ProjectApplication {

	public static void main(String[] args) {
		// Load .env file BEFORE Spring starts
		// This way all ${VAR} placeholders in application.yaml resolve correctly
		loadEnvFile();
		SpringApplication.run(ProjectApplication.class, args);
	}

	/**
	 * Reads .env file from the project root (same folder as pom.xml)
	 * and sets each key=value pair as a system property.
	 * Spring reads system properties automatically — so ${JWT_SECRET}
	 * in application.yaml resolves to whatever is in .env
	 *
	 * Format supported:
	 *  KEY=VALUE
	 *  # this is a comment (ignored)
	 *  empty lines (ignored)
	 */
	private static void loadEnvFile() {
		try (BufferedReader reader = new BufferedReader(new FileReader(".env"))) {
			String line;
			while ((line = reader.readLine()) != null) {
				line = line.trim();

				// Skip empty lines and comments
				if (line.isEmpty() || line.startsWith("#")) continue;

				int equalIndex = line.indexOf('=');
				if (equalIndex == -1) continue; // skip malformed lines

				String key   = line.substring(0, equalIndex).trim();
				String value = line.substring(equalIndex + 1).trim();

				// Only set if not already defined — allows real env vars to override .env
				// Useful in production where real environment variables take priority
				if (System.getProperty(key) == null) {
					System.setProperty(key, value);
				}
			}
		} catch (IOException e) {
			System.err.println("⚠️ .env file not found or could not be read: " + e.getMessage());
			// Continue anyway — production uses real environment variables
		}
	}

}

