package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentUpdateDTO(@NotBlank String text) {
}
