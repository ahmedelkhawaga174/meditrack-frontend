import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReferral } from './pending-referral';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('PendingReferral', () => {
  let component: PendingReferral;
  let fixture: ComponentFixture<PendingReferral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingReferral],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingReferral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
