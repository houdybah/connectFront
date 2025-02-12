import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';
const USER_ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public saveRole(role: any): void {
    window.sessionStorage.removeItem(role);
    window.sessionStorage.setItem('role', JSON.stringify(role));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);    
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getRole(): any {
    const user = window.sessionStorage.getItem(USER_ROLE);    
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
