import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ProjectService} from '../../../core/services/project.service';
import {TaskService} from '../../../core/services/task.service';
import {Dialog, DialogModule} from '@angular/cdk/dialog';
import {TaskCreateDialogComponent} from '../../tasks/task-create-dialog/task-create-dialog.component';
import {TaskDetailsDialogComponent} from '../../tasks/task-details-dialog/task-details-dialog.component';
import {AuthService} from '../../../core/services/auth.service';
import {AiTasksPreviewDialogComponent} from '../../tasks/ai-tasks-preview-dialog/ai-tasks-preview-dialog.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DragDropModule, DialogModule],
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

  isUpdating = signal<boolean>(false);
  isGeneratingTasks = signal<boolean>(false);

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private dialog = inject(Dialog);
  private authService = inject(AuthService);

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

  private distributeTasksToKanban(tasks: Task[]): void {
    this.todoTasks.set(tasks.filter(t => t.status === 'TO_DO'));
    this.inProgressTasks.set(tasks.filter(t => t.status === 'IN_PROGRESS'));
    this.testingTasks.set(tasks.filter(t => t.status === 'TESTING'));
    this.doneTasks.set(tasks.filter(t => t.status === 'DONE'));
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    // PROTECȚIE FRONTEND: Nu permitem nicio mutare dacă proiectul este arhivat
    if (this.project()?.isDeleted) return;

    if (event.previousContainer === event.container) {
      const items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.updateColumnSignal(newStatus, items);
    } else {
      const previousData = [...event.previousContainer.data];
      const currentData = [...event.container.data];
      const taskToMove = previousData[event.previousIndex];
      const oldStatus = event.previousContainer.id;

      transferArrayItem(previousData, currentData, event.previousIndex, event.currentIndex);

      this.updateColumnSignal(oldStatus, previousData);
      this.updateColumnSignal(newStatus, currentData);
      taskToMove.status = newStatus;

      this.taskService.updateTaskStatus(taskToMove.id, newStatus).subscribe({
        error: (err) => {
          console.error('Eroare validare backend (tranzitie incorecta). Revin la starea initiala.', err);
          this.loadProjectTasks(this.project()!.id);
        }
      });
    }
  }

  private updateColumnSignal(status: string, data: Task[]): void {
    switch (status) {
      case 'TO_DO':
        this.todoTasks.set(data);
        break;
      case 'IN_PROGRESS':
        this.inProgressTasks.set(data);
        break;
      case 'TESTING':
        this.testingTasks.set(data);
        break;
      case 'DONE':
        this.doneTasks.set(data);
        break;
    }
  }

  toggleEdit(): void {
    // PROTECȚIE FRONTEND
    if (this.project()?.isDeleted) return;

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
    // PROTECȚIE FRONTEND
    const currentProject = this.project();
    if (!currentProject || !currentProject.id || currentProject.isDeleted) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isUpdating.set(true);

    const updatedProjectData: ProjectUpdate = {
      name: this.editForm.value.name ?? '',
      description: this.editForm.value.description ?? ''
    };

    this.projectService.updateProject(currentProject.id, updatedProjectData).subscribe({
      next: (response) => {
        this.project.set(response);
        this.isEditing = false;
        this.isUpdating.set(false);
      },
      error: (err) => {
        this.isUpdating.set(false);
        console.error('Eroare la actualizarea proiectului:', err);
      }
    });
  }

  openCreateTaskDialog(): void {
    const currentProject = this.project();
    // PROTECȚIE FRONTEND
    if (!currentProject || currentProject.isDeleted) return;

    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      data: {projectId: currentProject.id},
      width: '500px',
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: true
    });

    dialogRef.closed.subscribe((newTask: any) => {
      if (newTask) {
        this.todoTasks.update(tasks => [...tasks, newTask]);
        this.totalTasksCount.update(count => count + 1);
      }
    });
  }

  openTaskDetails(task: Task) {
    const user = this.authService.currentUser();
    const currentProject = this.project();

    const isManager = user?.role === 'ADMIN' || currentProject?.createdBy === user?.username;

    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      // AM ADĂUGAT isProjectDeleted PENTRU DIALOGUL DE DETALII TASK
      data: {
        task,
        projectId: currentProject?.id,
        isManager,
        isProjectDeleted: currentProject?.isDeleted
      },
      width: '600px',
      backdropClass: 'cdk-overlay-dark-backdrop'
    });

    dialogRef.closed.subscribe(result => {
      if (result) this.loadProjectTasks(currentProject!.id);
    });
  }

  generateTasksFromAI(): void {
    const currentProject = this.project();
    if (!currentProject || !currentProject.id || currentProject.isDeleted) return;

    this.isGeneratingTasks.set(true);

    // 1. Cerem preview-ul de la AI
    this.taskService.generateTaskPreview(currentProject.id).subscribe({
      next: (generatedTasks) => {
        this.isGeneratingTasks.set(false);

        // 2. Deschidem dialogul Human-in-the-Loop
        const dialogRef = this.dialog.open(AiTasksPreviewDialogComponent, {
          data: {tasks: generatedTasks, projectId: currentProject.id},
          width: '700px',
          backdropClass: 'cdk-overlay-dark-backdrop',
          disableClose: true
        });

        // 3. Așteptăm răspunsul utilizatorului
        dialogRef.closed.subscribe((approvedTasks: any) => {
          if (approvedTasks && approvedTasks.length > 0) {
            // Dacă a aprobat task-uri, apelăm backend-ul pentru a le salva oficial
            this.isUpdating.set(true);
            this.taskService.createTasksBulk(currentProject.id, approvedTasks).subscribe({
              next: () => {
                this.isUpdating.set(false);
                this.loadProjectTasks(currentProject.id); // Reîncărcăm board-ul
              },
              error: (err) => {
                this.isUpdating.set(false);
                console.error('Eroare la salvarea task-urilor', err);
              }
            });
          }
        });
      },
      error: (err) => {
        this.isGeneratingTasks.set(false);
        console.error('Eroare la generarea task-urilor via AI:', err);
      }
    });
  }
}
