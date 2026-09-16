import { Component, inject, OnInit, signal } from '@angular/core';
import { DoctorPatientService } from '../../services/doctor-patient-service';
import { DoctorPatient } from '../../models/doctor-patient';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-patient',
  imports: [RouterLink, DatePipe, FormsModule],
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

  searchTerm = signal<string>('');

  filteredPatients = signal<DoctorPatient[]>([]);

  ngOnInit(): void {

    const idParam =
      this.route.parent?.snapshot.paramMap.get('doctorId');

    if (!idParam) {
      this.errorMessage.set('Doctor ID is missing.');
      this.isLoading.set(false);
      return;
    }

    const parsedDoctorId = Number(idParam);

    if (parsedDoctorId <= 0) {
      this.errorMessage.set('Invalid doctor ID.');
      this.isLoading.set(false);
      return;
    }

    this.doctorId.set(parsedDoctorId);

    this.loadPatients();
  }

  loadPatients(): void {

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.doctorPatientService
      .getDoctorPatients(this.doctorId())
      .subscribe({

        next: (data) => {

          this.patients.set(data);

          this.filteredPatients.set(data);

          this.isLoading.set(false);
        },

        error: (err) => {

          console.error('Error fetching patients:', err);

          this.errorMessage.set(
            'Failed to load doctor patients list.'
          );

          this.isLoading.set(false);
        },

      });
  }

  onSearch(value: string): void {

    this.searchTerm.set(value);

    const search = value.trim().toLowerCase();

    if (!search) {
      this.filteredPatients.set(this.patients());
      return;
    }

    const filtered = this.patients().filter(patient => {

      const name =
        patient.patientName?.toLowerCase() ?? '';

      const phone =
        patient.patientPhone?.toLowerCase() ?? '';

      return (
        name.includes(search) ||
        phone.includes(search)
      );
    });

    this.filteredPatients.set(filtered);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.filteredPatients.set(this.patients());
  }
}