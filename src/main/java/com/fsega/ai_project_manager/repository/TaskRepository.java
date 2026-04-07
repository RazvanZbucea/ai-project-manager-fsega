package com.fsega.ai_project_manager.repository;

import com.fsega.ai_project_manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.assignedTo WHERE t.project.id = :projectId")
    List<Task> findByProjectId(Long projectId);
}
