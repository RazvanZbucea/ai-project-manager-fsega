import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const loginRequest: LoginRequest = {
        username: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? ''
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Email sau parolă incorectă. Te rugăm să încerci din nou.';
        }
      });
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
