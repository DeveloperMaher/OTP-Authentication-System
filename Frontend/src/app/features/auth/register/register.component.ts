import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-register',
  imports: [NgIf,ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) 
    {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;

      const userData = {
        username: this.registerForm.get('username')?.value ?? '',
        email: this.registerForm.get('email')?.value ?? '',
        password: this.registerForm.get('password')?.value ?? ''
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.successMessage = 'Please confirm your email address to continue.';
          this.errorMessage = '';
          toast.success(this.successMessage);
          localStorage.setItem('pendingEmail', this.registerForm.get('email')?.value ?? '');
          this.registerForm.reset();
          this.router.navigate(['/verify']);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Registration failed!';
          toast.success(this.errorMessage);
          this.successMessage = '';
          this.loading = false;
        }
      });
    }
  }
  
}
