import { TestBed } from '@angular/core/testing';
import { ReceptionistLayout } from './receptionist-layout';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('ReceptionistLayout', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistLayout],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            logout: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReceptionistLayout);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});