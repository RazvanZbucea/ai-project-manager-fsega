import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'] // Opțional, dacă ai stiluri specifice
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadProjectTasks(projectId);
    }
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => {
        console.error('Eroare la încărcarea detaliilor proiectului:', error);
      }
    });
  }

  loadProjectTasks(id: number): void {
    this.projectService.getTasksByProjectId(id).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Eroare la încărcarea task-urilor proiectului:', error);
        this.isLoading = false;
      }
    });
  }
}
