package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.GeneratedTaskDTO;
import com.fsega.ai_project_manager.model.Task;
import com.fsega.ai_project_manager.repository.TaskRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskGenerationService {
    private final ChatClient chatClient;
    private final TaskRepository taskRepository;

    public TaskGenerationService(ChatClient.Builder chatClientBuilder, TaskRepository taskRepository) {
        this.chatClient = chatClientBuilder.build();
        this.taskRepository = taskRepository;
    }

    // Am adăugat parametrul List<Task> existingTasks
    public List<GeneratedTaskDTO> generateTasksFromDescription(String projectDescription, Long projectId) {
        List<Task> existingTasks = taskRepository.findByProjectId(projectId);

        // 1. Construim contextul cu task-urile existente
        String existingTasksContext = "";
        if (existingTasks != null && !existingTasks.isEmpty()) {
            // Extragem doar titlurile task-urilor și le formatăm ca o listă (bullet points)
            String taskTitles = existingTasks.stream()
                    .map(Task::getTitle)
                    .collect(Collectors.joining("\n- ", "- ", ""));

            existingTasksContext = """
                    
                    ATENȚIE! Următoarele task-uri au fost deja create pentru acest proiect:
                    %s
                    Te rog să generezi DOAR task-uri noi, complementare. NU crea duplicate pentru task-urile deja existente în lista de mai sus.
                    """.formatted(taskTitles);
        }

        // 2. Injectăm contextul (dacă există) în prompt-ul principal
        String systemPrompt = """
                Ești un Technical Project Manager Agile.
                Misiunea ta este să analizezi descrierea proiectului și să generezi o listă structurată de task-uri tehnice și de business necesare.%s
                
                Pentru fiecare task generat, asigură-te că mapezi următoarele atribute:
                - 'title': Un titlu scurt, clar și acționabil.
                - 'description': O descriere detaliată a ceea ce trebuie implementat.
                - 'status': Setează valoarea strict pe 'TO_DO'.
                - 'priority': Deduceția ta logică bazată pe importanța task-ului. Alege STRICT una din valorile: LOW, MEDIUM, HIGH, CRITICAL.
                
                Nu include mesaje de salut sau alte explicații suplimentare pe lângă structura cerută.
                """.formatted(existingTasksContext);

        // 3. Apelăm modelul OpenAI
        return chatClient.prompt()
                .system(systemPrompt)
                .user(projectDescription)
                .call()
                .entity(new ParameterizedTypeReference<List<GeneratedTaskDTO>>() {
                });
    }
}