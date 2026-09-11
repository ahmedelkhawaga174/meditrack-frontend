import { Component, inject, OnInit, signal } from '@angular/core';
import { DoctorPatientService } from '../../services/doctor-patient-service';
import { DoctorPatient } from '../../models/doctor-patient';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-patient',
  imports: [RouterLink, DatePipe],
  templateUrl: './doctor-patient.html',
  styleUrl: './doctor-patient.css',
})
export class DoctorPatientComponent implements OnInit {
  private doctorPatientService = inject(DoctorPatientService);
  private route = inject(ActivatedRoute);

  patients = signal<DoctorPatient[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  doctorId = signal<number>(0);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('doctorId');
      if (idParam) {
        this.doctorId.set(Number(idParam));
        this.loadPatients();
      }
    });
  }

  loadPatients(): void {
    this.isLoading.set(true);
    this.doctorPatientService.getDoctorPatients(this.doctorId()).subscribe({
      next: (data) => {
        this.patients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        this.errorMessage.set('Failed to load doctor patients list.');
        this.isLoading.set(false);
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }
}
