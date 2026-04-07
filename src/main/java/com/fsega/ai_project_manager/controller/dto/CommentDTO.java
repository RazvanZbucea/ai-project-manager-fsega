package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentDTO(Long id, @NotBlank String text, String createdAt, String updatedAt, String author) {
}
