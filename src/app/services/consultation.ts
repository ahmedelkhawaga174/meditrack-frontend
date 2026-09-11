import { inject, Injectable } from '@angular/core';
import { ConsultationRequest, ConsultationResponse } from '../models/consultation-response-request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiagnosisResponse, RecordDiagnosisRequest } from '../models/record-diagnoses';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/consultations';

  recordConsultation(request: ConsultationRequest): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(this.apiUrl, request);
  }

  recordDiagnosis(consultationId: number, request: RecordDiagnosisRequest): Observable<DiagnosisResponse> {
    return this.http.post<DiagnosisResponse>(`${this.apiUrl}/${consultationId}/diagnoses`, request);
  }
}
