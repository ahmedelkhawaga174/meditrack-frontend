import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  DoctorResponse,
  SlotResponse
} from '../../models/doctor';

import { DoctorService } from '../../services/doctor';
import { AppointmentService } from '../../services/appointment';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-make-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './make-appointment.html',
  styleUrl: './make-appointment.css'
})
export class MakeAppointment {

  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  doctorId = input.required<number>();

  doctor = signal<DoctorResponse | null>(null);

  selectedDate = signal<string | null>(null);
  selectedSlot = signal<SlotResponse | null>(null);

  isLoading = signal(true);
  isBooking = signal(false);

  error = signal('');
  success = signal('');

  ngOnInit(): void {
    this.loadDoctor();
  }

  loadDoctor(): void {

    this.isLoading.set(true);
    this.error.set('');

    this.doctorService.getDoctorById(this.doctorId()).subscribe({

      next: (data) => {

        this.doctor.set(data);

        if (data.availableSlots.length > 0) {
          this.selectedDate.set(
            data.availableSlots[0].date
          );
        }

        this.isLoading.set(false);
      },

      error: (err) => {

        console.error(err);

        this.error.set(
          'Unable to load available appointments.'
        );

        this.isLoading.set(false);
      }
    });
  }

  getAvailableDates(): string[] {

    const doctor = this.doctor();

    if (!doctor) {
      return [];
    }

    return [
      ...new Set(
        doctor.availableSlots.map(slot => slot.date)
      )
    ].sort();
  }

  getSlotsForSelectedDate(): SlotResponse[] {

    const doctor = this.doctor();
    const date = this.selectedDate();

    if (!doctor || !date) {
      return [];
    }

    return doctor.availableSlots.filter(
      slot => slot.date === date
    );
  }

  selectDate(date: string): void {

    this.selectedDate.set(date);

    this.selectedSlot.set(null);
    this.error.set('');
    this.success.set('');
  }

  selectSlot(slot: SlotResponse): void {

    this.selectedSlot.set(slot);

    this.error.set('');
    this.success.set('');
  }

  formatDate(date: string): string {

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  bookAppointment(): void {

    const doctor = this.doctor();
    const slot = this.selectedSlot();
    const user = this.authService.getUser();

    if (!doctor || !slot) {
      return;
    }

    if (!user || !user.patientId) {

      this.error.set(
        'Patient information not found. Please login again.'
      );

      return;
    }

    this.isBooking.set(true);
    this.error.set('');
    this.success.set('');

    this.appointmentService.bookAppointment({

      patientId: user.patientId,
      doctorId: doctor.id,
      slotId: slot.id,
      notes: 'First consultation'

    }).subscribe({

      next: () => {

        this.isBooking.set(false);

        this.router.navigate([
          '/patients',
          user.patientId,
          'appointments'
        ]);

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

  goBack(): void {

    this.router.navigate([
      '/doctors',
      this.doctorId()
    ]);
  }
}