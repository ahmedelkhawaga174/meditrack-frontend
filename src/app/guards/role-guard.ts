import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  // User is not logged in
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as string[];

  // User doesn't have permission
  if (!allowedRoles.includes(user.role)) {
    return router.createUrlTree(['/unauthorized']);
  }
  
    // Patient can only access his own patientId
  if (user.role === 'PATIENT') {

    const patientIdFromUrl = Number(
      route.paramMap.get('patientId')
    );

    if (
      patientIdFromUrl &&
      patientIdFromUrl !== user.patientId
    ) {
      return router.createUrlTree(['/unauthorized']);
    }
  }
  return true;
};