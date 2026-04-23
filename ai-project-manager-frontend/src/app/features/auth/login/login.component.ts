import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';

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

  constructor(private authService: AuthService) {
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const loginRequest: LoginRequest = {
        username: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? ''
      };

      console.log('Datele pregătite pentru backend:', loginRequest);
    }
  }
}
