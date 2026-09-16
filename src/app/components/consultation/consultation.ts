import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsultationService } from '../../services/consultation';
import { ConsultationResponse } from '../../models/consultation-response-request';
import { PrescriptionRequest } from '../../models/prescription';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultation',
  standalone: true,
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
  prescriptionForm!: FormGroup;

  appointmentId = signal<string>('');

  isSubmitting = signal<boolean>(false);
  isDiagnosisSubmitting = signal<boolean>(false);
  isCompleted = signal<boolean>(false);

  savedConsultation = signal<ConsultationResponse | null>(null);
  savedPrescription = signal<unknown | null>(null);

  isPrescriptionSubmitting = signal<boolean>(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  diagnosisErrorMessage = signal<string | null>(null);
  diagnosisSuccessMessage = signal<string | null>(null);

  prescriptionErrorMessage = signal<string | null>(null);
  prescriptionSuccessMessage = signal<string | null>(null);

  ngOnInit(): void {

    const apptId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.queryParamMap.get('appointmentId') ||
      '';

    this.appointmentId.set(apptId);

    this.consultationForm = this.fb.group({
      diagnosis: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      notes: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]
    });

    this.prescriptionForm = this.fb.group({
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  /**
   * Save Consultation
   */
  onSubmit(): void {

    if (
      this.consultationForm.invalid ||
      !this.appointmentId()
    ) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.diagnosisErrorMessage.set(null);
    this.diagnosisSuccessMessage.set(null);

    const appointmentId = Number(this.appointmentId());

    const payload = {
      appointmentId: this.appointmentId(),
      notes: this.consultationForm.value.notes
    };

    /**
     * First save the consultation notes.
     */
    this.consultationService.recordConsultation(payload).subscribe({

      next: (response) => {

        this.savedConsultation.set(response);
        this.isCompleted.set(true);

        this.successMessage.set(
          'Consultation successfully recorded.'
        );

        /**
         * Then save the diagnosis using the same appointment ID.
         */
        this.saveDiagnosis(appointmentId);
      },

      error: (err) => {

        console.error(
          'Error recording consultation:',
          err
        );

        this.isSubmitting.set(false);

        this.errorMessage.set(
          err.error?.message ||
          'Failed to record consultation. Please try again.'
        );
      }

    });
  }

  /**
   * Save Diagnosis
   */
  private saveDiagnosis(appointmentId: number): void {

    this.isDiagnosisSubmitting.set(true);
    this.diagnosisErrorMessage.set(null);
    this.diagnosisSuccessMessage.set(null);

    const requestBody = {
      diagnosis:
        this.consultationForm.value.diagnosis
    };

    this.consultationService
      .recordDiagnosis(
        appointmentId,
        requestBody
      )
      .subscribe({

        next: () => {

          this.isDiagnosisSubmitting.set(false);
          this.isSubmitting.set(false);

          this.diagnosisSuccessMessage.set(
            'Diagnosis recorded successfully.'
          );
        },

        error: (err) => {

          console.error(
            'Error recording diagnosis:',
            err
          );

          this.isDiagnosisSubmitting.set(false);
          this.isSubmitting.set(false);

          this.diagnosisErrorMessage.set(
            err.error?.message ||
            'Consultation was saved, but diagnosis could not be recorded.'
          );
        }

      });
  }

  /**
   * Issue Prescription
   */
  onSubmitPrescription(): void {

    if (
      this.prescriptionForm.invalid ||
      !this.appointmentId()
    ) {
      this.prescriptionForm.markAllAsTouched();
      return;
    }

    this.isPrescriptionSubmitting.set(true);

    this.prescriptionErrorMessage.set(null);
    this.prescriptionSuccessMessage.set(null);

    const request: PrescriptionRequest =
      this.prescriptionForm.value;

    this.consultationService
      .issuePrescription(
        Number(this.appointmentId()),
        request
      )
      .subscribe({

        next: (response) => {

          this.isPrescriptionSubmitting.set(false);

          this.savedPrescription.set(response);

          this.prescriptionSuccessMessage.set(
            'Prescription issued successfully.'
          );

          this.prescriptionForm.reset();

        },

        error: (err) => {

          console.error(
            'Error issuing prescription:',
            err
          );

          this.isPrescriptionSubmitting.set(false);

          this.prescriptionErrorMessage.set(
            err.error?.message ||
            'Failed to issue prescription. Please try again.'
          );
        }

      });
  }
}