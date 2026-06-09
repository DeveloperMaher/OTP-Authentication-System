import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OtpComponent } from './features/auth/otp/otp.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { noAuthGuard } from './core/guards/auth/no-auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {
        path: 'login',
        component: LoginComponent,
        canActivate: [noAuthGuard]
    },

    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [noAuthGuard]
    },

    {
        path: 'verify',
        component: OtpComponent,
        canActivate: [noAuthGuard]
    },
    
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    
    {
        path: '**',
        redirectTo: 'login'
    }
];
