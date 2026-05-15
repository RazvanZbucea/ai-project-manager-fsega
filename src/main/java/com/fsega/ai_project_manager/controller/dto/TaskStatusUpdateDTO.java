package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record TaskStatusUpdateDTO(
        @NotBlank(message = "Statusul nu poate fi gol")
        String status
) {
}