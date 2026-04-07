package com.fsega.ai_project_manager.repository;

import com.fsega.ai_project_manager.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c JOIN FETCH c.task WHERE c.task.id = :taskId")
    List<Comment> findByTaskId(Long taskId);
}
