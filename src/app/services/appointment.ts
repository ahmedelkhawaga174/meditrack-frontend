import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

export interface BookAppointmentRequest {
  patientId: number;
  doctorId: number;
  slotId: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/appointments';

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  bookAppointment(
    request: BookAppointmentRequest
  ): Observable<Appointment> {
    return this.http.post<Appointment>(
      this.apiUrl,
      request
    );
  }

  checkInPatient(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/check-in`,
      {}
    );
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }

  rescheduleAppointment(
    id: number,
    newSlotId: number
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/${id}/reschedule`,
      { newSlotId }
    );
  }
}