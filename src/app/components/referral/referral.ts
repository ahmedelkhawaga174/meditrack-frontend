import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralService } from '../../services/referral';
import { DoctorOption, ReferralRequest } from '../../models/referral';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-referral',
  imports: [ReactiveFormsModule],
  templateUrl: './referral.html',
  styleUrl: './referral.css',
})
export class Referral implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private referralService = inject(ReferralService);

  referralForm!: FormGroup;
  appointmentId = signal<number | null>(null);

  doctors = signal<DoctorOption[]>([]);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('appointmentId');
    if (idParam) {
      this.appointmentId.set(Number(idParam));
    }

    this.referralForm = this.fb.group({
      referredToDoctorId: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      notes: [''],
    });

    this.loadDoctors();
  }

  loadDoctors(): void {
    this.referralService.getDoctors().subscribe({
      next: (data) => this.doctors.set(data),
      error: () => this.errorMessage.set('Failed to load doctors list.'),
    });
  }

  onSubmit(): void {
    if (this.referralForm.invalid || !this.appointmentId()) {
      this.referralForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload: ReferralRequest = {
      appointmentId: this.appointmentId()!,
      referredToDoctorId: Number(this.referralForm.value.referredToDoctorId),
      reason: this.referralForm.value.reason,
      notes: this.referralForm.value.notes,
    };

    this.referralService.createReferral(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Referral submitted successfully!');
        setTimeout(() => {
          this.router.navigate(['/doctors/1/patients']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to submit referral.');
      },
    });
  }
}
