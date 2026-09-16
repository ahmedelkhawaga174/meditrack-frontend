import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { ReferralService } from '../../services/referral';
import {
  DoctorOption,
  ReferralRequest
} from '../../models/referral';

@Component({
  selector: 'app-referral',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './referral.html',
  styleUrl: './referral.css',
})
export class Referral implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private referralService = inject(ReferralService);

  referralForm!: FormGroup;

  appointmentId =
    signal<number | null>(null);

  doctorId =
    signal<number | null>(null);

  doctors =
    signal<DoctorOption[]>([]);

  isSubmitting =
    signal<boolean>(false);

  errorMessage =
    signal<string | null>(null);

  successMessage =
    signal<string | null>(null);


  ngOnInit(): void {

    // ============================
    // Get Doctor ID
    // ============================

    const doctorIdParam =
      this.route.parent?.snapshot.paramMap.get(
        'doctorId'
      );

    if (doctorIdParam) {

      this.doctorId.set(
        Number(doctorIdParam)
      );
    }


    // ============================
    // Get Appointment ID
    // ============================

    const appointmentIdParam =
      this.route.snapshot.paramMap.get(
        'appointmentId'
      );

    if (appointmentIdParam) {

      this.appointmentId.set(
        Number(appointmentIdParam)
      );
    }


    // ============================
    // Referral Form
    // ============================

    this.referralForm =
      this.fb.group({

        referredToDoctorId: [
          '',
          [Validators.required]
        ],

        referralReason: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ],

      });


    // ============================
    // Load Doctors
    // ============================

    this.loadDoctors();
  }


  loadDoctors(): void {

    this.referralService
      .getDoctors()
      .subscribe({

        next: (data) => {

          this.doctors.set(data);
        },

        error: () => {

          this.errorMessage.set(
            'Failed to load doctors list.'
          );
        },

      });
  }


  // ============================
  // Create Referral
  // ============================

  onSubmit(): void {

    if (
      this.referralForm.invalid ||
      !this.appointmentId()
    ) {

      this.referralForm.markAllAsTouched();

      return;
    }


    this.isSubmitting.set(true);

    this.errorMessage.set(null);


    const payload: ReferralRequest = {

      appointmentId:
        this.appointmentId()!,

      referredToDoctorId:
        Number(
          this.referralForm.value
            .referredToDoctorId
        ),

      referralReason:
        this.referralForm.value
          .referralReason
          .trim(),

    };


    this.referralService
      .createReferral(payload)
      .subscribe({

        next: (createdReferral) => {

          this.isSubmitting.set(false);

          this.successMessage.set(
            'Referral submitted successfully!'
          );


          /*
           * Navigate to the doctor's referral
           * details page using the correct route.
           */
          setTimeout(() => {

            const currentDoctorId =
              this.doctorId();


            if (
              currentDoctorId &&
              createdReferral?.id
            ) {

              this.router.navigate([
                '/doctor',
                currentDoctorId,
                'referrals',
                createdReferral.id
              ]);

            }

          }, 1200);
        },


        error: (err) => {

          console.error(
            'Error creating referral:',
            err
          );

          this.isSubmitting.set(false);

          this.errorMessage.set(
            err.error?.message ||
            'Failed to submit referral.'
          );
        },

      });
  }
}