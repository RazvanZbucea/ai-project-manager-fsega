package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.TaskDTO;
import com.fsega.ai_project_manager.model.Task;
import com.fsega.ai_project_manager.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setStatus(com.fsega.ai_project_manager.model.enums.Status.valueOf(taskDTO.status()));
        task.setCreatedAt(java.time.LocalDateTime.now());
        task.setUpdatedAt(java.time.LocalDateTime.now());

        Task savedTask = taskRepository.save(task);

        return convertToDTO(savedTask);
    }

    public void deleteTaskById(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskDTO convertToDTO(Task task) {

        String assigneeName = task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : "Unassigned";
        String status = task.getStatus() != null ? task.getStatus().name() : "TO_DO";

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                status,
                task.getCreatedAt().toString(),
                task.getUpdatedAt().toString(),
                assigneeName
        );
    }
}
