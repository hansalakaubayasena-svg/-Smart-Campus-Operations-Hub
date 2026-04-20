package com.paf.project.service.auth;

import com.paf.project.core.exception.CustomExceptions.*;
import com.paf.project.security.JwtUtil;
import com.paf.project.dto.auth.AuthResponse;
import com.paf.project.dto.auth.LoginRequest;
import com.paf.project.dto.auth.RegisterRequest;
import com.paf.project.dto.auth.UpdateProfileRequest;
import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    // Injected from AppConfig Bean — no manual instantiation
    // @RequiredArgsConstructor includes this in the constructor automatically
    private final BCryptPasswordEncoder passwordEncoder;

    // ── AUTH OPERATIONS ───────────────────────────────────────────────────────

    /**
     * Manual registration — email + password path.
     * OAuth2 users go through CustomOAuth2UserService instead.
     * Role can be selected during registration, defaults to STUDENT.
     * JWT issued immediately after registration — no separate login step needed.
     */
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceConflictException(
                "An account with this email already exists"
            );
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Set role from request, default to STUDENT if not provided
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(User.Role.STUDENT);
            }
        } else {
            user.setRole(User.Role.STUDENT);
        }
        // oauthProviderId = null — signals manual account to other services

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    /**
     * Manual login — email + password path.
     * Generic error messages on cases 1 and 3 prevent user enumeration attacks.
     * Case 2 gives specific message — OAuth users need to know to use Google button.
     */
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // OAuth-only account — has no password set
        if (user.getPassword() == null) {
            throw new BadRequestException(
                "This account uses Google Sign-In. Please click 'Sign in with Google'."
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    /**
     * GET /api/users/me
     * Re-issues a fresh token on every call — extends session for active users.
     * Without this, any user active longer than 24h would be auto logged out.
     */
    public AuthResponse getMyProfile() {
        User user = getCurrentUser();
        return buildAuthResponse(user);
    }

    // ── USER MANAGEMENT OPERATIONS ────────────────────────────────────────────

    /**
     * Extracts the authenticated User from SecurityContext.
     * JwtAuthFilter already set this as the principal.
     * Used by any service method that needs to know who is calling.
     */
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new UnauthorizedException("No authenticated user found");
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public List<User> getAllUsers(String role) {
        if (role != null && !role.isBlank()) {
            try {
                User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
                return userRepository.findByRole(roleEnum);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException(
                    "Invalid role: " + role + ". Must be STUDENT, LECTURER, TECHNICIAN, MANAGER or ADMINISTRATOR"
                );
            }
        }
        return userRepository.findAll();
    }

    public User updateUserRole(String id, String newRole) {
        User user = getUserById(id);
        try {
            user.setRole(User.Role.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                "Invalid role: " + newRole + ". Must be STUDENT, LECTURER, TECHNICIAN, MANAGER or ADMINISTRATOR"
            );
        }
        return userRepository.save(user);
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    /**
     * Single place to build AuthResponse — used by register, login, and getMyProfile.
     * If AuthResponse shape changes, only this method needs updating.
     */
    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole(),
            user.getId()
        );
        return new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }

    /**
     * Deletes a user by ID. ADMIN only (enforced at controller level).
     * Prevents an admin from deleting their own account.
     */
    public void deleteUser(String id) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        User currentAdmin = getCurrentUser();
        if (currentAdmin.getId().equals(target.getId())) {
            throw new BadRequestException("You cannot delete your own account.");
        }

        userRepository.deleteById(id);
    }

    /**
     * PUT /api/users/me
     * Updates the authenticated user's own profile.
     * Password change is opt-in: only executed when newPassword is non-blank.
     * Always issues a fresh JWT — covers the case where email changes.
     */
    public AuthResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        // ── Full name ───────────────────────────────────────────────────────────
        user.setFullName(request.getFullName().trim());

        // ── Email — only update if it changed ──────────────────────────────────
        String newEmail = request.getEmail().trim();
        if (!user.getEmail().equalsIgnoreCase(newEmail)) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new ResourceConflictException("An account with this email already exists");
            }
            user.setEmail(newEmail);
        }

        // ── Password — optional block ───────────────────────────────────────────
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (user.getPassword() == null) {
                throw new BadRequestException(
                    "Google Sign-In accounts cannot set a password. Please continue using Google."
                );
            }
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Current password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    /**
     * DELETE /api/users/me
     * Permanently deletes the authenticated user's own account.
     * Manual (password) accounts must confirm with their password.
     * OAuth-only accounts (password == null) may pass null — no check performed.
     */
    public void deleteMyAccount(String confirmPassword) {
        User user = getCurrentUser();

        if (user.getPassword() != null) {
            if (confirmPassword == null || confirmPassword.isBlank()) {
                throw new BadRequestException(
                    "Password confirmation is required to delete your account"
                );
            }
            if (!passwordEncoder.matches(confirmPassword, user.getPassword())) {
                throw new UnauthorizedException("Password is incorrect");
            }
        }

        userRepository.deleteById(user.getId());
    }
}
