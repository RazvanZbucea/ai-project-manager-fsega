package com.fsega.ai_project_manager.model;

import com.fsega.ai_project_manager.model.enums.Status;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Task {
    @Id
    private Long id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    private Project project;

    @ManyToOne
    private User assignedTo;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comment;
}
