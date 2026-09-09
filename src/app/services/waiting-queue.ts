import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueueStatus, WaitingQueue } from '../models/waiting-queue';

@Injectable({
  providedIn: 'root'
})
export class WaitingQueueService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/waiting-queue';

  getQueue(): Observable<WaitingQueue[]> {
    return this.http.get<WaitingQueue[]>(this.apiUrl);
  }

  getQueueByStatus(status: QueueStatus): Observable<WaitingQueue[]> {
    return this.http.get<WaitingQueue[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  addToQueue(appointmentId: number): Observable<WaitingQueue> {
    return this.http.post<WaitingQueue>(
      `${this.apiUrl}/${appointmentId}`,
      {}
    );
  }

  updateStatus(
    queueId: number,
    status: QueueStatus
  ): Observable<WaitingQueue> {
    return this.http.patch<WaitingQueue>(
      `${this.apiUrl}/${queueId}/status`,
      { status }
    );
  }
}
