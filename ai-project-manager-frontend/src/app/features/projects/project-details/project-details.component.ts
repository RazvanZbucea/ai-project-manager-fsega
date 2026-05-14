import {Component, OnInit, signal} from '@angular/core';
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
  // Transformăm variabilele clasice în Signals (Angular 17+ Best Practice)
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true); // Inițializat cu true

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
    } else {
      this.isLoading.set(false); // Oprim loading-ul dacă id-ul e invalid
    }
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (projectData) => {
        // Folosim .set() pentru a actualiza valoarea unui Signal
        this.project.set(projectData);
        this.isLoading.set(false); // UI-ul se va actualiza INSTANTANEU garantat
      },
      error: (error) => {
        console.error('Eroare la încărcarea detaliilor:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadProjectTasks(id: number): void {
    this.projectService.getTasksByProjectId(id).subscribe({
      next: (taskData) => {
        this.tasks.set(taskData);
      },
      error: (err) => {
        console.error('Eroare la preluarea task-urilor:', err);
      }
    });
  }
}
