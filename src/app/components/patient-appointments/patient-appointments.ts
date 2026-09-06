import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientAppointment } from '../../models/patient-appointment';
import {PatientAppointmentService} from '../../services/PatientAppointmentService';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css'
})
export class PatientAppointments {
  private appointmentService = inject(PatientAppointmentService);

  patientId = input.required<number>();

  upcoming = signal<PatientAppointment[]>([]);
  past = signal<PatientAppointment[]>([]);
  isLoading = signal(true);
  error = signal('');
  activeTab = signal<'upcoming' | 'past'>('upcoming');

  ngOnInit(): void {
    this.appointmentService.getUpcoming(this.patientId()).subscribe({
      next: (data) => this.upcoming.set(data),
      error: () => this.error.set('Could not load upcoming appointments')
    });

    this.appointmentService.getPast(this.patientId()).subscribe({
      next: (data: PatientAppointment[]) => {
        this.past.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Could not load past appointments');
        this.isLoading.set(false);
      },
    });
  }

  statusClasses(status: string): string {
    const base = 'text-xs px-2.5 py-0.5 rounded-full font-semibold';
    switch (status) {
      case 'PENDING': return `${base} bg-yellow-100 text-yellow-800`;
      case 'CONFIRMED': return `${base} bg-blue-100 text-blue-800`;
      case 'COMPLETED': return `${base} bg-green-100 text-green-800`;
      case 'CANCELLED': return `${base} bg-red-100 text-red-800`;
      case 'NO_SHOW': return `${base} bg-gray-100 text-gray-800`;
      default: return base;
    }
  }
}
