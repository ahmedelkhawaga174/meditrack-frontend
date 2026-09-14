import { TestBed } from '@angular/core/testing';
import { ReceptionistNavbar } from './receptionist-navbar';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth';

describe('ReceptionistNavbar', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistNavbar],
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
    const fixture = TestBed.createComponent(ReceptionistNavbar);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

});