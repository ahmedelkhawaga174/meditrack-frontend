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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
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

  onSubmit(): void {

    // Validate OTP form
    if (this.otpForm.invalid) {

      this.otpForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter a valid 6-digit OTP.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb'
      });

      return;
    }

    if (!this.phone) {

      Swal.fire({
        icon: 'error',
        title: 'Phone Number Missing',
        text: 'We could not find the phone number. Please register again.',
        confirmButtonText: 'Go to Register',
        confirmButtonColor: '#2563eb'
      }).then(() => {
        this.router.navigate(['/register']);
      });

      return;
    }

    this.isLoading = true;

    const otp = this.otpForm.value.otp;

    this.authService.verifyOtp(
      this.phone,
      otp
    ).subscribe({

      // ==============================
      // SUCCESS
      // ==============================
      next: () => {

        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Account Verified! 🎉',
          text: 'Your MediTrack account has been successfully verified.',
          confirmButtonText: 'Continue to Login',
          confirmButtonColor: '#2563eb',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {

          this.router.navigate(['/login']);

        });
      },

      // ==============================
      // ERROR
      // ==============================
      error: (error) => {

        console.error('OTP verification error:', error);

        this.isLoading = false;

        const message =
          error?.error ||
          error?.error?.message ||
          'Invalid or expired OTP. Please try again.';

        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: message,
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }
}