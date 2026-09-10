import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingAppointments } from './upcoming-appointments';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UpcomingAppointments', () => {
  let component: UpcomingAppointments;
  let fixture: ComponentFixture<UpcomingAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingAppointments],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
