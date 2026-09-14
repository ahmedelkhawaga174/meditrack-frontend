import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalHistoryResponse } from '../models/medical-history';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PatientInfo } from '../models/patient';

@Injectable({
  providedIn: 'root',
})
export class Patient {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/patients';

  getMedicalHistory(patientId: number): Observable<MedicalHistoryResponse> {
    return this.http.get<MedicalHistoryResponse>(`${this.apiUrl}/${patientId}/medical-history`);
  }
  
    searchPatients(phone: string): Observable<PatientInfo[]> {

    const params = new HttpParams()
      .set('q', phone);

    return this.http.get<PatientInfo[]>(
      `${this.apiUrl}/search`,
      {
        params,
        withCredentials: true
      }
    );
  }
}
