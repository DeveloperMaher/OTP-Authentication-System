import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }


  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {

        if (rememberMe) {
          localStorage.setItem('token', res.token);
        } else {
          sessionStorage.setItem('token', res.token);
        }
        
        localStorage.setItem('username', res.user.username);
        localStorage.removeItem('pendingEmail');
        this.loading = false;
        toast.success('Login successful!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed';
        toast.success(this.errorMessage);
      }
    });
  }

}
