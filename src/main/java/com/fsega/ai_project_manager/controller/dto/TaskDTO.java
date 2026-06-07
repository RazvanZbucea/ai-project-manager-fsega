package com.fsega.ai_project_manager.controller.dto;

import com.fsega.ai_project_manager.model.enums.Priority;

public record TaskDTO(Long id, String title, String description, String status, String createdAt, String updatedAt,
                      String createdBy, String updatedBy, String assignedName, Priority priority) {
}
