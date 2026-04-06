package com.fsega.ai_project_manager.controller.dto;

public record TaskCreateDTO(Long id, String title, String description, String status, String createdAt,
                            String updatedAt, String assignedName, Long projectId) {
}
