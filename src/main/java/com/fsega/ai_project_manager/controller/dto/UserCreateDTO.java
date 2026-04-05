package com.fsega.ai_project_manager.controller.dto;

import com.fsega.ai_project_manager.validator.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCreateDTO(
        @NotBlank(message = "Username-ul este obligatoriu")
        String username,

        @NotBlank(message = "Email-ul este obligatoriu")
        @Email(message = "Formatul email-ului este invalid")
        String email,

        @ValidPassword
        String password,

        @NotBlank(message = "Prenumele este obligatoriu")
        String firstName,

        @NotBlank(message = "Numele este obligatoriu")
        String lastName
) {
}