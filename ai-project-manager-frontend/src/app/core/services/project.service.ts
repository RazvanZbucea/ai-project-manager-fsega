import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../../shared/models/project';
import {ProjectCreate} from '../../shared/models/project-create';
import {ProjectUpdate} from '../../shared/models/project-update';
import {Task} from '../../shared/models/task';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8089/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: ProjectCreate): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${projectId}/tasks`);
  }

  updateProject(id: number, project: ProjectUpdate): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
