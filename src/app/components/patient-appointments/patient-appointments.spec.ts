import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PatientAppointments } from './patient-appointments';

describe('PatientAppointments', () => {
  let component: PatientAppointments;
  let fixture: ComponentFixture<PatientAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAppointments],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientAppointments);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('patientId', 1);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});