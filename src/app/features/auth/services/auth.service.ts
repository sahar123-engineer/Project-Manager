import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  /**
   * Login method - validates credentials
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Login attempt:', credentials);

    // Admin user
    if (credentials.email === 'saharkharrat15@gmail.com' && credentials.password === '123456') {
      const user = {
        email: credentials.email,
        name: 'Sahar Kharrat',
        role: 'admin' as const
      };
      this.currentUserSubject.next(user);
      return of({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: user,
        message: 'Connexion réussie!'
      }).pipe(delay(1000));
    } 
    // Regular user
    else if (credentials.email === 'user@gmail.com' && credentials.password === '123456') {
      const user = {
        email: credentials.email,
        name: 'Utilisateur',
        role: 'user' as const
      };
      this.currentUserSubject.next(user);
      return of({
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: user,
        message: 'Connexion réussie!'
      }).pipe(delay(1000));
    } 
    else {
      // Incorrect credentials
      return throwError(() => ({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })).pipe(delay(1000));
    }
  }

  /**
   * Logout method
   */
  logout(): void {
    this.currentUserSubject.next(null);
    // Clear session/token
    console.log('User logged out');
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  /**
   * Get current user role
   */
  getUserRole(): 'admin' | 'user' | null {
    return this.currentUserSubject.value?.role || null;
  }
}
