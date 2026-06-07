import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8089/api/tasks';
  private projectApiUrl = 'http://localhost:8089/api/projects';
  private httpClient = inject(HttpClient);

  updateTaskStatus(id: number, newStatus: string): Observable<Task> {
    return this.httpClient.patch<Task>(`${this.apiUrl}/${id}/status`, {status: newStatus});
  }

  createTask(projectId: number, taskData: TaskCreate): Observable<Task> {
    return this.httpClient.post<Task>(`http://localhost:8089/api/projects/${projectId}/tasks`, taskData);
  }

  updateTask(id: number, task: TaskUpdate): Observable<Task> {
    return this.httpClient.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  generateTaskPreview(projectId: number): Observable<GeneratedTask[]> {
    return this.httpClient.get<GeneratedTask[]>(`${this.projectApiUrl}/${projectId}/tasks/ai-preview`);
  }

  createTasksBulk(projectId: number, tasks: any[]): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.projectApiUrl}/${projectId}/tasks/bulk`, tasks);
  }
}
