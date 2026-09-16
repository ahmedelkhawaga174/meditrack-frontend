import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PatientAppointment } from '../../models/patient-appointment';
import { AppointmentService } from '../../services/appointment';
import { DoctorService } from '../../services/doctor';
import { DoctorResponse } from '../../models/doctor';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css'
})
export class AppointmentDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);

  appointment = signal<PatientAppointment | null>(null);
  doctor = signal<DoctorResponse | null>(null);

  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {

    const appointmentId = Number(
      this.route.snapshot.paramMap.get('appointmentId')
    );

    const appointmentFromState =
      history.state?.appointment as PatientAppointment | undefined;

    if (appointmentFromState) {

      this.appointment.set(appointmentFromState);

      this.loadDoctor(appointmentFromState);

      return;
    }

    if (!appointmentId) {

      this.error.set('Appointment ID was not provided.');
      this.isLoading.set(false);

      return;
    }

    this.loadAppointment(appointmentId);
  }

  private loadAppointment(appointmentId: number): void {

    this.isLoading.set(true);
    this.error.set('');

    this.appointmentService
      .getAppointment(appointmentId)
      .subscribe({

        next: (data: any) => {

          /*
           * The backend appointment response contains
           * doctorId, status, notes, etc.
           *
           * We build the minimum display object here.
           */

          const appointment: PatientAppointment = {
            appointmentId: data.id,
            doctorName: `Doctor #${data.doctorId}`,
            specialization: '',
            departmentName: '',
            date: data.date ?? '',
            startTime: data.startTime ?? '',
            endTime: data.endTime ?? '',
            status: data.status,
            notes: data.notes ?? ''
          };

          this.appointment.set(appointment);

          this.loadDoctor(appointment);
        },

        error: (err) => {

          console.error(
            'Error loading appointment:',
            err
          );

          this.error.set(
            'Unable to load appointment details.'
          );

          this.isLoading.set(false);
        }
      });
  }

  private loadDoctor(
    appointment: PatientAppointment
  ): void {

    /*
     * When navigating from My Appointments,
     * PatientAppointment gives us the doctor name,
     * but we need the doctorId to load full doctor information.
     *
     * If the state already contains all display data,
     * we simply stop loading.
     */

    const anyAppointment = appointment as any;

    if (!anyAppointment.doctorId) {

      this.isLoading.set(false);

      return;
    }

    this.doctorService
      .getDoctorById(anyAppointment.doctorId)
      .subscribe({

        next: (doctor) => {

          this.doctor.set(doctor);
          this.isLoading.set(false);
        },

        error: (err) => {

          console.error(
            'Error loading doctor:',
            err
          );

          /*
           * Appointment itself is still usable,
           * so don't show a complete error page.
           */

          this.isLoading.set(false);
        }
      });
  }

  statusClasses(status: string): string {

    const base =
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold';

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
        return `${base} bg-gray-100 text-gray-700`;
    }
  }

  goBack(): void {

    this.router.navigate([
      '/patients',
      this.route.snapshot.paramMap.get('patientId'),
      'appointments'
    ]);
  }
}