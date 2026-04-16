package com.fsega.ai_project_manager.repository;

import com.fsega.ai_project_manager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.users u WHERE p.createdBy = :username OR u.username = :username")
    List<Project> findProjectsForUser(String username);
}
