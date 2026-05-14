import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    console.log('Sunt în ngOnInit')
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadProjectTasks(projectId);
    } else {
      this.isLoading = false;
    }
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (projectData) => {
        this.project = projectData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Eroare la încărcarea detaliilor proiectului:', error);
        this.isLoading = false;
      }
    });
  }

  loadProjectTasks(id: number): void {
    this.projectService.getTasksByProjectId(id).subscribe({
      next: (taskData) => {
        console.log('[TaskService] Răspuns primit de la backend:', taskData);
        this.tasks = taskData;
      },
      error: (err) => {
        console.error('[TaskService] Eroare la preluarea task-urilor:', err);
      }
    });
  }
}
