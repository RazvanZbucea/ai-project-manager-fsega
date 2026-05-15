import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'; // <-- IMPORT CRITIC
import {ProjectService} from '../../../core/services/project.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], // <-- Adăugat ReactiveFormsModule
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  // Starea componentei folosind Signals
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);

  // Stare nouă pentru modul de editare
  isEditing = false;

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  // Definirea formularului reactiv
  editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadProjectTasks(projectId);
    } else {
      this.isLoading.set(false);
    }
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (projectData) => {
        this.project.set(projectData);
        this.isLoading.set(false);
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    // Când intrăm în modul de editare, populăm formularul cu datele existente
    if (this.isEditing) {
      const currentProject = this.project();
      if (currentProject) {
        this.editForm.patchValue({
          name: currentProject.name,
          description: currentProject.description
        });
      }
    }
  }

  onUpdate(): void {
    if (this.editForm.valid) {
      const currentProject = this.project();
      if (!currentProject || !currentProject.id) return;

      const updatedProjectData: ProjectUpdate = {
        name: this.editForm.value.name ?? '',
        description: this.editForm.value.description ?? ''
      };

      // Presupunând că ai o metodă updateProject în ProjectService-ul tău
      this.projectService.updateProject(currentProject.id, updatedProjectData).subscribe({
        next: (response) => {
          // Actualizăm direct semnalul cu răspunsul de la server (fără a reîncărca pagina!)
          this.project.set(response);
          this.isEditing = false; // Închidem formularul
        },
        error: (err) => {
          console.error('Eroare la actualizarea proiectului:', err);
        }
      });
    }
  }
}
