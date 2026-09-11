import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtp {

  otpForm: FormGroup;
  phone = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    this.route.queryParams.subscribe((params) => {
      this.phone = params['phone'] || '';
    });
  }

  onSubmit(): void {

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const otp = this.otpForm.value.otp;

    this.authService.verifyOtp(this.phone, otp).subscribe({

      next: () => {
        this.isLoading = false;
        this.successMessage = 'OTP verified successfully';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error ||
          'Invalid or expired OTP. Please try again.';
      }

    });
  }
}