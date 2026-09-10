import { TestBed } from '@angular/core/testing';

import { UpcomingAppointmentsService } from './upcoming-appointment';

describe('UpcomingAppointment', () => {
  let service: UpcomingAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpcomingAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
