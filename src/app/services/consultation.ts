import { inject, Injectable } from '@angular/core';
import { ConsultationRequest, ConsultationResponse } from '../models/consultation-response-request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Consultation {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/consultations';

  recordConsultation(request: ConsultationRequest): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(this.apiUrl, request);
  }
}
