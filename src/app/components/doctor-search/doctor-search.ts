import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor';
import { DoctorResponse, DepartmentOption } from '../../models/doctor';

@Component({
  selector: 'app-doctor-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-search.html',
  styleUrls: ['./doctor-search.css']
})
export class DoctorSearchComponent implements OnInit {
  private doctorService = inject(DoctorService);

  selectedDepartment = signal<number | null>(null);
  selectedDate = signal<string>('');

  doctors = signal<DoctorResponse[]>([]);
  isLoading = signal<boolean>(false);

  departments = signal<DepartmentOption[]>([
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Pediatrics' },
    { id: 3, name: 'Neurology' }
  ]);

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate.set(today);
    this.searchDoctors();
  }

  searchDoctors(): void {
    this.isLoading.set(true);

    const dept = this.selectedDepartment();
    const date = this.selectedDate();

    this.doctorService.getAvailableDoctors(dept, date).subscribe({
      next: (data) => {
        this.doctors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching available doctors:', err);
        this.doctors.set([]);
        this.isLoading.set(false);
      }
    });
  }

  resetFilters(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectedDepartment.set(null);
    this.selectedDate.set(today);
    this.searchDoctors();
  }
}
