import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {TaskService} from '../../../core/services/task.service';
import {AuthService} from '../../../core/services/auth.service';
import {CommentService} from '../../../core/services/comment.service';

@Component({
  selector: 'app-task-details-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss']
})
export class TaskDetailsDialogComponent implements OnInit {
  public dialogRef = inject(DialogRef<any>);
  public data = inject(DIALOG_DATA) as { task: Task, projectId: number, isManager: boolean };

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  canEdit = signal<boolean>(false);
  comments = signal<Comment[]>([]);

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    status: ['']
  });

  commentForm = this.fb.group({
    content: ['', [Validators.required]]
  });

  ngOnInit() {
    // Setăm direct permisiunea
    this.canEdit.set(this.data.isManager);

    this.taskForm.patchValue(this.data.task);
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
    if (this.taskForm.valid && this.canEdit()) {
      // Construim manual DTO-ul pentru a satisface TypeScript
      const updateData = {
        title: this.taskForm.value.title ?? '',
        description: this.taskForm.value.description ?? '',
        status: this.taskForm.value.status ?? this.data.task.status,
        assignedName: this.data.task.assignedName ?? '' // Păstrăm persoana deja asignată
      };

      this.taskService.updateTask(this.data.task.id, updateData).subscribe(
        updated => this.dialogRef.close(updated)
      );
    }
  }

  onAddComment() {
    if (this.commentForm.valid) {
      // Extragem strict valoarea textului
      const contentString = this.commentForm.value.content ?? '';

      this.commentService.createComment(this.data.task.id, contentString).subscribe(() => {
        this.commentForm.reset();
        this.loadComments(); // Reîncărcăm lista de comentarii
      });
    }
  }
}
