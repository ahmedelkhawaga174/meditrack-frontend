import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

import { PatientAppointment } from '../../models/patient-appointment';
import { PatientAppointmentService } from '../../services/PatientAppointmentService';
import { AppointmentService } from '../../services/appointment';
import { DoctorService } from '../../services/doctor';
import { SlotResponse } from '../../models/doctor';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css'
})
export class PatientAppointments {

  private patientAppointmentService = inject(PatientAppointmentService);
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private authService = inject(AuthService);

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

  isPatient(): boolean {
    return this.authService.getUser()?.role === 'PATIENT';
  }

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  loadAppointments(): void {

    this.isLoading.set(true);
    this.error.set('');

    this.patientAppointmentService
      .getUpcoming(this.patientId())
      .subscribe({

        next: (data) => {

          this.upcoming.set(data);

          this.loadPastAppointments();
        },

        error: (err) => {

          console.error('Error loading upcoming appointments:', err);

          this.error.set(
            'Could not load upcoming appointments.'
          );

          this.isLoading.set(false);
        }
      });
  }

  private loadPastAppointments(): void {

    this.patientAppointmentService
      .getPast(this.patientId())
      .subscribe({

        next: (data) => {

          this.past.set(data);

          this.isLoading.set(false);
        },

        error: (err) => {

          console.error('Error loading past appointments:', err);

          this.error.set(
            'Could not load past appointments.'
          );

          this.isLoading.set(false);
        }
      });
  }

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  cancelAppointment(appointmentId: number): void {

    Swal.fire({

      title: 'Cancel Appointment?',

      text: 'Are you sure you want to cancel this appointment?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Cancel It',

      cancelButtonText: 'Keep Appointment',

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#6b7280',

      reverseButtons: true,

      focusCancel: true

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      this.isCancelling.set(appointmentId);

      this.error.set('');
      this.successMessage.set('');

      this.appointmentService
        .cancelAppointment(appointmentId)
        .subscribe({

          // ==============================
          // CANCEL SUCCESS
          // ==============================

          next: () => {

            this.isCancelling.set(null);

            Swal.fire({

              icon: 'success',

              title: 'Appointment Cancelled!',

              text: 'Your appointment has been cancelled successfully.',

              confirmButtonText: 'OK',

              confirmButtonColor: '#2563eb',

              timer: 2500,

              timerProgressBar: true

            });

            this.loadAppointments();
          },

          // ==============================
          // CANCEL ERROR
          // ==============================

          error: (err) => {

            console.error(
              'Cancel appointment error:',
              err
            );

            this.isCancelling.set(null);

            Swal.fire({

              icon: 'error',

              title: 'Cancellation Failed',

              text:
                err?.error?.message ||
                'Unable to cancel the appointment. Please try again.',

              confirmButtonText: 'OK',

              confirmButtonColor: '#2563eb'
            });
          }
        });
    });
  }

  // ==========================================
  // START RESCHEDULE
  // ==========================================

  startReschedule(appointmentId: number): void {

    this.isRescheduling.set(appointmentId);

    this.isLoadingSlots.set(true);

    this.selectedNewSlotId.set(null);

    this.availableSlots.set([]);

    this.error.set('');
    this.successMessage.set('');

    this.appointmentService
      .getAppointment(appointmentId)
      .subscribe({

        next: (appointment) => {

          this.doctorService
            .getDoctorById(appointment.doctorId)
            .subscribe({

              next: (doctor) => {

                this.availableSlots.set(
                  doctor.availableSlots
                );

                this.isLoadingSlots.set(false);
              },

              error: (err) => {

                console.error(
                  'Error loading doctor slots:',
                  err
                );

                this.error.set(
                  'Unable to load available slots.'
                );

                this.isLoadingSlots.set(false);

                this.isRescheduling.set(null);
              }
            });
        },

        error: (err) => {

          console.error(
            'Error loading appointment:',
            err
          );

          this.error.set(
            'Unable to load appointment details.'
          );

          this.isLoadingSlots.set(false);

          this.isRescheduling.set(null);
        }
      });
  }

  // ==========================================
  // SELECT NEW SLOT
  // ==========================================

  selectNewSlot(slotId: number): void {

    this.selectedNewSlotId.set(slotId);

    this.error.set('');
  }

  // ==========================================
  // CONFIRM RESCHEDULE
  // ==========================================

  confirmReschedule(appointmentId: number): void {

    const newSlotId = this.selectedNewSlotId();

    if (!newSlotId) {

      Swal.fire({

        icon: 'warning',

        title: 'Select a Slot',

        text: 'Please select a new appointment slot first.',

        confirmButtonText: 'OK',

        confirmButtonColor: '#2563eb'
      });

      return;
    }

    // Confirmation before reschedule

    Swal.fire({

      title: 'Reschedule Appointment?',

      text: 'Do you want to move your appointment to the selected slot?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Yes, Reschedule',

      cancelButtonText: 'Go Back',

      confirmButtonColor: '#2563eb',

      cancelButtonColor: '#6b7280',

      reverseButtons: true

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      this.isLoadingSlots.set(true);

      this.error.set('');
      this.successMessage.set('');

      this.appointmentService
        .rescheduleAppointment(
          appointmentId,
          newSlotId
        )
        .subscribe({

          // ==============================
          // RESCHEDULE SUCCESS
          // ==============================

          next: () => {

            this.isLoadingSlots.set(false);

            this.isRescheduling.set(null);

            this.selectedNewSlotId.set(null);

            this.availableSlots.set([]);

            Swal.fire({

              icon: 'success',

              title: 'Appointment Rescheduled! 📅',

              text: 'Your appointment has been rescheduled successfully.',

              confirmButtonText: 'OK',

              confirmButtonColor: '#2563eb',

              timer: 2500,

              timerProgressBar: true
            });

            this.loadAppointments();
          },

          // ==============================
          // RESCHEDULE ERROR
          // ==============================

          error: (err) => {

            console.error(
              'Reschedule appointment error:',
              err
            );

            this.isLoadingSlots.set(false);

            if (err.status === 409) {

              Swal.fire({

                icon: 'warning',

                title: 'Slot Already Booked',

                text: 'The selected slot is no longer available. Please choose another slot.',

                confirmButtonText: 'Choose Another',

                confirmButtonColor: '#2563eb'
              });

            } else {

              Swal.fire({

                icon: 'error',

                title: 'Reschedule Failed',

                text:
                  err?.error?.message ||
                  'Unable to reschedule the appointment. Please try again.',

                confirmButtonText: 'OK',

                confirmButtonColor: '#2563eb'
              });
            }
          }
        });
    });
  }

  // ==========================================
  // CANCEL RESCHEDULE MODE
  // ==========================================

  cancelReschedule(): void {

    this.isRescheduling.set(null);

    this.selectedNewSlotId.set(null);

    this.availableSlots.set([]);

    this.isLoadingSlots.set(false);

    this.error.set('');
  }

  // ==========================================
  // STATUS COLORS
  // ==========================================

  statusClasses(status: string): string {

    const base =
      'text-xs px-2.5 py-0.5 rounded-full font-semibold';

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