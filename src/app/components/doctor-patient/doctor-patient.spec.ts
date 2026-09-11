import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPatientComponent } from './doctor-patient';

describe('DoctorPatientComponent', () => {
  let component: DoctorPatientComponent;
  let fixture: ComponentFixture<DoctorPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPatientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorPatientComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
