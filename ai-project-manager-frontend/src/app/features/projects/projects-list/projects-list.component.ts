import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { RouterLink } from '@angular/router';
import {Project} from '../../../shared/models/project';
import {ProjectCreate} from '../../../shared/models/project-create';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);

  // 1. Folosim WritableSignal în loc de toSignal
  projects = signal<Project[]>([]);
  isCreatingProject = false;

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  // 2. Încărcăm datele la inițializare
  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Eroare la încărcarea proiectelor', err)
    });
  }

  toggleForm() {
    this.isCreatingProject = !this.isCreatingProject;
    if (!this.isCreatingProject) {
      this.projectForm.reset();
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const newProject: ProjectCreate = {
        name: this.projectForm.value.name ?? '',
        description: this.projectForm.value.description ?? ''
      };

      this.projectService.createProject(newProject).subscribe({
        next: (createdProject) => {
          console.log('Project created successfully:', createdProject);

          // 3. Adăugăm proiectul în lista curentă FĂRĂ refresh la pagină
          this.projects.update(currentProjects => [...currentProjects, createdProject]);

          this.toggleForm();
        },
        error: (error) => {
          console.error('Failed to create project:', error);
        }
      });
    }
  }

  onDeleteProject(project: Project): void {
    if (confirm(`Ești sigur că vrei să arhivezi proiectul "${project.name}"?`)) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          // Folosim map() în loc de filter() pentru a actualiza statusul proiectului
          // fără a-l scoate din lista afișată pe ecran
          this.projects.update(currentProjects =>
            currentProjects.map(p =>
              p.id === project.id ? { ...p, isDeleted: true } : p
            )
          );
        },
        error: (err) => {
          console.error('Eroare la arhivarea proiectului', err);
        }
      });
    }
  }

  canArchiveProject(project: Project): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;

    // Poate arhiva doar dacă e ADMIN sau dacă el este creatorul proiectului
    return user.role === 'ADMIN' || project.createdBy === user.username;
  }
}
