import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {tap} from 'rxjs';
import {AuthResponse} from '../../shared/models/auth-response';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8089/api/auth/login';
  currentUser = signal<AuthResponse | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginRequest: LoginRequest) {
    return this.http.post<AuthResponse>(this.apiUrl, loginRequest).pipe(
      tap((response: AuthResponse) => {
        // 1. Salvăm întregul obiect (token, username, role) ca string JSON sub cheia 'user'
        localStorage.setItem('user', JSON.stringify(response));

        // 2. Actualizăm semnalul reactiv! Asta va face Navbar-ul să apară instantaneu.
        this.currentUser.set(response);
      })
    );
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

  logout(): void {
    localStorage.removeItem('user'); // Ștergem obiectul din memorie
    this.currentUser.set(null);      // Resetăm semnalul reactiv
    this.router.navigate(['/login']); // Trimitem user-ul la ușa din față
  }
}
