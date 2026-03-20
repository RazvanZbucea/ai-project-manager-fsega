package com.fsega.ai_project_manager.controller.dto;

public record CommentDTO(Long id, String text, String created_at, String updated_at, String author) {
}
