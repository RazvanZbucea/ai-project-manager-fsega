package com.fsega.ai_project_manager.controller.dto;

public record TaskDTO(Long id, String title, String description, String status, String createdAt, String updatedAt, String assignedTo) {
}
