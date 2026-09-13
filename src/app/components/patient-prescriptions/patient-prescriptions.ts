import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConsultationService } from '../../services/consultation';
import { PatientPrescriptionResponse } from '../../models/prescription';

@Component({
  selector: 'app-patient-prescriptions',
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-prescriptions.html',
  styleUrl: './patient-prescriptions.css'
})
export class PatientPrescriptions implements OnInit {

  private route = inject(ActivatedRoute);
  private consultationService = inject(ConsultationService);

  patientId = signal<number>(0);
  prescriptions = signal<PatientPrescriptionResponse[]>([]);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('patientId');

    if (!id) {
      this.errorMessage.set('Patient ID was not provided.');
      return;
    }

    const patientId = Number(id);

    this.patientId.set(patientId);
    this.loadPrescriptions(patientId);
  }

  loadPrescriptions(patientId: number): void {

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.consultationService
      .getPatientPrescriptions(patientId)
      .subscribe({
        next: (response) => {
          this.prescriptions.set(response);
          this.isLoading.set(false);
        },

        error: (err) => {
          console.error('Error loading prescriptions:', err);

          this.isLoading.set(false);

          this.errorMessage.set(
            err.error?.message ||
            'Failed to load prescriptions.'
          );
        }
      });
  }
}