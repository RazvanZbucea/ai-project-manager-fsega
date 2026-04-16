package com.fsega.ai_project_manager.controller;

import com.fsega.ai_project_manager.controller.dto.AdminUserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserDTO;
import com.fsega.ai_project_manager.controller.dto.UserUpdateDTO;
import com.fsega.ai_project_manager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/users")
    public ResponseEntity<UserDTO> adminCreateUser(@Valid @RequestBody AdminUserCreateDTO userDTO) {
        return new ResponseEntity<>(userService.createUserWithSpecificRole(userDTO), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or @userService.isCurrentUser(#id, authentication.name)")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/roles/{roleName}")
    public ResponseEntity<UserDTO> addRoleToUser(@PathVariable Long id, @PathVariable String roleName) {
        return new ResponseEntity<>(userService.addRoleToUser(id, roleName), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/roles/{roleName}")
    public ResponseEntity<Void> deleteRoleFromUser(@PathVariable Long id, @PathVariable String roleName) {
        userService.removeRoleFromUser(id, roleName);
        return ResponseEntity.noContent().build();
    }
}
