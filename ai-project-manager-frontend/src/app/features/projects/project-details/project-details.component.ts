import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ProjectService} from '../../../core/services/project.service';
import {TaskService} from '../../../core/services/task.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DragDropModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project = signal<Project | null>(null);
  isLoading = signal<boolean>(true);
  isEditing = false;

  // Stari Kanban in loc de lista simpla
  todoTasks = signal<Task[]>([]);
  inProgressTasks = signal<Task[]>([]);
  testingTasks = signal<Task[]>([]);
  doneTasks = signal<Task[]>([]);

  // Avem nevoie de asta doar pentru empty state
  totalTasksCount = signal<number>(0);

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

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
        this.totalTasksCount.set(taskData.length);
        this.distributeTasksToKanban(taskData);
      },
      error: (err) => {
        console.error('Eroare la preluarea task-urilor:', err);
      }
    });
  }

  // Imparte taskurile sosite de la backend in coloanele potrivite
  private distributeTasksToKanban(tasks: Task[]): void {
    this.todoTasks.set(tasks.filter(t => t.status === 'TO_DO'));
    this.inProgressTasks.set(tasks.filter(t => t.status === 'IN_PROGRESS'));
    this.testingTasks.set(tasks.filter(t => t.status === 'TESTING'));
    this.doneTasks.set(tasks.filter(t => t.status === 'DONE'));
  }

  // Eveniment declansat de CDK la Drop
  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      // Reordonare vizuala in aceeasi coloana
      const items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.updateColumnSignal(newStatus, items);
    } else {
      // Mutare in alta coloana Kanban
      const previousData = [...event.previousContainer.data];
      const currentData = [...event.container.data];
      const taskToMove = previousData[event.previousIndex];
      const oldStatus = event.previousContainer.id; // folosim id-ul cdkDropList

      // Extragem item-ul dintr-o lista si il punem in cealalta vizual
      transferArrayItem(previousData, currentData, event.previousIndex, event.currentIndex);

      // Actualizam imediat UI-ul ca sa para fluid (Optimistic UI update)
      this.updateColumnSignal(oldStatus, previousData);
      this.updateColumnSignal(newStatus, currentData);
      taskToMove.status = newStatus; // actualizam obiectul intern pentru corectitudine vizuala a badge-ului

      // Trimitem request asincron catre server
      this.taskService.updateTaskStatus(taskToMove.id, newStatus).subscribe({
        error: (err) => {
          console.error('Eroare validare backend (tranzitie incorecta). Revin la starea initiala.', err);
          // Dacă backend-ul refuză (regula din switch expressions a picat), dăm revert.
          this.loadProjectTasks(this.project()!.id);
        }
      });
    }
  }

  private updateColumnSignal(status: string, data: Task[]): void {
    switch(status) {
      case 'TO_DO': this.todoTasks.set(data); break;
      case 'IN_PROGRESS': this.inProgressTasks.set(data); break;
      case 'TESTING': this.testingTasks.set(data); break;
      case 'DONE': this.doneTasks.set(data); break;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
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

      this.projectService.updateProject(currentProject.id, updatedProjectData).subscribe({
        next: (response) => {
          this.project.set(response);
          this.isEditing = false;
        },
        error: (err) => console.error('Eroare la actualizarea proiectului:', err)
      });
    }
  }
}
