import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../services/appointment';
import { WaitingQueueService } from '../../services/waiting-queue';

import { Appointment } from '../../models/appointment';
import {
  QueueStatus,
  WaitingQueue
} from '../../models/waiting-queue';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.css'
})
export class ReceptionistDashboard implements OnInit {

  private appointmentService = inject(AppointmentService);
  private waitingQueueService = inject(WaitingQueueService);
  private cdr = inject(ChangeDetectorRef);

  appointments: Appointment[] = [];
  queue: WaitingQueue[] = [];

  appointmentId = '';

  loading = false;
  message = '';
  error = '';

  ngOnInit(): void {
    this.loadAppointments();
    this.loadQueue();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load appointments.';
        this.cdr.markForCheck();
      }
    });
  }

  loadQueue(): void {
    this.waitingQueueService.getQueue().subscribe({
      next: (queue) => {
        this.queue = queue;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load waiting queue.';
        this.cdr.markForCheck();
      }
    });
  }

  checkIn(appointment: Appointment): void {
    this.clearMessages();
    this.loading = true;

    this.appointmentService.checkInPatient(appointment.id).subscribe({
      next: (updatedAppointment) => {
        appointment.status = updatedAppointment.status;

        this.message =
          `Appointment #${appointment.id} checked in successfully.`;

        this.loading = false;

        this.loadAppointments();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          'Unable to check in the patient.';

        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addAppointmentToQueue(): void {
    this.clearMessages();

    const id = Number(this.appointmentId);

    if (!id) {
      this.error = 'Please enter a valid appointment ID.';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;

    this.waitingQueueService.addToQueue(id).subscribe({
      next: () => {
        this.appointmentId = '';

        this.message =
          `Appointment #${id} added to the waiting queue.`;

        this.loading = false;

        this.loadQueue();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          'Unable to add appointment to the queue.';

        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateQueueStatus(
    queueEntry: WaitingQueue,
    status: QueueStatus
  ): void {
    this.clearMessages();
    this.loading = true;

    this.waitingQueueService
      .updateStatus(queueEntry.id, status)
      .subscribe({
        next: (updatedEntry) => {
          this.message =
            `Queue #${queueEntry.id} updated to ${updatedEntry.status}.`;

          this.loading = false;

          this.loadQueue();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Unable to update queue status.';

          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  refresh(): void {
    this.clearMessages();
    this.loadAppointments();
    this.loadQueue();
  }

  clearMessages(): void {
    this.message = '';
    this.error = '';
  }
}
