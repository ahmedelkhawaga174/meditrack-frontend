import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorResponse } from '../../models/doctor';
import { DoctorService } from '../../services/doctor';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
})
export class DoctorDetails {

  private doctorService = inject(DoctorService);

  doctorId = input.required<number>();

  doctor = signal<DoctorResponse | null>(null);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadDoctor();
  }

  loadDoctor(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.doctorService.getDoctorById(this.doctorId()).subscribe({
      next: (data) => {
        this.doctor.set(data);
        this.isLoading.set(false);
      },

      error: (err) => {
        console.error(err);

        this.error.set('Unable to load doctor information.');
        this.isLoading.set(false);
      }
    });
  }
}