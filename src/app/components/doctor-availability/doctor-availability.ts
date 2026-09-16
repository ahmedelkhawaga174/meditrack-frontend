import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  AvailabilitySlot,
  CreateAvailabilityRequest
} from '../../models/availability-slot';

import { AvailabilitySlotService } from '../../services/availability-slot';

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './doctor-availability.html',
  styleUrl: './doctor-availability.css'
})
export class DoctorAvailability implements OnInit {

  private route = inject(ActivatedRoute);
  private availabilityService = inject(AvailabilitySlotService);
  private cdr = inject(ChangeDetectorRef);

  doctorId!: number;

  date = '';
  startTime = '';
  endTime = '';
  slotDurationMinutes = 30;

  slots: AvailabilitySlot[] = [];

  isLoading = false;
  isCreating = false;

  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {

    const doctorId =
      this.route.parent?.snapshot.paramMap.get('doctorId');

    if (!doctorId) {
      this.errorMessage = 'Doctor ID not found.';
      return;
    }

    this.doctorId = Number(doctorId);

    this.loadAvailability();
  }

  // =====================================================
  // LOAD AVAILABILITY
  // =====================================================

  loadAvailability(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.availabilityService
      .getDoctorAvailability(this.doctorId)
      .subscribe({

        next: (response) => {

          this.slots = response;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to load availability slots.';

          this.cdr.detectChanges();
        }
      });
  }

  // =====================================================
  // CREATE AVAILABILITY
  // =====================================================

  createAvailability(): void {

    this.clearMessages();

    if (!this.date) {
      this.errorMessage = 'Please select a date.';
      return;
    }

    if (!this.startTime) {
      this.errorMessage = 'Please select a start time.';
      return;
    }

    if (!this.endTime) {
      this.errorMessage = 'Please select an end time.';
      return;
    }

    if (this.startTime >= this.endTime) {
      this.errorMessage =
        'Start time must be before end time.';
      return;
    }

    if (this.slotDurationMinutes <= 0) {
      this.errorMessage =
        'Slot duration must be greater than zero.';
      return;
    }

    const request: CreateAvailabilityRequest = {
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      slotDurationMinutes: this.slotDurationMinutes
    };

    this.isCreating = true;

    this.availabilityService
      .createAvailability(
        this.doctorId,
        request
      )
      .subscribe({

        next: (response) => {

          this.isCreating = false;

          this.successMessage =
            `${response.length} availability slot(s) created successfully.`;

          this.loadAvailability();

          this.startTime = '';
          this.endTime = '';

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isCreating = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to create availability slots.';

          this.cdr.detectChanges();
        }
      });
  }

  // =====================================================
  // DELETE SLOT
  // =====================================================

  deleteSlot(slot: AvailabilitySlot): void {

    this.clearMessages();

    if (slot.status !== 'AVAILABLE') {
      this.errorMessage =
        'Only available slots can be deleted.';
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)} slot?`
      );

    if (!confirmed) {
      return;
    }

    this.availabilityService
      .deleteSlot(
        this.doctorId,
        slot.id
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Availability slot deleted successfully.';

          this.loadAvailability();
        },

        error: (error) => {

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete availability slot.';

          this.cdr.detectChanges();
        }
      });
  }

  // =====================================================
  // HELPERS
  // =====================================================

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'AVAILABLE':
        return 'status-available';

      case 'BOOKED':
        return 'status-booked';

      case 'BLOCKED':
        return 'status-blocked';

      case 'CANCELLED':
        return 'status-cancelled';

      default:
        return '';
    }
  }
}