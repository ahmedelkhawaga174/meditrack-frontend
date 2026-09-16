import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ReferralService } from '../../services/referral';
import { ReferralResponse } from '../../models/referral';


@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals implements OnInit {

  private route = inject(ActivatedRoute);
  private referralService = inject(ReferralService);


  doctorId =
    signal<number | null>(null);


  activeTab =
    signal<
      'PENDING' |
      'HISTORY' |
      'SENT'
    >('PENDING');


  pendingReferrals =
    signal<ReferralResponse[]>([]);


  historyReferrals =
    signal<ReferralResponse[]>([]);


  sentReferrals =
    signal<ReferralResponse[]>([]);


  isLoading =
    signal<boolean>(true);


  errorMessage =
    signal<string | null>(null);


  actionMessage =
    signal<string | null>(null);


  ngOnInit(): void {

    const idParam =
      this.route.parent?.snapshot.paramMap.get(
        'doctorId'
      );


    if (!idParam) {

      this.errorMessage.set(
        'Doctor ID is required.'
      );

      this.isLoading.set(false);

      return;
    }


    const id = Number(idParam);


    if (Number.isNaN(id)) {

      this.errorMessage.set(
        'Invalid Doctor ID.'
      );

      this.isLoading.set(false);

      return;
    }


    this.doctorId.set(id);

    this.loadReferrals(id);
  }


  // =====================================================
  // TAB
  // =====================================================

  setTab(
    tab: 'PENDING' |
         'HISTORY' |
         'SENT'
  ): void {

    this.activeTab.set(tab);
  }


  // =====================================================
  // LOAD ALL REFERRALS
  // =====================================================

  loadReferrals(
    doctorId: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set(null);


    this.referralService
      .getPendingReferrals(doctorId)
      .subscribe({

        next: (data) => {

          this.pendingReferrals.set(data);

          this.loadHistory(doctorId);
        },


        error: (err) => {

          console.error(
            'Error loading pending referrals:',
            err
          );

          this.errorMessage.set(
            'Failed to load referrals.'
          );

          this.isLoading.set(false);
        },

      });
  }


  // =====================================================
  // LOAD HISTORY
  // =====================================================

  loadHistory(
    doctorId: number
  ): void {

    this.referralService
      .getReferralHistory(doctorId)
      .subscribe({

        next: (data) => {

          this.historyReferrals.set(data);

          this.loadSentReferrals(
            doctorId
          );
        },


        error: (err) => {

          console.error(
            'Error loading referral history:',
            err
          );

          this.errorMessage.set(
            'Failed to load referral history.'
          );

          this.isLoading.set(false);
        },

      });
  }


  // =====================================================
  // LOAD SENT REFERRALS
  // =====================================================

  loadSentReferrals(
    doctorId: number
  ): void {

    this.referralService
      .getSentReferrals(doctorId)
      .subscribe({

        next: (data) => {

          this.sentReferrals.set(data);

          this.isLoading.set(false);
        },


        error: (err) => {

          console.error(
            'Error loading sent referrals:',
            err
          );

          this.errorMessage.set(
            'Failed to load sent referrals.'
          );

          this.isLoading.set(false);
        },

      });
  }


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  updateStatus(
    referralId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): void {

    this.errorMessage.set(null);

    this.actionMessage.set(null);


    this.referralService
      .updateReferralStatus(
        referralId,
        status
      )
      .subscribe({

        next: () => {

          this.actionMessage.set(
            `Referral #${referralId} ${status.toLowerCase()} successfully.`
          );


          this.loadReferrals(
            this.doctorId()!
          );


          setTimeout(() => {

            this.actionMessage.set(null);

          }, 3500);
        },


        error: (err) => {

          console.error(
            'Error updating referral:',
            err
          );

          this.errorMessage.set(
            'Failed to update referral status.'
          );
        },

      });
  }
}