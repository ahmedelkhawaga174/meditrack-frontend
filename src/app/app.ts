import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorSearchComponent } from "./components/doctor-search/doctor-search";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DoctorSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meditrack-frontend');
}
