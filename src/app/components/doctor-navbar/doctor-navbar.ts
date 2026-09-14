import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-doctor-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './doctor-navbar.html',
  styleUrl: './doctor-navbar.css'
})
export class DoctorNavbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}