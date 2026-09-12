import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDetails } from './referral-details';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReferralDetails', () => {
  let component: ReferralDetails;
  let fixture: ComponentFixture<ReferralDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralDetails],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
