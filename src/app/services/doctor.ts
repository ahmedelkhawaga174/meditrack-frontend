import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorResponse } from '../models/doctor';
import { PendingReferralResponse } from '../models/pending-referral-reponse';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctors';

  getAvailableDoctors(departmentId?: number | null, date?: string | null): Observable<DoctorResponse[]> {
    let params = new HttpParams();

    if (departmentId) {
      params = params.set('department', departmentId.toString());
    }

    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<DoctorResponse[]>(this.apiUrl, { params });
  }

    getDoctorById(id: number): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`${this.apiUrl}/${id}`);
  }

  getPendingReferrals(doctorId: number = 1): Observable<PendingReferralResponse[]> {
    const params = new HttpParams().set('doctorId', doctorId.toString());
    return this.http.get<PendingReferralResponse[]>(`${this.apiUrl}/referrals/pending`, { params });
  }
}
