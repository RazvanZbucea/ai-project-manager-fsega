package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.GeneratedTaskDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskGenerationService {
    private final ChatClient chatClient;

    public TaskGenerationService(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    public List<GeneratedTaskDTO> generateTasksFromDescription(String projectDescription) {
        String systemPrompt = """
                Ești un manager de proiect agil.
                Te rog să analizezi următoarea descriere de proiect și să generezi o listă de task-uri necesare.
                Pentru fiecare task, oferă un titlu scurt, o descriere detaliată și sugerează statusul inițial (TO_DO).
                """;
        return chatClient.prompt()
                .system(systemPrompt)
                .user(projectDescription)
                .call()
                .entity(new ParameterizedTypeReference<List<GeneratedTaskDTO>>() {
                });
    }
}
