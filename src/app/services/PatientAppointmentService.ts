import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PatientAppointment} from '../models/patient-appointment';

@Injectable({
  providedIn: 'root',
})
export class PatientAppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/patients';

  getUpcoming(patientId: number): Observable<PatientAppointment[]> {
    return this.http.get<PatientAppointment[]>(`${this.baseUrl}/${patientId}/appointments/date`);
  }

  getPast(patientId: number): Observable<PatientAppointment[]> {
    return this.http.get<PatientAppointment[]>(`${this.baseUrl}/${patientId}/appointments/past`);
  }
}
