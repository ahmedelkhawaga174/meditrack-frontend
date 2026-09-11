import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DoctorOption, ReferralRequest, ReferralResponse } from '../models/referral';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/referrals';
  private doctorsUrl = 'http://localhost:8080/api/doctors';

  createReferral(request: ReferralRequest): Observable<ReferralResponse> {
    return this.http.post<ReferralResponse>(this.apiUrl, request);
  }

  getDoctors(): Observable<DoctorOption[]> {
    return this.http.get<DoctorOption[]>(this.doctorsUrl);
  }
}
