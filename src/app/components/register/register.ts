import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,15}$')
        ]
      ],

      dateOfBirth: ['', Validators.required],

      gender: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({

      next: (response) => {
        this.isLoading = false;

        this.router.navigate(['/verify-otp'], {
          queryParams: {
            phone: response.phone
          }
        });
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please try again.';
      }

    });
  }
}