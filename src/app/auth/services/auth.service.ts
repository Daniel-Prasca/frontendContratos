import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {
  UserDto,
  UserLoginDto,
  UserRegisterDto,
  AuthResponse,
} from '../../core/interfaces/auth.models';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<UserDto | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {}

  private getStoredUser(): UserDto | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  login(credentials: UserLoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.loggedInSubject.next(true);

        // 🔥 sincronizamos con AuthStateService
        this.authState.setUser(response.user);
      })
    );
  }

  register(data: UserRegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  logout(): void {
    this.clearStorage();
    this.loggedInSubject.next(false);
    this.userSubject.next(null);

    // 🔥 sincronizamos logout
    this.authState.logout();
  }

  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): UserDto | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private clearStorage(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

