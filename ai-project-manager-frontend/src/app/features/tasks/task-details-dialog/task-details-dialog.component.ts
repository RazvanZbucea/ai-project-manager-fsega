import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {TaskService} from '../../../core/services/task.service';
import {AuthService} from '../../../core/services/auth.service';
import {CommentService} from '../../../core/services/comment.service';
import { Task } from '../../../shared/models/task';
import { Comment } from '../../../shared/models/comment';

@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss']
})
export class TaskDetailsDialogComponent implements OnInit {
  public dialogRef = inject(DialogRef<any>);

  // 1. Am adăugat isProjectDeleted aici
  public data = inject(DIALOG_DATA) as {
    task: Task,
    projectId: number,
    isManager: boolean,
    isProjectDeleted: boolean
  };

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  canEdit = signal<boolean>(false);
  isProjectDeleted = signal<boolean>(false); // 2. Signal nou pentru template-ul HTML
  comments = signal<Comment[]>([]);

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    status: [''],
    priority: ['MEDIUM']
  });

  commentForm = this.fb.group({
    content: ['', [Validators.required]]
  });

  ngOnInit() {
    this.isProjectDeleted.set(this.data.isProjectDeleted);

    // 3. Poate edita DOAR dacă e manager ȘI proiectul este activ
    this.canEdit.set(this.data.isManager && !this.isProjectDeleted());

    this.taskForm.patchValue(this.data.task);

    // Dacă nu poate edita (fie nu e manager, fie e arhivat), blocăm formularul
    if (!this.canEdit()) {
      this.taskForm.disable();
    }

    this.loadComments();
  }

  loadComments() {
    this.commentService.getCommentsByTaskId(this.data.task.id).subscribe(
      res => this.comments.set(res)
    );
  }

  onUpdateTask() {
    // PROTECȚIE FRONTEND: Nu facem apelul HTTP dacă e arhivat sau nu are voie
    if (this.isProjectDeleted() || !this.canEdit()) return;

    if (this.taskForm.valid) {
      const updateData = {
        title: this.taskForm.value.title ?? '',
        description: this.taskForm.value.description ?? '',
        status: this.taskForm.value.status ?? this.data.task.status,
        assignedName: this.data.task.assignedName ?? '',
        priority: (this.taskForm.value.priority || this.data.task.priority || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      };

      this.taskService.updateTask(this.data.task.id, updateData).subscribe(
        updated => this.dialogRef.close(updated)
      );
    }
  }

  onAddComment() {
    // PROTECȚIE FRONTEND: Nu se pot adăuga comentarii la proiecte arhivate
    if (this.isProjectDeleted()) return;

    if (this.commentForm.valid) {
      const contentString = this.commentForm.value.content ?? '';

      this.commentService.createComment(this.data.task.id, contentString).subscribe(() => {
        this.commentForm.reset();
        this.loadComments();
      });
    }
  }
}
