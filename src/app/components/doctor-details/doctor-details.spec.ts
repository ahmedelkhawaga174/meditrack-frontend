import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorDetails } from './doctor-details';
import { DoctorService } from '../../services/doctor';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('DoctorDetails', () => {

  let component: DoctorDetails;
  let fixture: ComponentFixture<DoctorDetails>;

  beforeEach(async () => {

    const spy = {
      getDoctorById: vi.fn().mockReturnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [DoctorDetails],
      providers: [
        {
          provide: DoctorService,
          useValue: spy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorDetails);

    fixture.componentRef.setInput('doctorId', 1);

    component = fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});