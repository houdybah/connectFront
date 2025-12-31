import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

const TOKEN_KEY = 'dConnect'; // Nom du sessionStorage pour le token crypté
const USER_KEY = 'currentUser';
const USER_ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private encryptionService: EncryptionService) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  /**
   * Sauvegarde le token de manière cryptée dans sessionStorage sous la clé 'dConnect'
   * @param token Le token JWT à sauvegarder
   */
  public saveToken(token: string): void {
    try {
      window.sessionStorage.removeItem(TOKEN_KEY);
      const encryptedToken = this.encryptionService.encrypt(token);
      window.sessionStorage.setItem(TOKEN_KEY, encryptedToken);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
      throw error;
    }
  }

  /**
   * Récupère et décrypte le token depuis sessionStorage
   * @returns Le token décrypté ou null
   */
  public getToken(): string | null {
    try {
      const encryptedToken = sessionStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) {
        return null;
      }
      return this.encryptionService.decrypt(encryptedToken);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  /**
   * Extrait l'UUID de l'utilisateur depuis le token (champ jti)
   * @returns L'UUID de l'utilisateur ou null
   */
  public getUserUuid(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return this.encryptionService.extractUserUuid(token);
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
