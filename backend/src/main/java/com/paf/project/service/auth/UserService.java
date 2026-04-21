package com.paf.project.service.auth;

import com.paf.project.core.exception.CustomExceptions.*;
import com.paf.project.security.JwtUtil;
import com.paf.project.dto.auth.AuthResponse;
import com.paf.project.dto.auth.LoginRequest;
import com.paf.project.dto.auth.RegisterRequest;
import com.paf.project.dto.auth.UpdateProfileRequest;
import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    // Manual Constructor injection instead of Lombok
    public UserService(UserRepository userRepository, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceConflictException("An account with this email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(User.Role.STUDENT);
            }
        } else {
            user.setRole(User.Role.STUDENT);
        }

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getPassword() == null) {
            throw new BadRequestException("This account uses Google Sign-In. Please click 'Sign in with Google'.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse getMyProfile() {
        User user = getCurrentUser();
        return buildAuthResponse(user);
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new UnauthorizedException("No authenticated user found");
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public List<User> getAllUsers(String role) {
        if (role != null && !role.isBlank()) {
            try {
                User.Role roleEnum = User.Role.valueOf(role.toUpperCase());
                return userRepository.findByRole(roleEnum);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role: " + role + ". Must be STUDENT, LECTURER, TECHNICIAN, MANAGER or ADMINISTRATOR");
            }
        }
        return userRepository.findAll();
    }

    public User updateUserRole(String id, String newRole) {
        User user = getUserById(id);
        try {
            user.setRole(User.Role.valueOf(newRole.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + newRole + ". Must be STUDENT, LECTURER, TECHNICIAN, MANAGER or ADMINISTRATOR");
        }
        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public void deleteUser(String id) {
        User target = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        User currentAdmin = getCurrentUser();
        if (currentAdmin.getId().equals(target.getId())) {
            throw new BadRequestException("You cannot delete your own account.");
        }
        userRepository.deleteById(id);
    }

    public AuthResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        user.setFullName(request.getFullName().trim());
        String newEmail = request.getEmail().trim();
        if (!user.getEmail().equalsIgnoreCase(newEmail)) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new ResourceConflictException("An account with this email already exists");
            }
            user.setEmail(newEmail);
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (user.getPassword() == null) {
                throw new BadRequestException("Google Sign-In accounts cannot set a password. Please continue using Google.");
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

    public void deleteMyAccount(String confirmPassword) {
        User user = getCurrentUser();
        if (user.getPassword() != null) {
            if (confirmPassword == null || confirmPassword.isBlank()) {
                throw new BadRequestException("Password confirmation is required to delete your account");
            }
            if (!passwordEncoder.matches(confirmPassword, user.getPassword())) {
                throw new UnauthorizedException("Password is incorrect");
            }
        }
        userRepository.deleteById(user.getId());
    }
}
