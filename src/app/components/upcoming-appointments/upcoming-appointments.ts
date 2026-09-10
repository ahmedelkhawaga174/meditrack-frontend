import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ViewUpcomingAppointmentResponse } from '../../models/view-upcoming';
import { UpcomingAppointmentsService } from '../../services/upcoming-appointment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcoming-appointments',
  imports: [DatePipe, RouterLink],
  templateUrl: './upcoming-appointments.html',
  styleUrl: './upcoming-appointments.css',
})
export class UpcomingAppointments implements OnInit {
  private appointmentsService = inject(UpcomingAppointmentsService);
  private route = inject(ActivatedRoute);

  appointments = signal<ViewUpcomingAppointmentResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  doctorId = signal<number>(1);

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('doctorId');
    if (idFromRoute) {
      this.doctorId.set(Number(idFromRoute));
    }
    this.fetchUpcomingAppointments();
  }

  fetchUpcomingAppointments(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService.getUpcomingAppointments(this.doctorId()).subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching upcoming appointments:', err);
        this.errorMessage.set('Failed to load upcoming appointments. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }
}
