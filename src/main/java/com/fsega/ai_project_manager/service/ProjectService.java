package com.fsega.ai_project_manager.service;

import com.fsega.ai_project_manager.controller.dto.ProjectCreateDTO;
import com.fsega.ai_project_manager.controller.dto.ProjectDTO;
import com.fsega.ai_project_manager.controller.dto.ProjectUpdateDTO;
import com.fsega.ai_project_manager.model.Project;
import com.fsega.ai_project_manager.model.User;
import com.fsega.ai_project_manager.repository.ProjectRepository;
import com.fsega.ai_project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }

    @Transactional
    public ProjectDTO createProject(ProjectCreateDTO projectDTO) {
        Project project = new Project();
        project.setName(projectDTO.name());
        project.setDescription(projectDTO.description());

        Project savedProject = projectRepository.save(project);

        return convertToDTO(savedProject);
    }

    @Transactional
    public ProjectDTO updateProject(Long id, ProjectUpdateDTO projectDTO) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
        project.setName(projectDTO.name());
        project.setDescription(projectDTO.description());

        return convertToDTO(project);
    }

    public void deleteProjectById(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public void assignUserToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        project.addUser(user);
    }

    public boolean isProjectOwner(Long id, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));

        return project.getCreatedBy().equals(username);
    }

    private ProjectDTO convertToDTO(Project project) {
        return new ProjectDTO(project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt().toString(),
                project.getUpdatedAt().toString(),
                project.getCreatedBy());
    }
}
