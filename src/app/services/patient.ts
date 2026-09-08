import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalHistoryResponse } from '../models/medical-history';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Patient {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/patients';

  getMedicalHistory(patientId: number): Observable<MedicalHistoryResponse> {
    return this.http.get<MedicalHistoryResponse>(`${this.apiUrl}/${patientId}/medical-history`);
  }
}
