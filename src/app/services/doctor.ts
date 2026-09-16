import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DoctorResponse } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/doctors';


  // =====================================================
  // GET AVAILABLE DOCTORS
  // =====================================================

  getAvailableDoctors(
    departmentId?: number | null,
    date?: string | null
  ): Observable<DoctorResponse[]> {

    let params = new HttpParams();

    if (departmentId) {
      params = params.set(
        'department',
        departmentId.toString()
      );
    }

    if (date) {
      params = params.set(
        'date',
        date
      );
    }

    return this.http.get<DoctorResponse[]>(
      this.apiUrl,
      {
        params,
        withCredentials: true
      }
    );
  }


  // =====================================================
  // GET DOCTOR BY ID
  // =====================================================

  getDoctorById(
    id: number
  ): Observable<DoctorResponse> {

    return this.http.get<DoctorResponse>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );
  }
}