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
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtp {

  otpForm: FormGroup;

  phone = '';

  errorMessage = '';
  successMessage = '';

  isLoading = false;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.otpForm = this.fb.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$')
        ]
      ]
    });

    this.route.queryParams.subscribe((params) => {
      this.phone = params['phone'] || '';
    });
  }

  showToast(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  onSubmit(): void {

    // Invalid OTP
    if (this.otpForm.invalid) {

      this.otpForm.markAllAsTouched();

      this.showToast(
        'Please enter a valid 6-digit OTP.',
        'error'
      );

      return;
    }

    this.isLoading = true;

    const otp = this.otpForm.value.otp;

    this.authService.verifyOtp(
      this.phone,
      otp
    ).subscribe({

      // OTP is correct
      next: () => {

        this.isLoading = false;

        this.toastMessage = 'OTP verified successfully!';
        this.toastType = 'success';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },

      // OTP is wrong
      error: (error) => {

        this.isLoading = false;

        const message =
          error?.error ||
          'Invalid or expired OTP. Please try again.';

        this.showToast(
          message,
          'error'
        );
      }

    });
  }
}