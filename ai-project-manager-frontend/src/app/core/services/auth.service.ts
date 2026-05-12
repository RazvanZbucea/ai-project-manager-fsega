import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string = 'http://localhost:8089/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginRequest: LoginRequest) {
    return this.http.post<AuthResponse>(this.apiUrl, loginRequest).pipe(tap((response: AuthResponse) => {
      localStorage.setItem('jwToken', response.token);
    }));
  }

  isAuthenticated(){
    if(localStorage.getItem('jwToken')){
      return true;
    }
    this.router.navigate(['/login']);
    return  false;
  }
}
