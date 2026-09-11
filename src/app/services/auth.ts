import { Injectable } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  // REGISTER
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      request,
      { withCredentials: true }
    );
  }

  // VERIFY OTP
  verifyOtp(phone: string, otp: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/verify-otp`,
      {
        phone,
        otp
      },
      {
        responseType: 'text',
        withCredentials: true
      }
    );
  }

  // GET LOGGED-IN USER
  getUser(): LoginResponse | null {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as LoginResponse;
    } catch {
      return null;
    }
  }

  // CHECK LOGIN
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem(USER_KEY);
  }

  // SAVE USER DATA
  private saveSession(response: LoginResponse): void {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(response)
    );
  }
}