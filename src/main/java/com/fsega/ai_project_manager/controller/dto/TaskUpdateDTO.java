package com.fsega.ai_project_manager.controller.dto;

import com.fsega.ai_project_manager.model.enums.Priority;
import jakarta.validation.constraints.NotBlank;

public record TaskUpdateDTO(@NotBlank(message = "Titlul este obligatoriu") String title, String description,
                            String status, String assignedName, Priority priority) {
}
