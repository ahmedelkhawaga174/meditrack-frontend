import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AvailabilitySlot,
  CreateAvailabilityRequest
} from '../models/availability-slot';

@Injectable({
  providedIn: 'root'
})
export class AvailabilitySlotService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/doctors';

  createAvailability(
    doctorId: number,
    request: CreateAvailabilityRequest
  ): Observable<AvailabilitySlot[]> {

    return this.http.post<AvailabilitySlot[]>(
      `${this.apiUrl}/${doctorId}/availability`,
      request,
      { withCredentials: true }
    );
  }

  getDoctorAvailability(
    doctorId: number
  ): Observable<AvailabilitySlot[]> {

    return this.http.get<AvailabilitySlot[]>(
      `${this.apiUrl}/${doctorId}/availability`,
      { withCredentials: true }
    );
  }

  deleteSlot(
    doctorId: number,
    slotId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${doctorId}/availability/${slotId}`,
      { withCredentials: true }
    );
  }
}