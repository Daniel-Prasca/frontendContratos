import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, of } from 'rxjs';
import { UserDto, UserLoginDto, UserRegisterDto } from '../../core/interfaces/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private apiUrl = 'https://localhost:7178/api/auth';

  private userSubject = new BehaviorSubject<UserDto | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): UserDto | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 🔥 Nuevo método para sincronizar
  setUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getCurrentUser(): UserDto | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
