import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { TOKEN_KEY } from '../services/auth';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  const api = 'http://localhost:8080/doctors';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should attach the Bearer token to protected API requests', () => {
    localStorage.setItem(TOKEN_KEY, 'jwt-token-123');

    http.get(api).subscribe();

    const req = httpMock.expectOne(api);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token-123');
    req.flush({});
  });

  it('should NOT attach the token to the login request', () => {
    localStorage.setItem(TOKEN_KEY, 'jwt-token-123');

    http.post('http://localhost:8080/login', {}).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('should not attach a header when no token is stored', () => {
    http.get(api).subscribe();

    const req = httpMock.expectOne(api);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('should logout and redirect on 401 when logged in', () => {
    localStorage.setItem(TOKEN_KEY, 'expired-token');

    http.get(api).subscribe({
      error: () => {
        // expected failure
      }
    });

    const req = httpMock.expectOne(api);
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should rethrow the error to the caller', () => {
    localStorage.setItem(TOKEN_KEY, 'jwt-token-123');

    http.get(api).subscribe({
      error: (error) => expect(error.status).toBe(401)
    });

    const req = httpMock.expectOne(api);
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });
});
