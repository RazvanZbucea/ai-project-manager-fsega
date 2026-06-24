import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Comment } from '../../shared/models/comment';

@Injectable({providedIn: 'root'})
export class CommentService {
  private apiUrl = 'http://localhost:8089/api/tasks';
  private httpClient = inject(HttpClient);

  getCommentsByTaskId(taskId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.apiUrl}/${taskId}/comments`);
  }

  createComment(taskId: number, text: string): Observable<Comment> {
    return this.httpClient.post<Comment>(`${this.apiUrl}/${taskId}/comments`, {text});
  }
}
