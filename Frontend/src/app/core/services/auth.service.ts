import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private router:Router) { }

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  verifyOtp(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify`, { email, code });
  }
 
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Payload from JWT
  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token); 
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
