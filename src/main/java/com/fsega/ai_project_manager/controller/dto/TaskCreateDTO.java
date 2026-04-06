package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record TaskCreateDTO(@NotBlank(message = "Titlul este obligatoriu") String title, String description,
                            String status, String assignedName, Long projectId) {
}
