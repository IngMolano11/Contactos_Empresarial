import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
}

interface UserData {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.authUrl;
  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userSubject.next(JSON.parse(userData));
    }
  }

  signup(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/signup`, credentials);
    // Removemos el tap() para que no guarde los datos automáticamente
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        const userData: UserData = {
          token: response.access_token,
          username: response.username
        };
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        this.userSubject.next(userData);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
