package com.fsega.ai_project_manager.model;

import com.fsega.ai_project_manager.model.enums.Name;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Name name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();

}
