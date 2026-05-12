import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent {
  private projectService = inject(ProjectService);

  projects = toSignal(this.projectService.getProjects(), { initialValue: [] });
}
