import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('ai-project-manager-frontend');
  authService = inject(AuthService);
}
