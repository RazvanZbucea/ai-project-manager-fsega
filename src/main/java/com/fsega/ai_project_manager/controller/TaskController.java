package com.fsega.ai_project_manager.controller;

import com.fsega.ai_project_manager.controller.dto.CommentCreateDTO;
import com.fsega.ai_project_manager.controller.dto.CommentDTO;
import com.fsega.ai_project_manager.controller.dto.TaskDTO;
import com.fsega.ai_project_manager.controller.dto.TaskUpdateDTO;
import com.fsega.ai_project_manager.service.CommentService;
import com.fsega.ai_project_manager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or @taskService.isAssignee(#id, authentication.name) or @projectService.isProjectOwner(#id, authentication.name)")
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskUpdateDTO taskDTO) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }

    @PreAuthorize("hasRole('ADMIN') or @projectService.isProjectOwner(#id, authentication.name)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{taskId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsByTaskId(taskId));
    }

    @PostMapping("/{taskId}/comments")
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long taskId, @RequestBody CommentCreateDTO commentDTO) {
        return new ResponseEntity<>(commentService.createComment(taskId, commentDTO), HttpStatus.CREATED);
    }
}
