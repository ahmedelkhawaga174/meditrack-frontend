import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../services/consultation';
import { ConsultationResponse } from '../../models/consultation-response-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultation',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consultation.html',
  styleUrl: './consultation.css',
})
export class Consultation implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);

  consultationForm!: FormGroup;
  appointmentId = signal<string>('');

  isSubmitting = signal<boolean>(false);
  isCompleted = signal<boolean>(false);
  savedConsultation = signal<ConsultationResponse | null>(null);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const apptId = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('appointmentId') || '';
    this.appointmentId.set(apptId);

    this.consultationForm = this.fb.group({
      notes: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.consultationForm.invalid || !this.appointmentId()) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      appointmentId: this.appointmentId(),
      notes: this.consultationForm.value.notes
    };

    this.consultationService.recordConsultation(payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.isCompleted.set(true);
        this.savedConsultation.set(response);
        this.successMessage.set('Consultation successfully recorded and appointment marked as COMPLETED.');
      },
      error: (err) => {
        console.error('Error recording consultation:', err);
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to record consultation. Please try again.');
      }
    });
  }
}
