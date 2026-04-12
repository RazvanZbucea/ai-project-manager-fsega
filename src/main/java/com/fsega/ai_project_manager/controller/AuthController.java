package com.fsega.ai_project_manager.controller;

import com.fsega.ai_project_manager.controller.dto.AuthResponseDTO;
import com.fsega.ai_project_manager.controller.dto.LoginRequestDTO;
import com.fsega.ai_project_manager.controller.dto.UserCreateDTO;
import com.fsega.ai_project_manager.controller.dto.UserDTO;
import com.fsega.ai_project_manager.service.CustomUserDetailsService;
import com.fsega.ai_project_manager.service.JwtService;
import com.fsega.ai_project_manager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final CustomUserDetailsService customUserDetailsService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        var authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        var user = customUserDetailsService.loadUserByUsername(request.username());
        var token = jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userDTO) {
        return new ResponseEntity<>(userService.createUser(userDTO), HttpStatus.CREATED);
    }
}
