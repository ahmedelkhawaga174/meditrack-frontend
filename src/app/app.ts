import { Component, signal } from '@angular/core';
import { DoctorSearch } from "./components/doctor-search/doctor-search";
import { DoctorDetails } from "./components/doctor-details/doctor-details";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
    standalone: true,
  imports: [DoctorSearch, DoctorDetails, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meditrack-frontend');
}
