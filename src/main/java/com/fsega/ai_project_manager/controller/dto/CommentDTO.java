package com.fsega.ai_project_manager.controller.dto;

public record CommentDTO(Long id, String text, String createdAt, String updatedAt, String author) {
}
