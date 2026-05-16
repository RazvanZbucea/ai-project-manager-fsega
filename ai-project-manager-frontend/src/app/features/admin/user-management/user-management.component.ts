import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['DEVELOPER', Validators.required] // Valoare default
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Eroare la încărcarea utilizatorilor', err)
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.createUser(this.userForm.value).subscribe({
      next: (newUser) => {
        this.users.push(newUser); // Adăugăm noul user în listă fără a face un nou request
        this.successMessage = 'Utilizator creat cu succes!';
        this.userForm.reset({role: 'DEVELOPER'}); // Resetăm forma, păstrând rolul default
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Eroare la crearea utilizatorului. Verifică datele introduse.';
        this.isSubmitting = false;
      }
    });
  }
}
