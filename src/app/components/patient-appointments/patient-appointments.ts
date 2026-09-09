import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientAppointment } from '../../models/patient-appointment';
import { PatientAppointmentService } from '../../services/PatientAppointmentService';
import { AppointmentService } from '../../services/appointment';
import { DoctorService } from '../../services/doctor';
import { SlotResponse } from '../../models/doctor';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css'
})
export class PatientAppointments {

  private patientAppointmentService = inject(PatientAppointmentService);
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);

  patientId = input.required<number>();

  upcoming = signal<PatientAppointment[]>([]);
  past = signal<PatientAppointment[]>([]);

  isLoading = signal(true);
  isCancelling = signal<number | null>(null);

  isRescheduling = signal<number | null>(null);
  isLoadingSlots = signal(false);

  selectedNewSlotId = signal<number | null>(null);
  availableSlots = signal<SlotResponse[]>([]);

  error = signal('');
  successMessage = signal('');

  activeTab = signal<'upcoming' | 'past'>('upcoming');

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.patientAppointmentService.getUpcoming(this.patientId()).subscribe({
      next: (data) => {
        this.upcoming.set(data);
        this.loadPastAppointments();
      },
      error: () => {
        this.error.set('Could not load upcoming appointments');
        this.isLoading.set(false);
      }
    });
  }

  private loadPastAppointments(): void {
    this.patientAppointmentService.getPast(this.patientId()).subscribe({
      next: (data) => {
        this.past.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Could not load past appointments');
        this.isLoading.set(false);
      }
    });
  }

  cancelAppointment(appointmentId: number): void {

    const confirmed = confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) {
      return;
    }

    this.isCancelling.set(appointmentId);
    this.error.set('');
    this.successMessage.set('');

    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        this.isCancelling.set(null);

        this.successMessage.set(
          'Appointment cancelled successfully.'
        );

        this.loadAppointments();
      },

      error: (err) => {
        console.error(err);

        this.isCancelling.set(null);

        this.error.set(
          'Unable to cancel appointment. Please try again.'
        );
      }
    });
  }

  startReschedule(appointmentId: number): void {

    this.isRescheduling.set(appointmentId);
    this.isLoadingSlots.set(true);

    this.selectedNewSlotId.set(null);
    this.availableSlots.set([]);

    this.error.set('');
    this.successMessage.set('');

    this.appointmentService.getAppointment(appointmentId).subscribe({
      next: (appointment) => {

        this.doctorService.getDoctorById(appointment.doctorId).subscribe({
          next: (doctor) => {
            this.availableSlots.set(doctor.availableSlots);
            this.isLoadingSlots.set(false);
          },

          error: (err) => {
            console.error(err);

            this.error.set(
              'Unable to load available slots.'
            );

            this.isLoadingSlots.set(false);
            this.isRescheduling.set(null);
          }
        });

      },

      error: (err) => {
        console.error(err);

        this.error.set(
          'Unable to load appointment details.'
        );

        this.isLoadingSlots.set(false);
        this.isRescheduling.set(null);
      }
    });
  }

  selectNewSlot(slotId: number): void {
    this.selectedNewSlotId.set(slotId);
  }

  confirmReschedule(appointmentId: number): void {

    const newSlotId = this.selectedNewSlotId();

    if (!newSlotId) {
      this.error.set('Please select a new slot.');
      return;
    }

    this.isLoadingSlots.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.appointmentService
      .rescheduleAppointment(appointmentId, newSlotId)
      .subscribe({
        next: () => {

          this.isLoadingSlots.set(false);
          this.isRescheduling.set(null);
          this.selectedNewSlotId.set(null);
          this.availableSlots.set([]);

          this.successMessage.set(
            'Appointment rescheduled successfully.'
          );

          this.loadAppointments();
        },

        error: (err) => {
          console.error(err);

          this.isLoadingSlots.set(false);

          if (err.status === 409) {
            this.error.set(
              'The selected slot is already booked.'
            );
          } else {
            this.error.set(
              'Unable to reschedule appointment. Please try again.'
            );
          }
        }
      });
  }

  cancelReschedule(): void {
    this.isRescheduling.set(null);
    this.selectedNewSlotId.set(null);
    this.availableSlots.set([]);
    this.isLoadingSlots.set(false);
  }

  statusClasses(status: string): string {
    const base = 'text-xs px-2.5 py-0.5 rounded-full font-semibold';

    switch (status) {
      case 'PENDING':
        return `${base} bg-yellow-100 text-yellow-800`;

      case 'CONFIRMED':
        return `${base} bg-blue-100 text-blue-800`;

      case 'COMPLETED':
        return `${base} bg-green-100 text-green-800`;

      case 'CANCELLED':
        return `${base} bg-red-100 text-red-800`;

      case 'NO_SHOW':
        return `${base} bg-gray-100 text-gray-800`;

      case 'CHECKED_IN':
        return `${base} bg-purple-100 text-purple-800`;

      default:
        return base;
    }
  }
}