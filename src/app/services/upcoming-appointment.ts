import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ViewUpcomingAppointmentResponse } from '../models/view-upcoming';

@Injectable({
  providedIn: 'root',
})
export class UpcomingAppointmentsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/doctors';

  // Get upcoming appointments for a doctor
  getUpcomingAppointments(
    doctorId: number
  ): Observable<ViewUpcomingAppointmentResponse[]> {

    return this.http.get<ViewUpcomingAppointmentResponse[]>(
      `${this.apiUrl}/${doctorId}/appointments/upcoming`,
      {
        withCredentials: true
      }
    );
  }

  // Get today's schedule for a doctor
  getTodaySchedule(
    doctorId: number
  ): Observable<ViewUpcomingAppointmentResponse[]> {

    return this.http.get<ViewUpcomingAppointmentResponse[]>(
      `${this.apiUrl}/${doctorId}/appointments/today`,
      {
        withCredentials: true
      }
    );
  }
}