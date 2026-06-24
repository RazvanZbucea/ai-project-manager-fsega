package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.TaskCreateDTO;
import com.fsega.ai_project_manager.controller.dto.TaskDTO;
import com.fsega.ai_project_manager.controller.dto.TaskStatusUpdateDTO;
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

import java.util.ArrayList;
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
    public TaskDTO createTask(Long projectId, TaskCreateDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setStatus(Status.valueOf(taskDTO.status()));
        task.setPriority(taskDTO.priority());

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
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
        task.setPriority(taskDTO.priority());

        assignTaskToUser(task, taskDTO.assignedName());

        return convertToDTO(task);
    }

    @Transactional
    public void deleteTaskById(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean isAssignee(Long id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

        return task.getAssignedTo().getUsername().equals(username);
    }

    @Transactional
    public List<TaskDTO> createTasksBulk(Long projectId, List<TaskCreateDTO> taskCreateDTOs) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        List<TaskDTO> taskDTOs = new ArrayList<>();
        for (TaskCreateDTO taskDTO : taskCreateDTOs) {
            Task task = new Task();
            task.setTitle(taskDTO.title());
            task.setDescription(taskDTO.description());
            task.setStatus(Status.valueOf(taskDTO.status()));
            assignTaskToUser(task, taskDTO.assignedName());
            task.setProject(project);
            task.setPriority(taskDTO.priority());

            taskDTOs.add(convertToDTO(taskRepository.save(task)));
        }
        return taskDTOs;
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long id, TaskStatusUpdateDTO statusDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

        Status currentStatus = task.getStatus();
        Status newStatus = Status.valueOf(statusDTO.status());

        // JAVA 17: Switch Expressions (mai curate decat switch-ul cu block-uri break din Java 8)
        // Validam tranzitiile pentru a nu sari pasi ilogici. Returneaza boolean direct.
        boolean isValidTransition = switch (currentStatus) {
            case TO_DO -> newStatus == Status.IN_PROGRESS;
            case IN_PROGRESS -> newStatus == Status.TO_DO || newStatus == Status.TESTING;
            case TESTING -> newStatus == Status.IN_PROGRESS || newStatus == Status.DONE;
            case DONE ->
                    newStatus == Status.TESTING; // Permitem redeschiderea task-ului daca pica o verificare post-live
        };

        if (!isValidTransition && currentStatus != newStatus) {
            throw new IllegalArgumentException("Tranziție invalidă de status: din " + currentStatus + " in " + newStatus);
        }

        task.setStatus(newStatus);
        return convertToDTO(task);
    }

    private TaskDTO convertToDTO(Task task) {

        String assigneeName = task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : "Unassigned";
        if (task.getAssignedTo() != null && task.getAssignedTo().isDeleted()) {
            assigneeName += " (Dezactivat)";
        }
        String status = task.getStatus() != null ? task.getStatus().name() : "TO_DO";

        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                status,
                task.getCreatedAt().toString(),
                task.getUpdatedAt().toString(),
                task.getCreatedBy(),
                task.getUpdatedBy(),
                assigneeName,
                task.getPriority()
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
