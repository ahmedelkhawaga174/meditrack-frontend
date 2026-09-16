import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ViewUpcomingAppointmentResponse } from '../../models/view-upcoming';
import { UpcomingAppointmentsService } from '../../services/upcoming-appointment';

@Component({
  selector: 'app-today-schedule',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './today-schedule.html',
  styleUrl: './today-schedule.css',
})
export class TodaySchedule implements OnInit {

  private appointmentsService = inject(UpcomingAppointmentsService);
  private route = inject(ActivatedRoute);

  appointments = signal<ViewUpcomingAppointmentResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  doctorId = signal<number | null>(null);

  ngOnInit(): void {

    const idFromRoute =
      this.route.parent?.snapshot.paramMap.get('doctorId');

    if (!idFromRoute) {
      this.errorMessage.set('Doctor ID was not found.');
      this.isLoading.set(false);
      return;
    }

    const parsedDoctorId = Number(idFromRoute);

    if (Number.isNaN(parsedDoctorId)) {
      this.errorMessage.set('Invalid doctor ID.');
      this.isLoading.set(false);
      return;
    }

    this.doctorId.set(parsedDoctorId);

    this.fetchTodaySchedule();
  }

  fetchTodaySchedule(): void {

    const id = this.doctorId();

    if (!id) {
      this.errorMessage.set('Doctor ID is missing.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.appointmentsService
      .getTodaySchedule(id)
      .subscribe({

        next: (data) => {

          this.appointments.set(data);
          this.isLoading.set(false);

        },

        error: (err) => {

          console.error(
            'Error fetching today schedule:',
            err
          );

          this.errorMessage.set(
            'Failed to load today schedule. Please try again later.'
          );

          this.isLoading.set(false);
        }

      });
  }
}