import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PatientMedicalHistory } from './patient-medical-history';

describe('PatientMedicalHistory', () => {
  let component: PatientMedicalHistory;
  let fixture: ComponentFixture<PatientMedicalHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMedicalHistory],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientMedicalHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
