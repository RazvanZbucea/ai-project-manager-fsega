import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {GeneratedTask} from '../../../shared/models/generated-task';

export interface AiPreviewDialogData {
  tasks: GeneratedTask[];
  projectId: number;
}

@Component({
  selector: 'app-ai-tasks-preview-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-tasks-preview-dialog.component.html',
  styleUrls: ['./ai-tasks-preview-dialog.component.scss']
})
export class AiTasksPreviewDialogComponent {
  public dialogRef = inject(DialogRef);
  public data = inject<AiPreviewDialogData>(DIALOG_DATA);

  // Folosim signals pentru a gestiona starea checkbox-urilor
  public selectableTasks = signal<{ task: GeneratedTask; selected: boolean }[]>([]);

  constructor() {
    // Implicit, toate task-urile generate sunt selectate
    const mappedTasks = this.data.tasks.map(t => ({ task: t, selected: true }));
    this.selectableTasks.set(mappedTasks);
  }

  toggleSelection(index: number): void {
    this.selectableTasks.update(tasks => {
      tasks[index].selected = !tasks[index].selected;
      return [...tasks];
    });
  }

  onSave(): void {
    // Filtrăm doar task-urile aprobate de utilizator
    const finalTasks = this.selectableTasks()
      .filter(item => item.selected)
      .map(item => ({
        title: item.task.title,
        description: item.task.description,
        status: item.task.suggestedStatus || 'TO_DO',
        priority: item.task.priority
      }));

    // Închidem dialogul și trimitem datele curate înapoi
    this.dialogRef.close(finalTasks);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
