import { TestBed } from '@angular/core/testing';
import { PatientLayout } from './patient-layout';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('PatientLayout', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLayout],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getUser: () => ({
              userId: 1,
              patientId: 1,
              role: 'PATIENT'
            }),
            logout: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PatientLayout);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});