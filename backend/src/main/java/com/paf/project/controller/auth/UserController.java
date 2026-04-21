package com.paf.project.controller.auth;

import java.util.List;
import java.util.Map;

import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paf.project.core.util.ApiResponse;
import com.paf.project.dto.auth.AuthResponse;
import com.paf.project.dto.auth.DeleteAccountRequest;
import com.paf.project.dto.auth.LoginRequest;
import com.paf.project.dto.auth.RegisterRequest;
import com.paf.project.dto.auth.UpdateProfileRequest;
import com.paf.project.model.auth.User;
import com.paf.project.service.auth.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ── AUTH ENDPOINTS ────────────────────────────────────────────────────────

    /**
     * POST /api/users/register
     * HTTP 201 Created
     * Public — no token needed
     * @Valid triggers RegisterRequest validation → GlobalExceptionHandler returns 400 on failure
     *
     * HATEOAS links:
     *  self  → the register endpoint itself
     *  login → where to go next if they want to login separately
     *  me    → where to fetch their profile after registering
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = userService.register(request);

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).register(null)).withSelfRel(),
            linkTo(methodOn(UserController.class).login(null)).withRel("login"),
            linkTo(methodOn(UserController.class).getMyProfile()).withRel("me")
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Account created successfully", model));
    }

    /**
     * POST /api/users/login
     * HTTP 200
     * Public — no token needed
     *
     * HATEOAS links:
     *  self     → this login endpoint
     *  me       → fetch profile with the returned token
     *  register → in case they don't have an account
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = userService.login(request);

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).login(null)).withSelfRel(),
            linkTo(methodOn(UserController.class).getMyProfile()).withRel("me"),
            linkTo(methodOn(UserController.class).register(null)).withRel("register")
        );

        return ResponseEntity.ok(
            ApiResponse.success("Login successful", model)
        );
    }

    /**
     * GET /api/users/me
     * HTTP 200 | 401
     * Requires valid JWT — any role
     * Called by React on app reload to verify token and restore session
     *
     * HATEOAS links:
     *  self         → this endpoint
     *  update-role  → admin can promote this user (ADMIN only — shown for discoverability)
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> getMyProfile() {

        AuthResponse authResponse = userService.getMyProfile();

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).getMyProfile()).withSelfRel(),
            linkTo(methodOn(UserController.class)
                .updateUserRole(authResponse.getUserId(), null)).withRel("update-role")
        );

        return ResponseEntity.ok(
            ApiResponse.success("Profile retrieved", model)
        );
    }

    // ── USER MANAGEMENT ENDPOINTS (ADMIN) ────────────────────────────────────

    /**
     * GET /api/users/{id}
     * HTTP 200 | 404
     * ADMIN only
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<EntityModel<User>>> getUserById(
            @PathVariable String id) {

        User user = userService.getUserById(id);

        EntityModel<User> model = EntityModel.of(user,
            linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).getAllUsers(null)).withRel("all-users"),
            linkTo(methodOn(UserController.class).updateUserRole(id, null)).withRel("update-role")
        );

        return ResponseEntity.ok(
            ApiResponse.success("User found", model)
        );
    }

    /**
     * GET /api/users?role=STUDENT
     * HTTP 200
     * ADMIN only — list all users, optionally filtered by role
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(
            @RequestParam(required = false) String role) {

        List<User> users = userService.getAllUsers(role);
        return ResponseEntity.ok(
            ApiResponse.success("Users retrieved", users)
        );
    }

    /**
     * PUT /api/users/{id}/role
     * HTTP 200 | 400 | 404
     * ADMIN only
     * Body: { "role": "ADMINISTRATOR" }
     */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<EntityModel<User>>> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        User updated = userService.updateUserRole(id, body.get("role"));

        EntityModel<User> model = EntityModel.of(updated,
            linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).getAllUsers(null)).withRel("all-users")
        );

        return ResponseEntity.ok(
            ApiResponse.success("Role updated to " + updated.getRole().name(), model)
        );
    }

    /**
     * DELETE /api/users/{id}
     * Deletes a user. ADMIN only. Returns 204 No Content.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.noContent("User deleted successfully."));
    }

    /**
     * PUT /api/users/me
     * HTTP 200
     * Updates current user's profile.
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        AuthResponse authResponse = userService.updateMyProfile(request);

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).getMyProfile()).withSelfRel()
        );

        return ResponseEntity.ok(
            ApiResponse.success("Profile updated successfully", model)
        );
    }

    /**
     * DELETE /api/users/me
     * HTTP 204
     * Deletes the authenticated user's account.
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(
            @RequestBody DeleteAccountRequest request) {

        userService.deleteMyAccount(request.getPassword());

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.noContent("Account deleted successfully"));
    }
}
