import { TestBed } from '@angular/core/testing';
import { DoctorNavbar } from './doctor-navbar';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('DoctorNavbar', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorNavbar],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getUser: () => ({
              userId: 1,
              role: 'DOCTOR'
            }),
            logout: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DoctorNavbar);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});