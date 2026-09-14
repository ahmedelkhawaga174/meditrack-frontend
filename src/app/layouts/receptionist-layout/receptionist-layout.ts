import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReceptionistNavbar } from '../../components/receptionist-navbar/receptionist-navbar';

@Component({
  selector: 'app-receptionist-layout',
  imports: [
    RouterOutlet,
    ReceptionistNavbar
  ],
  templateUrl: './receptionist-layout.html',
  styleUrl: './receptionist-layout.css',
})
export class ReceptionistLayout {}