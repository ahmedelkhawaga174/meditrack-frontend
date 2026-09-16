import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Patient,
  UpdatePatientRequest
} from '../../services/patient';

import { PatientInfo } from '../../models/patient';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css'
})
export class PatientProfile implements OnInit {

  private patientService = inject(Patient);

  patient = signal<PatientInfo | null>(null);

  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  firstName = '';
  lastName = '';
  dateOfBirth = '';
  gender = 'MALE';


  ngOnInit(): void {

    const user = JSON.parse(
      localStorage.getItem('auth_user') || 'null'
    );

    const patientId = user?.patientId;

    if (!patientId) {
      this.errorMessage.set(
        'Patient information was not found. Please login again.'
      );

      this.isLoading.set(false);
      return;
    }

    this.loadPatient(patientId);
  }


  loadPatient(patientId: number): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService
      .getPatientInfo(patientId)
      .subscribe({

        next: (data) => {

          this.patient.set(data);

          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.dateOfBirth = data.dateOfBirth;
          this.gender = data.gender;

          this.isLoading.set(false);
        },

        error: (err) => {

          console.error(
            'Error loading patient information:',
            err
          );

          this.errorMessage.set(
            'Unable to load your profile.'
          );

          this.isLoading.set(false);
        }
      });
  }


  startEditing(): void {

    this.successMessage.set('');
    this.errorMessage.set('');
    this.isEditing.set(true);
  }


  cancelEditing(): void {

    const data = this.patient();

    if (data) {

      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.dateOfBirth = data.dateOfBirth;
      this.gender = data.gender;
    }

    this.errorMessage.set('');
    this.isEditing.set(false);
  }


  saveChanges(): void {

    const data = this.patient();

    if (!data) {
      return;
    }

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.dateOfBirth ||
      !this.gender
    ) {

      this.errorMessage.set(
        'Please fill in all required fields.'
      );

      return;
    }

    const request: UpdatePatientRequest = {

      firstName: this.firstName.trim(),

      lastName: this.lastName.trim(),

      dateOfBirth: this.dateOfBirth,

      gender: this.gender
    };

    this.isSaving.set(true);

    this.errorMessage.set('');
    this.successMessage.set('');

    this.patientService
      .updatePatientInfo(data.id, request)
      .subscribe({

        next: (updatedPatient) => {

          this.patient.set(updatedPatient);

          this.firstName = updatedPatient.firstName;
          this.lastName = updatedPatient.lastName;
          this.dateOfBirth = updatedPatient.dateOfBirth;
          this.gender = updatedPatient.gender;

          this.isSaving.set(false);
          this.isEditing.set(false);

          this.successMessage.set(
            'Your profile has been updated successfully!'
          );

          setTimeout(() => {
            this.successMessage.set('');
          }, 3000);
        },

        error: (err) => {

          console.error(
            'Error updating patient information:',
            err
          );

          this.isSaving.set(false);

          this.errorMessage.set(
            err?.error?.message ||
            'Unable to update your profile. Please try again.'
          );
        }
      });
  }
}