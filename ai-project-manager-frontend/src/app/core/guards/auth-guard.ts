import { CanActivateFn } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from 'vitest';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
