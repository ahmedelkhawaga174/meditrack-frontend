import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VerifyOtp } from './verify-otp';

describe('VerifyOtp', () => {
  let component: VerifyOtp;
  let fixture: ComponentFixture<VerifyOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOtp],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ phone: '' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyOtp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});