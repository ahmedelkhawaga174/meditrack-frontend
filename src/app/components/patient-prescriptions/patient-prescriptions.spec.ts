import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PatientPrescriptions } from './patient-prescriptions';

describe('PatientPrescriptions', () => {
  let component: PatientPrescriptions;
  let fixture: ComponentFixture<PatientPrescriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPrescriptions],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientPrescriptions);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});