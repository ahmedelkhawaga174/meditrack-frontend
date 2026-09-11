import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.apiUrl,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

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

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(response));

    if (response?.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }
  }
}