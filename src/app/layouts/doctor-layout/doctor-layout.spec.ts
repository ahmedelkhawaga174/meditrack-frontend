import { TestBed } from '@angular/core/testing';
import { DoctorLayout } from './doctor-layout';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('DoctorLayout', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorLayout],
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
    const fixture = TestBed.createComponent(DoctorLayout);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});