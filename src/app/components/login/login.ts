import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;

  errorMessage = '';
  isLoading = false;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,15}$')
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
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

    // Invalid form
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.showToast(
        'Please enter a valid phone number and password.',
        'error'
      );

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(
      this.loginForm.value
    ).subscribe({

      // Login successful
      next: (response) => {

        this.isLoading = false;

        this.showToast(
          'Login successful!',
          'success'
        );

        setTimeout(() => {

          if (response.role === 'RECEPTIONIST') {

            this.router.navigate(['/receptionist']);

          } else if (response.role === 'PATIENT') {

            this.router.navigate(['/doctors']);

          } else if (response.role === 'DOCTOR') {

            // Use Doctor ID, not User ID
            if (response.doctorId == null) {

              this.showToast(
                'Doctor profile was not found.',
                'error'
              );

              return;
            }

            this.router.navigate([
              '/doctor',
              response.doctorId
            ]);

          } else if (response.role === 'SUPER_ADMIN') {

            this.router.navigate(['/doctors']);

          }

        }, 3000);
      },

      // Login failed
      error: () => {

        this.isLoading = false;

        this.errorMessage =
          'Password or phone number not correct';

        this.showToast(
          'Password or phone number not correct.',
          'error'
        );
      }

    });
  }
}