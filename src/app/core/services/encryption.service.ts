import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Clé de cryptage depuis le fichier d'environnement
  private readonly SECRET_KEY = environment.encryptionSecretKey;

  constructor() { }

  /**
   * Crypte une chaîne de caractères avec AES-256
   * @param data La donnée à crypter
   * @returns La donnée cryptée en base64
   */
  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Erreur lors du cryptage:', error);
      throw error;
    }
  }

  /**
   * Décrypte une chaîne de caractères cryptée avec AES-256
   * @param encryptedData La donnée cryptée
   * @returns La donnée décryptée
   */
  decrypt(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erreur lors du décryptage:', error);
      throw error;
    }
  }

  /**
   * Décode un JWT et retourne le payload
   * @param token Le token JWT
   * @returns Le payload décodé
   */
  public decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  /**
   * Extrait l'UUID de l'utilisateur depuis le token JWT (champ jti)
   * @param token Le token JWT
   * @returns L'UUID de l'utilisateur ou null
   */
  extractUserUuid(token: string): string | null {
    try {
      const payload = this.decodeJWT(token);
      console.log('Payload du token JWT:', payload);
      console.log('Champ jti:', payload?.jti);
      return payload?.jti || null;
    } catch (error) {
      console.error('Erreur lors de l\'extraction de l\'UUID:', error);
      return null;
    }
  }
}

