import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {tap} from 'rxjs';
import {AuthResponse} from '../../shared/models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8089/api/auth/login';
  currentUser = signal<AuthResponse | null>(this.getUserFromStorage());

  constructor(private http: HttpClient) {
  }

  login(loginRequest: LoginRequest) {
    return this.http.post<AuthResponse>(this.apiUrl, loginRequest).pipe(tap((response: AuthResponse) => {
      localStorage.setItem('jwToken', response.token);
    }));
  }

  isAuthenticated() {
    return !!localStorage.getItem('jwToken');
  }

  getAuthToken() {
    return localStorage.getItem('jwToken');
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  private getUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
