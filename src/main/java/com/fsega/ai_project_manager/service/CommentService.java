package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.CommentDTO;
import com.fsega.ai_project_manager.model.Comment;
import com.fsega.ai_project_manager.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public CommentDTO getCommentById(Long id) {
        return commentRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + id));
    }

    @Transactional
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setText(commentDTO.text());
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
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
}
