import { TestBed } from '@angular/core/testing';

import { ConsultationService } from './consultation';

describe('Consultation', () => {
  let service: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
