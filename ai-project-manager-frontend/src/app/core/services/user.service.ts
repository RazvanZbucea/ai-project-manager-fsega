import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8089/api/users';
  private httpClient = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl);
  }

  createUser(userDto: UserCreate): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl, userDto);
  }

  updateUser(id: number, userDto: UserUpdate): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${id}`, userDto);
  }
}
