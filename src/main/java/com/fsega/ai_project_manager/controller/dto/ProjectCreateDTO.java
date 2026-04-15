package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectCreateDTO(

        @NotBlank(message = "Numele este obligatoriu")
        String name,

        String description) {
}
