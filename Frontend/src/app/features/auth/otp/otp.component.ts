import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-otp',
  imports: [NgFor, NgIf, ReactiveFormsModule ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router){}
  otpForm = new FormGroup({
    otp: new FormArray(
      Array.from({ length: 6 }).map(() =>
        new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]$/)
        ])
      )
    )
  });


  get otpControls() {
    return (this.otpForm.get('otp') as FormArray).controls;
  }

  verifyOtp() {
    const otp = (this.otpForm.value.otp as string[]).join('');

    if (otp.length !== 6) {
      this.errorMessage = 'Invalid OTP';
      return;
    }
    const email = localStorage.getItem('pendingEmail') || '';

    this.authService.verifyOtp(email, otp).subscribe({
      next: ()=> {
        this.successMessage = 'OTP verified successfully!';
        this.errorMessage = '';
        toast.success(this.successMessage);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
       
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Verify failed';
        this.successMessage = '';
      }
    })
  }

  moveNext(event: any, index: number) {
    const input = event.target;

    if (input.value && index < 5) {
      const next = document.querySelectorAll('input')[index + 1] as HTMLElement;
      next?.focus();
    }
  }
  
}
