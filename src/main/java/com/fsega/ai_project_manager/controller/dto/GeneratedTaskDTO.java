package com.fsega.ai_project_manager.controller.dto;

import com.fsega.ai_project_manager.model.enums.Priority;

public record GeneratedTaskDTO(
        String title,
        String description,
        String suggestedStatus,
        Priority priority
) {
}
