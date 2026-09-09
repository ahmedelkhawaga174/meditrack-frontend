import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, TOKEN_KEY, USER_KEY } from './auth';
import { LoginRequest, LoginResponse } from '../models/auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const credentials: LoginRequest = {
    username: 'admin',
    password: 'admin123'
  };

  const mockResponse: LoginResponse = {
    token: 'jwt-token-123',
    type: 'Bearer',
    id: 1,
    username: 'admin',
    email: 'admin@clinic.com'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send credentials to the login endpoint and store the session', () => {
    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);

    expect(localStorage.getItem(TOKEN_KEY)).toBe('jwt-token-123');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getUser()?.username).toBe('admin');
  });

  it('should not store a session when the response has no token', () => {
    service.login(credentials).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/login');
    req.flush({} as LoginResponse);

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return the stored token', () => {
    localStorage.setItem(TOKEN_KEY, 'stored-token');

    expect(service.getToken()).toBe('stored-token');
  });

  it('should return null user when nothing is stored', () => {
    expect(service.getUser()).toBeNull();
  });

  it('should return null user when stored data is corrupted', () => {
    localStorage.setItem(USER_KEY, '{invalid-json');

    expect(service.getUser()).toBeNull();
  });

  it('should clear the session on logout', () => {
    localStorage.setItem(TOKEN_KEY, 'jwt-token-123');
    localStorage.setItem(USER_KEY, JSON.stringify(mockResponse));

    service.logout();

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});
