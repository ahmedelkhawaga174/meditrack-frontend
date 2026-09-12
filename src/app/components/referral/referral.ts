import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReferralService } from '../../services/referral';
import { DoctorOption, ReferralRequest } from '../../models/referral';

@Component({
  selector: 'app-referral',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
      referralReason: ['', [Validators.required, Validators.minLength(5)]],
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
      referralReason: this.referralForm.value.referralReason,
    };

    this.referralService.createReferral(payload).subscribe({
      next: (createdReferral) => {
        this.isSubmitting.set(false);
        this.successMessage.set('Referral submitted successfully!');
        setTimeout(() => {
          this.router.navigate(['/referrals', createdReferral.id]);
        }, 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to submit referral.');
      },
    });
  }
}
