import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ProjectService} from '../../../core/services/project.service';
import {Router} from '@angular/router';
import {ProjectCreate} from '../../../shared/models/project-create';

@Component({
  selector: 'app-project-create',
  imports: [],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss',
})
export class ProjectCreateComponent {
  private formBuilder = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projectForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['']
  })

  onSubmit() {
    if (this.projectForm.valid) {
      const newProject: ProjectCreate = {
        name: this.projectForm.value.name ?? '',
        description: this.projectForm.value.description ?? ''
      };
      this.projectService.createProject(newProject).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.router.navigate(['/projects']).then(r => console.log('Navigation to projects list successful:', r));
        },
        error: (error) => {
          console.error('Failed to create project:', error);
        }
      })
    }
  }
}
