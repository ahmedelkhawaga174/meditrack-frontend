import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReferralService } from '../../services/referral';
import { ReferralResponse } from '../../models/referral';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-referral',
  imports: [RouterLink, DatePipe],
  templateUrl: './pending-referral.html',
  styleUrl: './pending-referral.css',
})
export class PendingReferral implements OnInit {
  private route = inject(ActivatedRoute);
  private referralService = inject(ReferralService);

  pendingReferrals = signal<ReferralResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  actionMessage = signal<string | null>(null);
  doctorId = signal<number | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('doctorId');
      if (idParam) {
        this.doctorId.set(Number(idParam));
        this.loadPendingReferrals(this.doctorId()!);
      } else {
        this.errorMessage.set('Doctor ID is required to view pending referrals.');
        this.isLoading.set(false);
      }
    });
  }

  loadPendingReferrals(docId: number): void {
    this.isLoading.set(true);
    this.referralService.getPendingReferrals(docId).subscribe({
      next: (data) => {
        this.pendingReferrals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching pending referrals:', err);
        this.errorMessage.set('Failed to load pending referrals.');
        this.isLoading.set(false);
      },
    });
  }

  updateStatus(referralId: number, status: 'ACCEPTED' | 'REJECTED'): void {
    this.errorMessage.set(null);
    this.referralService.updateReferralStatus(referralId, status).subscribe({
      next: () => {
        this.actionMessage.set(`Referral #${referralId} status changed to ${status}.`);

        this.pendingReferrals.update((list) => list.filter((item) => item.id !== referralId));

        setTimeout(() => this.actionMessage.set(null), 3500);
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.errorMessage.set('Failed to update referral status. Please try again.');
      },
    });
  }
}
