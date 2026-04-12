package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank String username, @NotBlank String password) {
}
