import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { GeneratedTask } from '../../shared/models/generated-task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('ar trebui să preia task-urile generate via AI', () => {
    const dummyProjectId = 1;
    const mockResponse: GeneratedTask[] = [{
      title: 'Task 1', description: 'Desc 1', priority: 'HIGH',
      suggestedStatus: "TO_DO"
    }];

    // Executăm apelul (asincron)
    service.generateTaskPreview(dummyProjectId).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toEqual('Task 1');
    });

    // Validăm că request-ul s-a făcut pe URL-ul corect
    const req = httpMock.expectOne(`http://localhost:8089/api/projects/${dummyProjectId}/tasks/ai-preview`);
    expect(req.request.method).toBe('GET');

    // Răspundem cu datele false pentru a finaliza testul
    req.flush(mockResponse);
  });

  afterEach(() => {
    // Verificăm să nu existe cereri HTTP rămase deschise
    httpMock.verify();
  });
});
