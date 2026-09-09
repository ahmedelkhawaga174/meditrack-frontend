import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorResponse, SlotResponse } from '../../models/doctor';
import { DoctorService } from '../../services/doctor';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
})
export class DoctorDetails {

  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);

  doctorId = input.required<number>();

  doctor = signal<DoctorResponse | null>(null);
  selectedSlot = signal<SlotResponse | null>(null);

  isLoading = signal(true);
  isBooking = signal(false);

  error = signal('');
  bookingMessage = signal('');

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

  selectSlot(slot: SlotResponse): void {
    this.selectedSlot.set(slot);
    this.bookingMessage.set('');
  }

  bookAppointment(): void {
    const doctor = this.doctor();
    const slot = this.selectedSlot();

    if (!doctor || !slot) {
      return;
    }

    this.isBooking.set(true);
    this.error.set('');
    this.bookingMessage.set('');

    this.appointmentService.bookAppointment({
      patientId: 1,
      doctorId: doctor.id,
      slotId: slot.id,
      notes: 'First consultation'
    }).subscribe({
      next: (appointment) => {
        this.isBooking.set(false);

        this.bookingMessage.set(
          `Appointment booked successfully. Appointment ID: ${appointment.id}`
        );

        this.selectedSlot.set(null);

        this.loadDoctor();
      },

      error: (err) => {
        console.error(err);

        this.isBooking.set(false);

        if (err.status === 409) {
          this.error.set(
            'This slot is already booked. Please choose another slot.'
          );
        } else {
          this.error.set(
            'Unable to book appointment. Please try again.'
          );
        }
      }
    });
  }
}