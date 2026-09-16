import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalHistoryResponse } from '../models/medical-history';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PatientInfo } from '../models/patient';

export interface UpdatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class Patient {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/patients';


  // =====================================================
  // GET ALL PATIENTS
  // =====================================================

  getAllPatients(): Observable<PatientInfo[]> {

    return this.http.get<PatientInfo[]>(
      this.apiUrl,
      {
        withCredentials: true
      }
    );
  }


  // =====================================================
  // GET PATIENT INFORMATION
  // =====================================================

  getPatientInfo(
    patientId: number
  ): Observable<PatientInfo> {

    return this.http.get<PatientInfo>(
      `${this.apiUrl}/${patientId}`,
      {
        withCredentials: true
      }
    );
  }


  // =====================================================
  // UPDATE PATIENT INFORMATION
  // =====================================================

  updatePatientInfo(
    patientId: number,
    request: UpdatePatientRequest
  ): Observable<PatientInfo> {

    return this.http.put<PatientInfo>(
      `${this.apiUrl}/${patientId}`,
      request,
      {
        withCredentials: true
      }
    );
  }


  // =====================================================
  // GET MEDICAL HISTORY
  // =====================================================

  getMedicalHistory(
    patientId: number,
    doctorId?: number
  ): Observable<MedicalHistoryResponse> {

    let params = new HttpParams();

    if (doctorId !== undefined) {

      params = params.set(
        'doctorId',
        doctorId.toString()
      );

    }

    return this.http.get<MedicalHistoryResponse>(
      `${this.apiUrl}/${patientId}/medical-history`,
      {
        params,
        withCredentials: true
      }
    );
  }


  // =====================================================
  // SEARCH PATIENTS
  // =====================================================

  searchPatients(
    query: string
  ): Observable<PatientInfo[]> {

    const params = new HttpParams()
      .set('q', query);

    return this.http.get<PatientInfo[]>(
      `${this.apiUrl}/search`,
      {
        params,
        withCredentials: true
      }
    );
  }

}