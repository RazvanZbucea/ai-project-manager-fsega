package com.fsega.ai_project_manager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    private Long id;

    private String text;

    private LocalDateTime createdAt;

    @ManyToOne
    private Task task;

    //TODO: Add author field to link comment to user
}
