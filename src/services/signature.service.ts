// Améliorations du SignatureService

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import { SignatureHistory } from '../models/signature-history';

// Interface définie directement dans le service
export interface SignatureHistory {
  uuid: string;
  signatory_name: string;
  position: string;
  customs_office_code: string;
  validFrom: Date | string | null;
  validTo: Date | string | null;
  signatureImage: Uint8Array | number[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  [x: string]: any;
 // private apiUrl = '/api/signatures'; // Ajustez selon votre configuration
 // private BASE_URL = 'http://localhost:8090';
    private readonly BASE_URL = `${environment.defaultauth}`;
  private apiUrl = `${this.BASE_URL}/api/signatures`;
  
  // Cache local pour optimiser les performances
  private signaturesCache$ = new BehaviorSubject<SignatureHistory[]>([]);
  
  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les signatures avec gestion d'erreur améliorée
   */
  /*getAllSignatures(): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(this.apiUrl).pipe(
      retry(2), // Retry 2 fois en cas d'échec
      tap(signatures => {
        this.signaturesCache$.next(signatures);
      }),
      catchError(this.handleError)
    );
  }
*/
  getAllSignatures(): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(this.apiUrl).pipe(
      retry(2),
      tap(signatures => {
        console.log('🔍 DONNÉES BRUTES du backend:', signatures);
        console.log('🔍 Première signature brute:', signatures[0]);
        console.log('🔍 UUID de la première:', signatures[0]?.uuid);
        console.log('🔍 Clés première signature:', Object.keys(signatures[0] || {}));
        this.signaturesCache$.next(signatures);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Ajoute une nouvelle signature
   */
  addSignature(formData: FormData): Observable<SignatureHistory> {
    return this.http.post<SignatureHistory>(this.apiUrl, formData).pipe(
      tap(newSignature => {
        // Mettre à jour le cache local
        const currentSignatures = this.signaturesCache$.value;
        this.signaturesCache$.next([newSignature, ...currentSignatures]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour une signature existante
   */
  updateSignature(uuid: string, formData: FormData): Observable<SignatureHistory> {
    return this.http.put<SignatureHistory>(`${this.apiUrl}/${uuid}`, formData).pipe(
      tap(updatedSignature => {
        // Mettre à jour le cache local
        const currentSignatures = this.signaturesCache$.value;
        const index = currentSignatures.findIndex(s => s.uuid === uuid);
        if (index !== -1) {
          currentSignatures[index] = updatedSignature;
          this.signaturesCache$.next([...currentSignatures]);
        }
      }),
      catchError(this.handleError)
    );
  }

  /*deleteSignature(uuid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${uuid}`, { responseType: 'text' }).pipe(

    )
  }
*/
  /**
   * Supprime une signature (soft delete)
   */
  deleteSignature(uuid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${uuid}`, { responseType: 'text' }).pipe(
      tap(() => {
        // Supprimer du cache local
        const currentSignatures = this.signaturesCache$.value;
        const filteredSignatures = currentSignatures.filter(s => s.uuid !== uuid);
        this.signaturesCache$.next(filteredSignatures);
      }),
      catchError(this.handleError)
    );
  }


getSignatureById(uuid: string): Observable<SignatureHistory> {
  return this.http.get<SignatureHistory>(`${this.apiUrl}/${uuid}`);
}
  /**
   * Récupère les signatures d'un bureau spécifique
   */
  getSignaturesByBureau(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.apiUrl}/bureau/${customsOfficeCode}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la signature actuelle valide pour un bureau
   */
  getCurrentValidSignature(customsOfficeCode: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.apiUrl}/current/${customsOfficeCode}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la dernière signature valide pour un bureau à une date
   */
  getLatestValidSignature(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let url = `${this.apiUrl}/latest/${customsOfficeCode}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      url += `?date=${dateStr}`;
    }
    return this.http.get<SignatureHistory>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la dernière signature valide avec priorité
   */
  getLatestValidSignatureWithPriority(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let url = `${this.apiUrl}/latest-priority/${customsOfficeCode}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      url += `?date=${dateStr}`;
    }
    return this.http.get<SignatureHistory>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère toutes les signatures valides triées
   */
  getAllValidSignaturesSorted(customsOfficeCode: string, date?: Date): Observable<SignatureHistory[]> {
    let url = `${this.apiUrl}/valid-sorted/${customsOfficeCode}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      url += `?date=${dateStr}`;
    }
    return this.http.get<SignatureHistory[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Vérifie si une signature est valide à une date donnée
   */
  isSignatureValidAtDate(uuid: string, date?: Date): Observable<boolean> {
    let url = `${this.apiUrl}/validate/${uuid}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      url += `?date=${dateStr}`;
    }
    return this.http.get<boolean>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Rafraîchit le cache des signatures
   */
  refreshCache(): Observable<string> {
    return this.http.get(`${this.apiUrl}/refresh-cache`, { responseType: 'text' }).pipe(
      tap(() => {
        // Vider le cache local pour forcer un rechargement
        this.signaturesCache$.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Crée un FormData pour l'ajout d'une signature
   */
  createSignatureFormData(signatureData: any, file: File): FormData {
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('signatoryName', signatureData.signatoryName);
    formData.append('position', signatureData.position);
    formData.append('ideCuoCod', signatureData.ideCuoCod);
    
    if (signatureData.validFrom) {
      formData.append('validFrom', this.formatDateForBackend(signatureData.validFrom));
    }
    
    if (signatureData.validTo) {
      formData.append('validTo', this.formatDateForBackend(signatureData.validTo));
    }
    
    return formData;
  }

  /**
   * Crée un FormData pour la mise à jour d'une signature
   */
  createUpdateSignatureFormData(signatureData: any, file?: File): FormData {
    const formData = new FormData();
    
    if (file) {
      formData.append('file', file);
    }
    
    formData.append('signatoryName', signatureData.signatoryName);
    formData.append('position', signatureData.position);
    formData.append('ideCuoCod', signatureData.ideCuoCod);
    
    if (signatureData.validFrom) {
      formData.append('validFrom', this.formatDateForBackend(signatureData.validFrom));
    }
    
    if (signatureData.validTo) {
      formData.append('validTo', this.formatDateForBackend(signatureData.validTo));
    }
    
    return formData;
  }

  /**
   * NOUVELLES MÉTHODES ALIGNÉES AVEC LE CONTRÔLEUR
   */

  /**
   * Vérifie si un bureau a des signatures valides
   */
  hasValidSignatures(customsOfficeCode: string, date?: Date): Observable<boolean> {
    let url = `${this.apiUrl}/has-valid/${customsOfficeCode}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      url += `?date=${dateStr}`;
    }
    return this.http.get<boolean>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la meilleure signature pour un bureau
   */
  getBestSignatureForOffice(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let url = `${this.apiUrl}/best/${customsOfficeCode}`;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      url += `?date=${dateStr}`;
    }
    return this.http.get<SignatureHistory>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le résumé des signatures pour un bureau
   */
  getSignatureSummary(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.apiUrl}/summary/${customsOfficeCode}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Test de sélection de signature (pour les différents types de sélection)
   */
  testSignatureSelection(customsOfficeCode: string, testDate: Date, testType: string = 'latest'): Observable<any> {
    const dateStr = testDate.toISOString().split('T')[0];
    
    let url: string;
    switch (testType) {
      case 'current':
        url = `${this.apiUrl}/current/${customsOfficeCode}`;
        break;
      case 'priority':
        url = `${this.apiUrl}/latest-priority/${customsOfficeCode}?date=${dateStr}`;
        break;
      case 'latest':
      default:
        url = `${this.apiUrl}/latest/${customsOfficeCode}?date=${dateStr}`;
        break;
    }
    
    return this.http.get<SignatureHistory>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * MÉTHODES UTILITAIRES
   */

  /**
   * Formate une date pour l'envoi au backend
   */
  private formatDateForBackend(date: Date | string): string {
    if (typeof date === 'string') {
      return date; // Déjà au bon format
    }
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 409:
          errorMessage = 'Conflit. Cette action ne peut pas être effectuée.';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
      
      // Si le serveur a renvoyé un message d'erreur spécifique
      if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Erreur dans SignatureService:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Obtient le cache des signatures
   */
  getSignaturesCache(): Observable<SignatureHistory[]> {
    return this.signaturesCache$.asObservable();
  }

  /**
   * Vide le cache des signatures
   */
  clearCache(): void {
    this.signaturesCache$.next([]);
  }

  /**
   * Méthode pour télécharger une image de signature
   */
  downloadSignatureImage(uuid: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${uuid}/image`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Vérifie la connectivité avec le serveur
   */
  checkServerHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      catchError(this.handleError)
    );
  }
}
/*import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface correspondant au DTO SignatureHistory du controller Java
export interface SignatureHistory {
  uuid: string;
  signatoryName: string;
  signatureImage: Uint8Array;
  validFrom: Date | null;
  validTo: Date | null;
  position: string;
  ideCuoCod: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  // URL de base pour les appels API
  private BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  // =====================================
  // MÉTHODES D'AUTHENTIFICATION PRIVÉES
  // =====================================

  /**
   * Récupère les en-têtes avec authentification pour les requêtes JSON
   
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token d\'authentification trouvé. Veuillez vous connecter d\'abord.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Récupère les en-têtes pour les requêtes multipart (avec fichiers)
   
  private getHeadersForMultipart(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token d\'authentification trouvé. Veuillez vous connecter d\'abord.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // =====================================
  // MÉTHODES DE RÉCUPÉRATION DE SIGNATURES
  // =====================================

  /**
   * Liste toutes les signatures actives
   * Endpoint: GET /api/signatures
   
  getAllSignatures(): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Récupère les signatures d'un bureau spécifique
   * Endpoint: GET /api/signatures/bureau/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   
  getSignaturesByBureau(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures/bureau/${customsOfficeCode}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Récupère une signature par son UUID
   * Endpoint: GET /api/signatures/{uuid}
   * @param uuid Identifiant unique de la signature
   
  getSignatureById(uuid: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`, {
      headers: this.getHeaders()
    });
  }

  // =====================================
  // NOUVELLES MÉTHODES POUR LES SIGNATURES VALIDES
  // =====================================

  /**
   * Récupère la dernière signature valide pour un bureau de douane à une date donnée
   * Endpoint: GET /api/signatures/latest/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getLatestValidSignature(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/latest/${customsOfficeCode}`, {
      params,
      headers: this.getHeaders()
    });
  }

  /**
   * Récupère la dernière signature valide actuelle pour un bureau de douane
   * Endpoint: GET /api/signatures/current/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   
  getCurrentValidSignature(customsOfficeCode: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/current/${customsOfficeCode}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Récupère la dernière signature valide avec priorité sur validTo
   * Endpoint: GET /api/signatures/latest-priority/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getLatestValidSignatureWithPriority(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/latest-priority/${customsOfficeCode}`, {
      params,
      headers: this.getHeaders()
    });
  }

  /**
   * Récupère toutes les signatures valides pour un bureau triées par date de création
   * Endpoint: GET /api/signatures/valid-sorted/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getAllValidSignaturesSorted(customsOfficeCode: string, date?: Date): Observable<SignatureHistory[]> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures/valid-sorted/${customsOfficeCode}`, {
      params,
      headers: this.getHeaders()
    });
  }

  /**
   * Vérifie si une signature est valide à une date donnée
   * Endpoint: GET /api/signatures/validate/{uuid}
   * @param uuid Identifiant unique de la signature
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  isSignatureValidAtDate(uuid: string, date?: Date): Observable<boolean> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<boolean>(`${this.BASE_URL}/api/signatures/validate/${uuid}`, {
      params,
      headers: this.getHeaders()
    });
  }

  // =====================================
  // MÉTHODES CRUD (CREATE, UPDATE, DELETE)
  // =====================================

  /**
   * Ajoute une nouvelle signature
   * Endpoint: POST /api/signatures (multipart/form-data)
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  addSignature(formData: FormData): Observable<SignatureHistory> {
    return this.http.post<SignatureHistory>(`${this.BASE_URL}/api/signatures`, formData, {
      headers: this.getHeadersForMultipart()
    });
  }

  /**
   * Met à jour une signature existante
   * Endpoint: PUT /api/signatures/{uuid} (multipart/form-data)
   * @param uuid Identifiant unique de la signature
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  updateSignature(uuid: string, formData: FormData): Observable<SignatureHistory> {
    return this.http.put<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`, formData, {
      headers: this.getHeadersForMultipart()
    });
  }

  /**
   * Supprime une signature (soft delete)
   * Endpoint: DELETE /api/signatures/{uuid}
   * @param uuid Identifiant unique de la signature
   
  deleteSignature(uuid: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/api/signatures/${uuid}`, {
      responseType: 'text',
      headers: this.getHeaders()
    });
  }

  /**
   * Rafraîchit le cache des signatures
   * Endpoint: GET /api/signatures/refresh-cache
   
  refreshCache(): Observable<string> {
    return this.http.get(`${this.BASE_URL}/api/signatures/refresh-cache`, {
      responseType: 'text',
      headers: this.getHeaders()
    });
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR FORMULAIRES
  // =====================================

  /**
   * Crée un FormData pour l'ajout d'une nouvelle signature
   * @param signature Objet contenant les données de la signature
   * @param file Fichier image de la signature (obligatoire pour création)
   
  createSignatureFormData(
    signature: {
      signatoryName: string,
      position: string,
      ideCuoCod: string,
      validFrom?: Date | null,
      validTo?: Date | null
    },
    file: File
  ): FormData {
    const formData = new FormData();
    
    // Paramètres obligatoires pour la création
    formData.append('file', file);
    formData.append('signatoryName', signature.signatoryName);
    formData.append('position', signature.position);
    formData.append('ideCuoCod', signature.ideCuoCod);
    
    // Paramètres optionnels
    if (signature.validFrom) {
      formData.append('validFrom', this.formatDate(signature.validFrom));
    }
    
    if (signature.validTo) {
      formData.append('validTo', this.formatDate(signature.validTo));
    }
    
    return formData;
  }

  /**
   * Crée un FormData pour la mise à jour d'une signature existante
   * @param signature Objet contenant les données de la signature (tous optionnels)
   * @param file Fichier image de la signature (optionnel pour mise à jour)
   
  createUpdateSignatureFormData(
    signature: {
      signatoryName?: string,
      position?: string,
      ideCuoCod?: string,
      validFrom?: Date | null,
      validTo?: Date | null
    },
    file?: File
  ): FormData {
    const formData = new FormData();
    
    // Ajouter le fichier si présent
    if (file) {
      formData.append('file', file);
    }
    
    // Ajouter les paramètres s'ils sont définis
    if (signature.signatoryName !== undefined && signature.signatoryName !== null) {
      formData.append('signatoryName', signature.signatoryName);
    }
    
    if (signature.position !== undefined && signature.position !== null) {
      formData.append('position', signature.position);
    }
    
    if (signature.ideCuoCod !== undefined && signature.ideCuoCod !== null) {
      formData.append('ideCuoCod', signature.ideCuoCod);
    }
    
    if (signature.validFrom !== undefined) {
      if (signature.validFrom === null) {
        formData.append('validFrom', '');
      } else {
        formData.append('validFrom', this.formatDate(signature.validFrom));
      }
    }
    
    if (signature.validTo !== undefined) {
      if (signature.validTo === null) {
        formData.append('validTo', '');
      } else {
        formData.append('validTo', this.formatDate(signature.validTo));
      }
    }
    
    return formData;
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR AFFICHAGE
  // =====================================

  /**
   * Convertit un Uint8Array en URL d'image pour l'affichage
   * @param imageData Tableau d'octets de l'image
   * @param mimeType Type MIME de l'image (par défaut: image/png)
   
  getImageUrl(imageData: Uint8Array | null, mimeType: string = 'image/png'): string {
    if (!imageData || imageData.length === 0) {
      return '';
    }
    
    const blob = new Blob([imageData], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  /**
   * Libère les ressources d'une URL d'objet créée par getImageUrl
   * @param url URL à libérer
   
  revokeImageUrl(url: string): void {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Formate une date au format yyyy-MM-dd pour l'API
   * @param date Date à formater
   
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // =====================================
  // MÉTHODES PRATIQUES POUR L'UTILISATION
  // =====================================

  /**
   * Recherche la meilleure signature pour un bureau à une date donnée
   * (utilise getLatestValidSignatureWithPriority en premier choix)
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle)
   
  getBestSignatureForOffice(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    return this.getLatestValidSignatureWithPriority(customsOfficeCode, date);
  }

  /**
   * Vérifie si un bureau a des signatures valides
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle)
   
  hasValidSignatures(customsOfficeCode: string, date?: Date): Observable<boolean> {
    return new Observable(observer => {
      this.getAllValidSignaturesSorted(customsOfficeCode, date).subscribe({
        next: (signatures) => {
          observer.next(signatures.length > 0);
          observer.complete();
        },
        error: (error) => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  /**
   * Récupère les informations de signature pour affichage en liste
   * @param customsOfficeCode Code du bureau de douane
   
  getSignatureSummary(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.getSignaturesByBureau(customsOfficeCode);
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR DÉBOGAGE
  // =====================================

  /**
   * Vérifie si un token d'authentification existe
   
  hasToken(): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }

  /**
   * Récupère un aperçu du token pour le débogage (sans exposer le token complet)
   
  getTokenPreview(): string {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return 'Aucun token';
    return token.substring(0, 20) + '...';
  }

  /**
   * Définit manuellement un token (utile pour les tests)
   
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Supprime le token d'authentification
   
  clearToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  /**
   * Teste la connexion à l'API avec le token actuel
   
  testConnection(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/signatures/refresh-cache`, {
      headers: this.getHeaders()
    });
  }

  // =====================================
  // MÉTHODES AVANCÉES DE GESTION D'ERREURS
  // =====================================

  /**
   * Vérifie si une erreur est liée à l'authentification
   
  isAuthenticationError(error: any): boolean {
    return error.status === 401 || error.status === 403;
  }

  /**
   * Gère les erreurs d'authentification automatiquement
   
  handleAuthError(error: any): void {
    if (this.isAuthenticationError(error)) {
      console.warn('Erreur d\'authentification détectée, suppression du token');
      this.clearToken();
      // Vous pouvez ici rediriger vers la page de connexion
      // this.router.navigate(['/login']);
    }
  }

  /**
   * Version sécurisée de getAllSignatures avec gestion d'erreur automatique
   
  getAllSignaturesSafe(): Observable<SignatureHistory[]> {
    return new Observable(observer => {
      this.getAllSignatures().subscribe({
        next: (data) => observer.next(data),
        error: (error) => {
          this.handleAuthError(error);
          observer.error(error);
        }
      });
    });
  }
} */
/*import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface correspondant au DTO SignatureHistory du controller Java
export interface SignatureHistory {
  uuid: string;
  signatoryName: string;
  signatureImage: Uint8Array;
  validFrom: Date | null;
  validTo: Date | null;
  position: string;
  ideCuoCod: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  // URL de base pour les appels API
  private BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  // =====================================
  // MÉTHODES DE RÉCUPÉRATION DE SIGNATURES
  // =====================================

  /**
   * Liste toutes les signatures actives
   * Endpoint: GET /api/signatures
   
 /* getAllSignatures(): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures`);
  }

  /**
   * Récupère les signatures d'un bureau spécifique
   * Endpoint: GET /api/signatures/bureau/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   
  getSignaturesByBureau(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures/bureau/${customsOfficeCode}`);
  }

  /**
   * Récupère une signature par son UUID
   * Endpoint: GET /api/signatures/{uuid}
   * @param uuid Identifiant unique de la signature
   
  getSignatureById(uuid: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`);
  }

  // =====================================
  // NOUVELLES MÉTHODES POUR LES SIGNATURES VALIDES
  // =====================================

  /**
   * Récupère la dernière signature valide pour un bureau de douane à une date donnée
   * Endpoint: GET /api/signatures/latest/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getLatestValidSignature(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/latest/${customsOfficeCode}`, { params });
  }

  /**
   * Récupère la dernière signature valide actuelle pour un bureau de douane
   * Endpoint: GET /api/signatures/current/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   
  getCurrentValidSignature(customsOfficeCode: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/current/${customsOfficeCode}`);
  }

  /**
   * Récupère la dernière signature valide avec priorité sur validTo
   * Endpoint: GET /api/signatures/latest-priority/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getLatestValidSignatureWithPriority(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/latest-priority/${customsOfficeCode}`, { params });
  }

  /**
   * Récupère toutes les signatures valides pour un bureau triées par date de création
   * Endpoint: GET /api/signatures/valid-sorted/{customsOfficeCode}
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  getAllValidSignaturesSorted(customsOfficeCode: string, date?: Date): Observable<SignatureHistory[]> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures/valid-sorted/${customsOfficeCode}`, { params });
  }

  /**
   * Vérifie si une signature est valide à une date donnée
   * Endpoint: GET /api/signatures/validate/{uuid}
   * @param uuid Identifiant unique de la signature
   * @param date Date à vérifier (optionnelle, utilise la date actuelle si non fournie)
   
  isSignatureValidAtDate(uuid: string, date?: Date): Observable<boolean> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', this.formatDate(date));
    }
    
    return this.http.get<boolean>(`${this.BASE_URL}/api/signatures/validate/${uuid}`, { params });
  }

  // =====================================
  // MÉTHODES CRUD (CREATE, UPDATE, DELETE)
  // =====================================

  /**
   * Ajoute une nouvelle signature
   * Endpoint: POST /api/signatures (multipart/form-data)
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  /*addSignature(formData: FormData): Observable<SignatureHistory> {
    return this.http.post<SignatureHistory>(`${this.BASE_URL}/api/signatures`, formData);
  }

  /**
   * Met à jour une signature existante
   * Endpoint: PUT /api/signatures/{uuid} (multipart/form-data)
   * @param uuid Identifiant unique de la signature
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  updateSignature(uuid: string, formData: FormData): Observable<SignatureHistory> {
    return this.http.put<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`, formData);
  }

  /**
   * Supprime une signature (soft delete)
   * Endpoint: DELETE /api/signatures/{uuid}
   * @param uuid Identifiant unique de la signature
   
  deleteSignature(uuid: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/api/signatures/${uuid}`, { responseType: 'text' });
  }

  /**
   * Rafraîchit le cache des signatures
   * Endpoint: GET /api/signatures/refresh-cache
   
  refreshCache(): Observable<string> {
    return this.http.get(`${this.BASE_URL}/api/signatures/refresh-cache`, { responseType: 'text' });
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR FORMULAIRES
  // =====================================

  /**
   * Crée un FormData pour l'ajout d'une nouvelle signature
   * @param signature Objet contenant les données de la signature
   * @param file Fichier image de la signature (obligatoire pour création)
   
  createSignatureFormData(
    signature: {
      signatoryName: string,
      position: string,
      ideCuoCod: string,
      validFrom?: Date | null,
      validTo?: Date | null
    },
    file: File
  ): FormData {
    const formData = new FormData();
    
    // Paramètres obligatoires pour la création
    formData.append('file', file);
    formData.append('signatoryName', signature.signatoryName);
    formData.append('position', signature.position);
    formData.append('ideCuoCod', signature.ideCuoCod);
    
    // Paramètres optionnels
    if (signature.validFrom) {
      formData.append('validFrom', this.formatDate(signature.validFrom));
    }
    
    if (signature.validTo) {
      formData.append('validTo', this.formatDate(signature.validTo));
    }
    
    return formData;
  }

  /**
   * Crée un FormData pour la mise à jour d'une signature existante
   * @param signature Objet contenant les données de la signature (tous optionnels)
   * @param file Fichier image de la signature (optionnel pour mise à jour)
   
  createUpdateSignatureFormData(
    signature: {
      signatoryName?: string,
      position?: string,
      ideCuoCod?: string,
      validFrom?: Date | null,
      validTo?: Date | null
    },
    file?: File
  ): FormData {
    const formData = new FormData();
    
    // Ajouter le fichier si présent
    if (file) {
      formData.append('file', file);
    }
    
    // Ajouter les paramètres s'ils sont définis
    if (signature.signatoryName !== undefined && signature.signatoryName !== null) {
      formData.append('signatoryName', signature.signatoryName);
    }
    
    if (signature.position !== undefined && signature.position !== null) {
      formData.append('position', signature.position);
    }
    
    if (signature.ideCuoCod !== undefined && signature.ideCuoCod !== null) {
      formData.append('ideCuoCod', signature.ideCuoCod);
    }
    
    if (signature.validFrom !== undefined) {
      if (signature.validFrom === null) {
        formData.append('validFrom', '');
      } else {
        formData.append('validFrom', this.formatDate(signature.validFrom));
      }
    }
    
    if (signature.validTo !== undefined) {
      if (signature.validTo === null) {
        formData.append('validTo', '');
      } else {
        formData.append('validTo', this.formatDate(signature.validTo));
      }
    }
    
    return formData;
  }

  // =====================================
  // MÉTHODES UTILITAIRES POUR AFFICHAGE
  // =====================================

  /**
   * Convertit un Uint8Array en URL d'image pour l'affichage
   * @param imageData Tableau d'octets de l'image
   * @param mimeType Type MIME de l'image (par défaut: image/png)
   
  getImageUrl(imageData: Uint8Array | null, mimeType: string = 'image/png'): string {
    if (!imageData || imageData.length === 0) {
      return '';
    }
    
    const blob = new Blob([imageData], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  /**
   * Libère les ressources d'une URL d'objet créée par getImageUrl
   * @param url URL à libérer
   
  revokeImageUrl(url: string): void {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Formate une date au format yyyy-MM-dd pour l'API
   * @param date Date à formater
   
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // =====================================
  // MÉTHODES PRATIQUES POUR L'UTILISATION
  // =====================================

  /**
   * Recherche la meilleure signature pour un bureau à une date donnée
   * (utilise getLatestValidSignatureWithPriority en premier choix)
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle)
   
  getBestSignatureForOffice(customsOfficeCode: string, date?: Date): Observable<SignatureHistory> {
    return this.getLatestValidSignatureWithPriority(customsOfficeCode, date);
  }

  /**
   * Vérifie si un bureau a des signatures valides
   * @param customsOfficeCode Code du bureau de douane
   * @param date Date à vérifier (optionnelle)
   
  hasValidSignatures(customsOfficeCode: string, date?: Date): Observable<boolean> {
    return new Observable(observer => {
      this.getAllValidSignaturesSorted(customsOfficeCode, date).subscribe({
        next: (signatures) => {
          observer.next(signatures.length > 0);
          observer.complete();
        },
        error: (error) => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  /**
   * Récupère les informations de signature pour affichage en liste
   * @param customsOfficeCode Code du bureau de douane
   
  getSignatureSummary(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.getSignaturesByBureau(customsOfficeCode);
  }

  // Dans votre service Angular
private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  });
}

// Pour les requêtes multipart (avec fichiers), n'incluez pas Content-Type
private getHeadersForMultipart(): HttpHeaders {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return new HttpHeaders({
    'Authorization': token ? `Bearer ${token}` : ''
  });
}

// Exemple d'utilisation
getAllSignatures(): Observable<SignatureHistory[]> {
  return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures`, {
    headers: this.getHeaders()
  });
}

addSignature(formData: FormData): Observable<SignatureHistory> {
  return this.http.post<SignatureHistory>(`${this.BASE_URL}/api/signatures`, formData, {
    headers: this.getHeadersForMultipart()
  });
}
}
*/
/*

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface correspondant au DTO SignatureHistory du controller Java
export interface SignatureHistory {
  uuid: string;
  signatoryName: string;
  signatureImage: Uint8Array;
  validFrom: Date | null;
  validTo: Date | null;
  position: string;
  ideCuoCod: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  // URL de base pour les appels API
  private BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les signatures actives
   
  getAllSignatures(): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures`);
  }

  /**
   * Récupère les signatures d'un bureau spécifique
   * @param customsOfficeCode Code du bureau de douane
   
  getSignaturesByBureau(customsOfficeCode: string): Observable<SignatureHistory[]> {
    return this.http.get<SignatureHistory[]>(`${this.BASE_URL}/api/signatures/bureau/${customsOfficeCode}`);
  }

  /**
   * Récupère une signature par son UUID
   * @param uuid Identifiant unique de la signature
   
  getSignatureById(uuid: string): Observable<SignatureHistory> {
    return this.http.get<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`);
  }

  /**
   * Ajoute une nouvelle signature
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  addSignature(formData: FormData): Observable<SignatureHistory> {
    return this.http.post<SignatureHistory>(`${this.BASE_URL}/api/signatures`, formData);
  }

  /**
   * Met à jour une signature existante
   * @param uuid Identifiant unique de la signature
   * @param formData Données du formulaire incluant l'image et les infos de signature
   
  updateSignature(uuid: string, formData: FormData): Observable<SignatureHistory> {
    return this.http.put<SignatureHistory>(`${this.BASE_URL}/api/signatures/${uuid}`, formData);
  }

  /**
   * Supprime une signature (soft delete)
   * @param uuid Identifiant unique de la signature
   
  deleteSignature(uuid: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/api/signatures/${uuid}`);
  }

  /**
   * Crée un FormData pour l'ajout ou la mise à jour d'une signature
   * @param signature Objet contenant les données de la signature
   * @param file Fichier image de la signature (optionnel pour mise à jour)
   
  createSignatureFormData(
    signature: {
      signatoryName: string,
      position: string,
      ideCuoCod: string,
      validFrom?: Date | null,
      validTo?: Date | null
    },
    file?: File
  ): FormData {
    const formData = new FormData();
    
    // Ajouter les informations de la signature
    formData.append('signatoryName', signature.signatoryName);
    formData.append('position', signature.position);
    formData.append('ideCuoCod', signature.ideCuoCod);
    
    // Ajouter les dates si présentes
    if (signature.validFrom) {
      formData.append('validFrom', this.formatDate(signature.validFrom));
    }
    
    if (signature.validTo) {
      formData.append('validTo', this.formatDate(signature.validTo));
    }
    
    // Ajouter le fichier si présent
    if (file) {
      formData.append('file', file);
    }
    
    return formData;
  }

  /**
   * Formate une date au format yyyy-MM-dd pour l'API
   * @param date Date à formater
   
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Convertit un Uint8Array en URL d'image pour l'affichage
   * @param imageData Tableau d'octets de l'image
   
  getImageUrl(imageData: Uint8Array | null): string {
    if (!imageData || imageData.length === 0) {
      return '';
    }
    
    const blob = new Blob([imageData], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }

  /**
   * Libère les ressources d'une URL d'objet créée par getImageUrl
   * @param url URL à libérer
   
  revokeImageUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  // Ajoutez ces méthodes au service SignatureService

/**
 * Teste quelle signature serait utilisée pour une date et un bureau spécifiques
 * @param customsOfficeCode Code du bureau de douane
 * @param testDate Date à tester (format Date)
 
testSignatureSelection(customsOfficeCode: string, testDate: Date): Observable<any> {
  const params = new HttpParams()
    .set('ideCuoCod', customsOfficeCode)
    .set('testDate', this.formatDate(testDate));
  
  return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/test-signature`, { params });
}

/**
 * Récupère la liste de toutes les signatures organisées par bureau
 
listAllSignatures(): Observable<any> {
  return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/list-signatures`);
}

/**
 * Raffraîchit le cache des signatures
 
refreshSignatures(): Observable<any> {
  return this.http.get(`${this.BASE_URL}/api/signatures/refresh-cache`);
}

/**
 * Génère une quittance avec signature spécifique
 * @param params Paramètres de la quittance
 * @param signatureId Identifiant de la signature (optionnel)
 * @param forPrint Optimisé pour l'impression
 
generateQuittance(
  params: {
    ideCuoCod: string;
    decRefYer: number;
    decCod: string;
    ideAstSer: string;
    ideAstNbr: string;
  },
  signatureId?: string,
  forPrint: boolean = true
): Observable<Blob> {
  let httpParams = new HttpParams()
    .set('ideCuoCod', params.ideCuoCod)
    .set('decRefYer', params.decRefYer.toString())
    .set('decCod', params.decCod)
    .set('ideAstSer', params.ideAstSer)
    .set('ideAstNbr', params.ideAstNbr)
    .set('forPrint', forPrint.toString());
  
  if (signatureId) {
    httpParams = httpParams.set('signatureId', signatureId);
  }
  
  return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/generate`, {
    params: httpParams,
    responseType: 'blob'
  });
}
} */

