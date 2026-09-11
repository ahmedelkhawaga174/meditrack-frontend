import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../services/consultation';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './diagnosis.html',
  styleUrl: './diagnosis.css',
})
export class Diagnosis implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consultationService = inject(ConsultationService);

  diagnosisForm!: FormGroup;
  appointmentId = signal<string>('');

  isSubmitting = signal<boolean>(false);
  isCompleted = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.appointmentId.set(id);

    this.diagnosisForm = this.fb.group({
      diagnosis: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.diagnosisForm.invalid || !this.appointmentId()) {
      this.diagnosisForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const id = Number(this.appointmentId());

    const requestBody = {
      diagnosis: this.diagnosisForm.value.diagnosis
    };

    this.consultationService.recordDiagnosis(id, requestBody).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isCompleted.set(true);
        this.successMessage.set('Diagnosis recorded successfully.');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to record diagnosis.');
      }
    });
  }
}
