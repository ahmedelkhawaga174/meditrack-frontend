import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Don't attach the token to the login request itself.
  const isLoginRequest = req.url.includes('/login');

  const token = authService.getToken();
  const authReq =
    token && !isLoginRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Session expired or token rejected: clear it and go back to login.
      if (error?.status === 401 && authService.isLoggedIn()) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
