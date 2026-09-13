import { inject, Injectable } from '@angular/core';
import { ConsultationRequest, ConsultationResponse } from '../models/consultation-response-request';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiagnosisResponse, RecordDiagnosisRequest } from '../models/record-diagnoses';
import { NoteRequest, NoteResponse } from '../models/note-response-request';
import { PrescriptionRequest, PatientPrescriptionResponse } from '../models/prescription';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/consultations';

  recordConsultation(
    request: ConsultationRequest
  ): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(
      this.apiUrl,
      request
    );
  }

  getPatientPrescriptions(
    patientId: number
  ): Observable<PatientPrescriptionResponse[]> {
    return this.http.get<PatientPrescriptionResponse[]>(
      `http://localhost:8080/api/patients/${patientId}/prescription`
    );
  }

  recordDiagnosis(
    consultationId: number,
    request: RecordDiagnosisRequest
  ): Observable<DiagnosisResponse> {
    return this.http.post<DiagnosisResponse>(
      `${this.apiUrl}/${consultationId}/diagnoses`,
      request
    );
  }

  issuePrescription(
    consultationId: number,
    request: PrescriptionRequest
  ): Observable<PatientPrescriptionResponse> {
    return this.http.post<PatientPrescriptionResponse>(
      `${this.apiUrl}/${consultationId}/prescriptions`,
      request
    );
  }

  addNoteToConsultation(
    consultationId: number,
    request: NoteRequest
  ): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(
      `${this.apiUrl}/${consultationId}/notes`,
      request
    );
  }

  updateNote(
    consultationId: number,
    request: NoteRequest
  ): Observable<ConsultationResponse> {
    return this.http.put<ConsultationResponse>(
      `${this.apiUrl}/${consultationId}/notes`,
      request
    );
  }
}