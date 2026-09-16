import {
  Component,
  inject,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

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
export class ReceptionistPatients implements OnInit {

  private patientService = inject(Patient);
  private cdr = inject(ChangeDetectorRef);

  searchQuery = '';

  patients: PatientInfo[] = [];

  filteredPatients: PatientInfo[] = [];

  isLoading = false;

  errorMessage = '';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadPatients();
  }


  // =====================================================
  // LOAD ALL PATIENTS
  // =====================================================

  loadPatients(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.patientService
      .getAllPatients()
      .subscribe({

        next: (response) => {

          this.patients = response;

          this.filteredPatients = response;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading patients:',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to load patients.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchPatients(): void {

    const query =
      this.searchQuery
        .trim()
        .toLowerCase();


    // Empty search → show all patients

    if (!query) {

      this.filteredPatients =
        this.patients;

      this.errorMessage = '';

      this.cdr.detectChanges();

      return;
    }


    // Filter by name OR phone

    this.filteredPatients =
      this.patients.filter(patient => {

        const fullName =
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase();

        const phone =
          patient.phone?.toLowerCase() || '';

        return (
          fullName.includes(query) ||
          phone.includes(query)
        );

      });


    if (this.filteredPatients.length === 0) {

      this.errorMessage =
        'No patient found matching your search.';

    } else {

      this.errorMessage = '';

    }

    this.cdr.detectChanges();
  }


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.searchQuery = '';

    this.filteredPatients =
      this.patients;

    this.errorMessage = '';

    this.cdr.detectChanges();
  }

}