import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DoctorOption, ReferralRequest, ReferralResponse } from '../models/referral';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  createReferral(request: ReferralRequest): Observable<ReferralResponse> {
    return this.http.post<ReferralResponse>(`${this.baseUrl}/referrals`, request);
  }

  getDoctors(): Observable<DoctorOption[]> {
    return this.http.get<DoctorOption[]>(`${this.baseUrl}/doctors`);
  }

  getReferralById(id: number): Observable<ReferralResponse> {
    return this.http.get<ReferralResponse>(`${this.baseUrl}/referrals/${id}`);
  }
}
