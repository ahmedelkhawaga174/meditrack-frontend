import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor';
import { DoctorResponse, DepartmentOption } from '../../models/doctor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-search.html',
  styleUrls: ['./doctor-search.css']
})
export class DoctorSearch implements OnInit {

  private doctorService = inject(DoctorService);
  private router = inject(Router);

  selectedDepartment = signal<number | null>(null);

  // API format: yyyy-MM-dd
  // Empty = show all doctors and upcoming available slots
  selectedDate = signal<string>('');

  doctors = signal<DoctorResponse[]>([]);
  isLoading = signal<boolean>(false);

  // Date picker
  showDatePicker = signal<boolean>(false);

  currentMonth = signal<Date>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
  );

  weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  departments = signal<DepartmentOption[]>([
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Pediatrics' },
    { id: 3, name: 'Neurology' }
  ]);

  ngOnInit(): void {
    this.searchDoctors();
  }

  // =====================================================
  // DATE PICKER
  // =====================================================

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  toggleDatePicker(): void {
    this.showDatePicker.update(value => !value);
  }

  currentMonthName(): string {
    return this.currentMonth().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }

  calendarDays(): Array<number | null> {
    const current = this.currentMonth();

    const firstDay = new Date(
      current.getFullYear(),
      current.getMonth(),
      1
    ).getDay();

    const daysInMonth = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      0
    ).getDate();

    const days: Array<number | null> = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  previousMonth(): void {
    const current = this.currentMonth();
    const today = new Date();

    const previous = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      1
    );

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Don't allow going before current month
    if (previous < currentMonthStart) {
      return;
    }

    this.currentMonth.set(previous);
  }

  nextMonth(): void {
    const current = this.currentMonth();

    this.currentMonth.set(
      new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1
      )
    );
  }

  isPastDate(day: number): boolean {
    const current = this.currentMonth();

    const selectedDay = new Date(
      current.getFullYear(),
      current.getMonth(),
      day
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDay.setHours(0, 0, 0, 0);

    return selectedDay < today;
  }

  isSelectedDate(day: number): boolean {
    const current = this.currentMonth();

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const dayValue = String(day).padStart(2, '0');

    const date = `${year}-${month}-${dayValue}`;

    return this.selectedDate() === date;
  }

  selectDate(day: number): void {
    if (this.isPastDate(day)) {
      return;
    }

    const current = this.currentMonth();

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const dayValue = String(day).padStart(2, '0');

    const date = `${year}-${month}-${dayValue}`;

    this.selectedDate.set(date);
    this.showDatePicker.set(false);
  }

  clearDate(): void {
    this.selectedDate.set('');
    this.showDatePicker.set(false);
  }

  formatDateForDisplay(date: string): string {
    if (!date) {
      return '';
    }

    const parts = date.split('-');

    if (parts.length !== 3) {
      return '';
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // =====================================================
  // FILTERS
  // =====================================================

  onDepartmentChange(value: number | null): void {
    this.selectedDepartment.set(value);
  }

  onDateChange(value: string): void {
    this.selectedDate.set(value);
  }

  searchDoctors(): void {
    this.isLoading.set(true);

    const departmentId = this.selectedDepartment();
    const date = this.selectedDate();

    this.doctorService
      .getAvailableDoctors(departmentId, date)
      .subscribe({
        next: (data) => {
          this.doctors.set(data);
          this.isLoading.set(false);
        },

        error: (err) => {
          console.error(
            'Error fetching available doctors:',
            err
          );

          this.doctors.set([]);
          this.isLoading.set(false);
        }
      });
  }

  resetFilters(): void {
    this.selectedDepartment.set(null);
    this.selectedDate.set('');
    this.showDatePicker.set(false);

    const today = new Date();

    this.currentMonth.set(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    this.searchDoctors();
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  viewDoctorDetails(doctorId: number): void {
    this.router.navigate([
      '/doctors',
      doctorId
    ]);
  }

  makeAppointment(doctorId: number): void {
    this.router.navigate([
      '/doctors',
      doctorId,
      'appointments'
    ]);
  }
}