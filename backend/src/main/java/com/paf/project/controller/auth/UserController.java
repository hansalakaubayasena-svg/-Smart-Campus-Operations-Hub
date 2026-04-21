package com.paf.project.controller.auth;

import java.util.List;
import java.util.Map;

import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.paf.project.core.util.ApiResponse;
import com.paf.project.dto.auth.AuthResponse;
import com.paf.project.dto.auth.DeleteAccountRequest;
import com.paf.project.dto.auth.LoginRequest;
import com.paf.project.dto.auth.RegisterRequest;
import com.paf.project.dto.auth.UpdateProfileRequest;
import com.paf.project.model.auth.User;
import com.paf.project.service.auth.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Manual constructor injection instead of Lombok
    public UserController(UserService userService) {
        this.userService = userService;
    }

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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = userService.login(request);

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).login(null)).withSelfRel(),
            linkTo(methodOn(UserController.class).getMyProfile()).withRel("me"),
            linkTo(methodOn(UserController.class).register(null)).withRel("register")
        );

        return ResponseEntity.ok(ApiResponse.success("Login successful", model));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> getMyProfile() {
        AuthResponse authResponse = userService.getMyProfile();

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).getMyProfile()).withSelfRel(),
            linkTo(methodOn(UserController.class).updateUserRole(authResponse.getUserId(), null)).withRel("update-role")
        );

        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", model));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<EntityModel<User>>> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);

        EntityModel<User> model = EntityModel.of(user,
            linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).getAllUsers(null)).withRel("all-users"),
            linkTo(methodOn(UserController.class).updateUserRole(id, null)).withRel("update-role")
        );

        return ResponseEntity.ok(ApiResponse.success("User found", model));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users = userService.getAllUsers(role);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

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

        return ResponseEntity.ok(ApiResponse.success("Role updated to " + updated.getRole().name(), model));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.noContent("User deleted successfully."));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<EntityModel<AuthResponse>>> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        AuthResponse authResponse = userService.updateMyProfile(request);

        EntityModel<AuthResponse> model = EntityModel.of(authResponse,
            linkTo(methodOn(UserController.class).getMyProfile()).withSelfRel()
        );

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", model));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMyAccount(@RequestBody DeleteAccountRequest request) {
        userService.deleteMyAccount(request.getPassword());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.noContent("Account deleted successfully"));
    }
}
