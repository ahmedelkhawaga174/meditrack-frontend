import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewUpcomingAppointmentResponse } from '../models/view-upcoming';

@Injectable({
  providedIn: 'root',
})
export class UpcomingAppointmentService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctors';

  getUpcomingAppointments(doctorId: number): Observable<ViewUpcomingAppointmentResponse[]> {
    return this.http.get<ViewUpcomingAppointmentResponse[]>(`${this.apiUrl}/${doctorId}/appointments/upcoming`);
  }
}
