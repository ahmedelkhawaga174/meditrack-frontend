import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReferrals } from './pending-referrals';

describe('PendingReferrals', () => {
  let component: PendingReferrals;
  let fixture: ComponentFixture<PendingReferrals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingReferrals],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingReferrals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
