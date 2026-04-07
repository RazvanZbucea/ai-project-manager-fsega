package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.TaskCreateDTO;
import com.fsega.ai_project_manager.controller.dto.TaskDTO;
import com.fsega.ai_project_manager.controller.dto.TaskUpdateDTO;
import com.fsega.ai_project_manager.model.Project;
import com.fsega.ai_project_manager.model.Task;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.model.enums.Status;
import com.fsega.ai_project_manager.repository.ProjectRepository;
import com.fsega.ai_project_manager.repository.TaskRepository;
import com.fsega.ai_project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException("Project not found with id: " + projectId);
        }

        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional
    public TaskDTO createTask(TaskCreateDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setStatus(Status.valueOf(taskDTO.status()));
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        Project project = projectRepository.findById(taskDTO.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + taskDTO.projectId()));
        task.setProject(project);

        assignTaskToUser(task, taskDTO.assignedName());

        Task savedTask = taskRepository.save(task);

        return convertToDTO(savedTask);
    }


    @Transactional()
    public TaskDTO updateTask(Long id, TaskUpdateDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setStatus(Status.valueOf(taskDTO.status()));
        task.setUpdatedAt(LocalDateTime.now());

        assignTaskToUser(task, taskDTO.assignedName());

        return convertToDTO(task);
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

    private void assignTaskToUser(Task task, String username) {
        if (username != null && !username.isEmpty()) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with name: " + username));
            task.setAssignedTo(user);
        } else {
            task.setAssignedTo(null);
        }
    }
}
