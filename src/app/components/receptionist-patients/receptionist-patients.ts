import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Patient } from '../../services/patient';
import { PatientInfo } from '../../models/patient';

@Component({
  selector: 'app-receptionist-patients',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './receptionist-patients.html',
  styleUrl: './receptionist-patients.css'
})
export class ReceptionistPatients {

  private patientService = inject(Patient);
  private cdr = inject(ChangeDetectorRef);

  phone = '';

  patients: PatientInfo[] = [];

  isLoading = false;
  errorMessage = '';

  searchPatients(): void {

    if (!this.phone.trim()) {
      this.errorMessage = 'Please enter a phone number';
      this.patients = [];

      this.cdr.detectChanges();

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.patients = [];

    this.patientService.searchPatients(this.phone.trim())
      .subscribe({

        next: (response) => {

          console.log('RESPONSE FROM BACKEND:', response);

          this.patients = response;
          this.isLoading = false;

          console.log('PATIENTS:', this.patients);

          // Force Angular to update the UI
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error('Search error:', error);

          this.isLoading = false;
          this.errorMessage = 'Failed to search patient';

          this.cdr.detectChanges();
        }

      });
  }
}