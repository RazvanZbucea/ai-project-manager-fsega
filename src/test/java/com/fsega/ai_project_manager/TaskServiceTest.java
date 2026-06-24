package com.fsega.ai_project_manager;

import com.fsega.ai_project_manager.controller.dto.TaskDTO;
import com.fsega.ai_project_manager.controller.dto.TaskStatusUpdateDTO;
import com.fsega.ai_project_manager.model.Task;
import com.fsega.ai_project_manager.model.enums.Status;
import com.fsega.ai_project_manager.repository.TaskRepository;
import com.fsega.ai_project_manager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void shouldUpdateTaskStatus_whenTransitionIsValid() {
        // 1. Aranjarea datelor (Arrange)
        Long taskId = 1L;
        Task mockTask = new Task();
        mockTask.setId(taskId);
        mockTask.setStatus(Status.TO_DO);
        mockTask.setCreatedAt(LocalDateTime.now());
        mockTask.setUpdatedAt(LocalDateTime.now());

        // Simulăm răspunsul bazei de date
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(mockTask));

        TaskStatusUpdateDTO dto = new TaskStatusUpdateDTO("IN_PROGRESS");

        // 2. Acțiunea efectivă (Act)
        TaskDTO result = taskService.updateTaskStatus(taskId, dto);

        // 3. Verificarea rezultatului (Assert)
        assertNotNull(result);
        assertEquals("IN_PROGRESS", result.status());
        verify(taskRepository, times(1)).findById(taskId);
    }
}
