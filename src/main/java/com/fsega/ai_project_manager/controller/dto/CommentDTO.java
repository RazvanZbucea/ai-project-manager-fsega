package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentDTO(Long id, @NotBlank @Size(max = 2000, message = "Comentariul este prea lung") String text,
                         String createdAt, String updatedAt, String author) {
}
