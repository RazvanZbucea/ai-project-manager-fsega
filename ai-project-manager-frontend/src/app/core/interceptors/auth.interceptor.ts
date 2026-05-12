import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).getAuthToken(); // Presupunem că returnează string sau null

  // Dacă avem token, clonăm request-ul și adăugăm header-ul standard
  if (authToken) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(clonedReq);
  }

  // Dacă nu avem token (ex: cerere de login), trimitem request-ul original
  return next(req);
}
