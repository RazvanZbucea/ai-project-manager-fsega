package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateDTO(
        @NotBlank(message = "Username-ul este obligatoriu")
        String username,

        @NotBlank(message = "Email-ul este obligatoriu")
        @Email(message = "Formatul email-ului este invalid")
        String email,

        @NotBlank(message = "Parola este obligatorie")
        @Size(min = 6, message = "Parola trebuie să aibă minim 6 caractere")
        String password,

        @NotBlank(message = "Prenumele este obligatoriu")
        String firstName,

        @NotBlank(message = "Numele este obligatoriu")
        String lastName
) {
}