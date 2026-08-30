import { Component, signal } from '@angular/core';
import { DoctorSearch } from "./components/doctor-search/doctor-search";

@Component({
  selector: 'app-root',
  imports: [ DoctorSearch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meditrack-frontend');
}
