import { TestBed } from '@angular/core/testing';
import { PatientNavbar } from './patient-navbar';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('PatientNavbar', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientNavbar],
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
    const fixture = TestBed.createComponent(PatientNavbar);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});