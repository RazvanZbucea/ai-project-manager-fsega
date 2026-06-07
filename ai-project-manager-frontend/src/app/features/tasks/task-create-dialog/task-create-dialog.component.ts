import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {TaskService} from '../../../core/services/task.service';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.scss']
})
export class TaskCreateDialogComponent implements OnInit {
  // Injectăm referința către dialog pentru a-l putea închide
  public dialogRef = inject(DialogRef<any>);
  // Injectăm datele trimise din componenta părinte (ex: projectId)
  public data = inject(DIALOG_DATA) as { projectId: number };

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private userService = inject(UserService);

  // Signal pentru a stoca lista de useri pentru dropdown
  users = signal<User[]>([]);
  isSubmitting = signal<boolean>(false);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    assignedName: [''], // Va fi populat din select
    priority: ['MEDIUM']
  });

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Eroare la preluarea utilizatorilor:', err)
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting.set(true);
      const newTaskData = {
        title: this.taskForm.value.title ?? '',
        description: this.taskForm.value.description ?? '',
        assignedName: this.taskForm.value.assignedName ?? '',
        status: 'TO_DO', // Default status
        priority: (this.taskForm.value.priority || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      };

      this.taskService.createTask(this.data.projectId, newTaskData).subscribe({
        next: (createdTask) => {
          // Închidem dialogul și trimitem task-ul creat înapoi la componenta părinte
          this.dialogRef.close(createdTask);
        },
        error: (err) => {
          console.error('Eroare la crearea task-ului', err);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(); // Închide fără a salva
  }
}
