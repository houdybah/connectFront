import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Clé de cryptage depuis le fichier d'environnement (stockage navigateur)
  private readonly SECRET_KEY = environment.encryptionSecretKey;
  // Clé partagée avec le backend pour déchiffrer les tokens émis par DouaneConnect
  private readonly SERVER_TOKEN_SECRET = environment.serverTokenSecret;

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
   * Déchiffre un token émis par DouaneConnect (AES-256-GCM), au même format que
   * `TokenEncryptionUtil` côté backend : base64(IV[12 octets] + ciphertext+tag[16 octets]),
   * clé dérivée par SHA-256 du secret partagé `environment.serverTokenSecret`.
   * A appeler avant toute lecture des claims d'un token reçu de DouaneConnect
   * (ex: rôle, profils) puisque ce token circule toujours sous forme chiffrée.
   *
   * Implémenté en JS pur (node-forge) plutôt qu'avec l'API Web Crypto (`crypto.subtle`) :
   * cette dernière n'est disponible que dans un contexte sécurisé (HTTPS ou localhost) et
   * serait `undefined` si l'application est servie en HTTP simple, ce qui casserait le
   * déchiffrement du token en production tant que le HTTPS n'est pas configuré partout.
   * @param encryptedToken Le token chiffré (tel que retourné par /authenticate)
   * @returns Le JWT en clair
   */
  public async decryptServerToken(encryptedToken: string): Promise<string> {
    const combined = this.base64ToUint8Array(encryptedToken);
    const iv = combined.slice(0, 12);
    const ciphertextAndTag = combined.slice(12);
    const tag = ciphertextAndTag.slice(ciphertextAndTag.length - 16);
    const ciphertext = ciphertextAndTag.slice(0, ciphertextAndTag.length - 16);

    const keyBytes = forge.md.sha256.create().update(this.SERVER_TOKEN_SECRET, 'utf8').digest().getBytes();

    const decipher = forge.cipher.createDecipher('AES-GCM', keyBytes);
    decipher.start({
      iv: forge.util.createBuffer(iv),
      tagLength: 128,
      tag: forge.util.createBuffer(tag)
    });
    decipher.update(forge.util.createBuffer(ciphertext));
    const success = decipher.finish();
    if (!success) {
      throw new Error('Échec du déchiffrement du token serveur (tag GCM invalide)');
    }
    console.error('Token décryptage:', decipher.output.toString());
    return decipher.output.toString();
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
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

