import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CommentService {
  private apiUrl = 'http://localhost:8089/api/tasks';
  private httpClient = inject(HttpClient);

  getCommentsByTaskId(taskId: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.apiUrl}/${taskId}/comments`);
  }

  createComment(taskId: number, content: string): Observable<Comment> {
    return this.httpClient.post<Comment>(`${this.apiUrl}/${taskId}/comments`, {content});
  }
}
