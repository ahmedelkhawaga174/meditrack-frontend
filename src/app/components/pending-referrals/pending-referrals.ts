import { Component, inject, OnInit, signal } from '@angular/core';
import { DoctorService } from '../../services/doctor';
import { PendingReferralResponse } from '../../models/pending-referral-reponse';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-referrals',
  imports: [CommonModule, DatePipe],
  templateUrl: './pending-referrals.html',
  styleUrl: './pending-referrals.css',
})
export class PendingReferrals implements OnInit {

  private doctorService = inject(DoctorService);

  referrals = signal<PendingReferralResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPendingReferrals();
  }

  loadPendingReferrals(doctorId: number = 1): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.doctorService.getPendingReferrals(doctorId).subscribe({
      next: (data) => {
        this.referrals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching referrals:', err);
        this.errorMessage.set('حدث خطأ أثناء تحميل التحويلات المعلقة.');
        this.isLoading.set(false);
      }
    });
  }
}
