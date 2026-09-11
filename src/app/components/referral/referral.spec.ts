import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Referral } from './referral';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('Referral', () => {
  let component: Referral;
  let fixture: ComponentFixture<Referral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Referral],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Referral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
