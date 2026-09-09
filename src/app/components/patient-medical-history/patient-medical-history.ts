import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicalHistoryResponse } from '../../models/medical-history';
import { Patient } from '../../services/patient';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-medical-history',
  imports: [DatePipe],
  templateUrl: './patient-medical-history.html',
  styleUrl: './patient-medical-history.css',
})
export class PatientMedicalHistory implements OnInit{

  private patientService = inject(Patient);
  private route = inject(ActivatedRoute);

  medicalHistory = signal<MedicalHistoryResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const patientId = Number(this.route.snapshot.paramMap.get('patientId')) || 1;
    this.fetchMedicalHistory(patientId);
  }

  fetchMedicalHistory(patientId: number): void {
    this.isLoading.set(true);
    this.patientService.getMedicalHistory(patientId).subscribe({
      next: (data) => {
        this.medicalHistory.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching medical history:', err);
        this.errorMessage.set('Failed to load patient medical history.');
        this.isLoading.set(false);
      }
    });
  }
}
