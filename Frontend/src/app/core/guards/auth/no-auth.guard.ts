import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {
   const authService =  inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn()
    ? router.createUrlTree(['/home'])
    : true;
};
