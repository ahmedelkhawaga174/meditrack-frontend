import { TestBed } from '@angular/core/testing';

import { ReferralService } from './Referral';

describe('ReferralService', () => {
  let service: ReferralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
