package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.CommentDTO;
import com.fsega.ai_project_manager.controller.dto.CommentUpdateDTO;
import com.fsega.ai_project_manager.model.Comment;
import com.fsega.ai_project_manager.model.Task;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.repository.CommentRepository;
import com.fsega.ai_project_manager.repository.TaskRepository;
import com.fsega.ai_project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CommentDTO getCommentById(Long id) {
        return commentRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new EntityNotFoundException("Task not found with id: " + taskId);
        }

        return commentRepository.findByTaskId(taskId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional
    public CommentDTO createComment(Long taskId, CommentDTO commentDTO) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isEmpty()) {
            throw new EntityNotFoundException("Task not found with id: " + taskId);
        }
        Comment comment = new Comment();
        comment.setText(commentDTO.text());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        comment.setTask(task.get());

        assignCommentToUser(comment, commentDTO.author());

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    @Transactional
    public CommentDTO updateComment(Long id, CommentUpdateDTO commentDTO) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + id));

        comment.setText(commentDTO.text());
        comment.setUpdatedAt(LocalDateTime.now());

        return convertToDTO(comment);
    }

    public void deleteCommentById(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(comment.getId(),
                comment.getText(),
                comment.getCreatedAt().toString(),
                comment.getUpdatedAt() != null ? comment.getUpdatedAt().toString() : null,
                comment.getAuthor().getUsername());
    }

    private void assignCommentToUser(Comment comment, String username) {
        if (username != null && !username.isEmpty()) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with name: " + username));
            comment.setAuthor(user);
        }
    }
}
