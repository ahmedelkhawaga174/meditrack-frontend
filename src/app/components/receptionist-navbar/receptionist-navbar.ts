import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-receptionist-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './receptionist-navbar.html',
  styleUrl: './receptionist-navbar.css',
})
export class ReceptionistNavbar {

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}