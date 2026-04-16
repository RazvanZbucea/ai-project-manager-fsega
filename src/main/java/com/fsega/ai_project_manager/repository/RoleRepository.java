package com.fsega.ai_project_manager.repository;

import com.fsega.ai_project_manager.model.Role;
import com.fsega.ai_project_manager.model.enums.Name;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Name name);
}
