import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8089/api/tasks';
  private httpClient = inject(HttpClient);

  updateTaskStatus(id: number, newStatus: string): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.apiUrl}/${id}/status`, {status: newStatus});
  }

  createTask(projectId: number, taskData: TaskCreate): Observable<Task> {
    return this.httpClient.post<Task>(`http://localhost:8089/api/projects/${projectId}/tasks`, taskData);
  }
}
