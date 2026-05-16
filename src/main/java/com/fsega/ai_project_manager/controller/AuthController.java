package com.fsega.ai_project_manager.controller;

import com.fsega.ai_project_manager.controller.dto.AuthResponseDTO;
import com.fsega.ai_project_manager.controller.dto.LoginRequestDTO;
import com.fsega.ai_project_manager.controller.dto.UserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserDTO;
import com.fsega.ai_project_manager.model.CustomUserDetails;
import com.fsega.ai_project_manager.service.JwtService;
import com.fsega.ai_project_manager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 1. Extragem instanța de UserDetails din obiectul Authentication
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // 2. Generăm token-ul pasând userDetails, nu authentication! (AICI ERA EROAREA)
        String token = jwtService.generateToken(userDetails);

        // 3. Extragem rolul (eliminăm "ROLE_" generat de Spring)
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("");

        // 4. Returnăm totul frumos ambalat în DTO
        return ResponseEntity.ok(new AuthResponseDTO(token, userDetails.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }
}
