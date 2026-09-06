import { TestBed } from '@angular/core/testing';

import { PatientAppointmentService } from './PatientAppointmentService';

describe('PatientAppointmentService', () => {
  let service: PatientAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
