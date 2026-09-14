import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-patient-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './patient-navbar.html',
  styleUrl: './patient-navbar.css'
})
export class PatientNavbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  get patientId(): number | null {
    return this.authService.getUser()?.patientId ?? null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}