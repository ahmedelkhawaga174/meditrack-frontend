import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientNavbar } from '../../components/patient-navbar/patient-navbar';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, PatientNavbar],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.css'
})
export class PatientLayout {}