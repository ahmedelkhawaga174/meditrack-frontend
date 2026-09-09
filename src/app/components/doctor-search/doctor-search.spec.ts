import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorSearch } from './doctor-search';
import { DoctorService } from '../../services/doctor';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi, Mocked } from 'vitest';

describe('DoctorSearch', () => {
  let component: DoctorSearch;
  let fixture: ComponentFixture<DoctorSearch>;
  let doctorServiceSpy: Mocked<DoctorService>;

  beforeEach(async () => {
    const spy = {
      getAvailableDoctors: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [DoctorSearch],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DoctorService, useValue: spy }
      ]
    }).compileComponents();

    doctorServiceSpy = TestBed.inject(DoctorService) as Mocked<DoctorService>;

    fixture = TestBed.createComponent(DoctorSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
