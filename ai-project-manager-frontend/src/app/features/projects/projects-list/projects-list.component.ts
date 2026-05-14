import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProjectService} from '../../../core/services/project.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projects = toSignal(this.projectService.getProjects(), {initialValue: []});
  isCreatingProject = false;

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

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
        next: (response) => {
          console.log('Project created successfully:', response);
          this.toggleForm();
          window.location.reload();
        },
        error: (error) => {
          console.error('Failed to create project:', error);
        }
      });
    }
  }
}
