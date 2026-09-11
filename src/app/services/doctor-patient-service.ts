import { inject, Injectable } from '@angular/core';
import { DoctorPatient } from '../models/doctor-patient';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DoctorPatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctors';

  getDoctorPatients(doctorId: number): Observable<DoctorPatient[]> {
    return this.http.get<DoctorPatient[]>(`${this.apiUrl}/${doctorId}/patients`);
  }
}
