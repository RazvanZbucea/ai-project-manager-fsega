import {Component, OnInit, signal} from '@angular/core';
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
  // --- STATE MANAGEMENT CU SIGNALS ---
  users = signal<User[]>([]);

  isSubmitting = signal<boolean>(false);
  isUpdating = signal<boolean>(false);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  editingUser = signal<User | null>(null);

  // Formularele rămân Reactive Forms (încă nu există o alternativă nativă bazată complet pe semnale în Angular core pentru form group-uri)
  userForm!: FormGroup;
  editUserForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForms();
    this.loadUsers();
  }

  initForms(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['DEVELOPER', Validators.required]
    });

    // Am adăugat câmpul role în formularul de editare
    this.editUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users.set(data), // Setăm valoarea semnalului
      error: (err) => console.error('Eroare la încărcarea utilizatorilor', err)
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.userService.createUser(this.userForm.value).subscribe({
      next: (newUser) => {
        // Actualizăm semnalul array-ului adăugând noul element
        this.users.update(currentUsers => [...currentUsers, newUser]);

        this.successMessage.set('Utilizator creat cu succes!');
        this.userForm.reset({role: 'DEVELOPER'});
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Eroare la crearea utilizatorului. Verifică datele introduse.');
        this.isSubmitting.set(false);
      }
    });
  }

  startEdit(user: User): void {
    this.editingUser.set(user);
    this.editUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role // Populăm rolul curent
    });
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    this.editingUser.set(null);
    this.editUserForm.reset();
  }

  onUpdate(): void {
    const currentUser = this.editingUser();
    if (this.editUserForm.invalid || !currentUser) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    this.isUpdating.set(true);
    const updatedData: UserUpdate = this.editUserForm.value;

    this.userService.updateUser(currentUser.id, updatedData).subscribe({
      next: (updatedUser) => {
        // Actualizăm utilizatorul specific în interiorul semnalului
        this.users.update(currentUsers =>
          currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
        );

        this.successMessage.set('Utilizator actualizat cu succes!');
        this.cancelEdit();
        this.isUpdating.set(false);
      },
      error: (err) => {
        console.error('Eroare la actualizare', err);
        this.errorMessage.set('Eroare la actualizarea utilizatorului.');
        this.isUpdating.set(false);
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Atenție! Ești sigur că vrei să dezactivezi utilizatorul ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage.set(`Utilizatorul ${user.username} a fost dezactivat cu succes.`);

        // Actualizăm starea locală (Optimistic UI Update)
        this.users.update(currentUsers =>
          currentUsers.map(u => u.id === user.id ? { ...u, isDeleted: true } : u)
        );
      },
      error: (err) => {
        console.error('Eroare la ștergerea utilizatorului:', err);
        this.errorMessage.set(`Eroare la ștergerea utilizatorului. Verifică permisiunile.`);
      }
    });
  }
}
