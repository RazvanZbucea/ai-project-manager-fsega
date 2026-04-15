package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.CommentCreateDTO;
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

import java.util.List;

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
    public CommentDTO createComment(Long taskId, CommentCreateDTO commentDTO) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        Comment comment = new Comment();
        comment.setText(commentDTO.text());
        comment.setTask(task);

        assignCommentToUser(comment, commentDTO.author());

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    @Transactional
    public CommentDTO updateComment(Long id, CommentUpdateDTO commentDTO) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + id));
        comment.setText(commentDTO.text());

        return convertToDTO(comment);
    }

    public void deleteCommentById(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new EntityNotFoundException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }

    public boolean isAuthor(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found cu id: " + id));

        return comment.getAuthor().getUsername().equals(username);
    }

    private CommentDTO convertToDTO(Comment comment) {
        String authorName = comment.getAuthor().getUsername();
        if (comment.getAuthor().isDeleted()) {
            authorName += " (Dezactivat)";
        }
        return new CommentDTO(comment.getId(),
                comment.getText(),
                comment.getCreatedAt().toString(),
                comment.getUpdatedAt().toString(),
                authorName);
    }

    private void assignCommentToUser(Comment comment, String username) {
        if (username != null && !username.isEmpty()) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with name: " + username));
            comment.setAuthor(user);
        }
    }
}
