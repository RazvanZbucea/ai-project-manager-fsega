package com.fsega.ai_project_manager.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskCreateDTO(@NotBlank(message = "Titlul este obligatoriu") String title, String description,
                            String status, String assignedName,
                            @NotNull(message = "ID-ul proiectului este obligatoriu") Long projectId) {
}
