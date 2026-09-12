import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReferralService } from '../../services/referral';
import { ReferralResponse } from '../../models/referral';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-referral-details',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './referral-details.html',
  styleUrl: './referral-details.css',
})
export class ReferralDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private referralService = inject(ReferralService);

  referral = signal<ReferralResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchReferral(id);
    } else {
      this.errorMessage.set('Referral ID is invalid.');
      this.isLoading.set(false);
    }
  }

  fetchReferral(id: number): void {
    this.isLoading.set(true);
    this.referralService.getReferralById(id).subscribe({
      next: (data) => {
        this.referral.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching referral details:', err);
        this.errorMessage.set('Failed to load referral details.');
        this.isLoading.set(false);
      },
    });
  }
}
