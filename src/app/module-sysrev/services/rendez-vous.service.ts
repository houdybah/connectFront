import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces pour les réponses
export interface UserInfo {
  username: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface RendezVous {
  numeroRdz: string;
  refDeclaration: string;
  chauffeur: string;
  immatriculation: string;
  destination: string;
  dateSortie: Date;
}

export interface PageInfo {
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ListeRendezVousResponse {
  user: UserInfo;
  groupes: RendezVous[];
  page: PageInfo;
}

export interface ConteneurInfo {
  numeroConteneur: string;
  type: string;
}

export interface ListeApurement {
  refRendezVous: string;
  refDeclaration: string;
  chauffeur: string;
  immatriculation: string;
  destination: string;
  listesConteneurs: ConteneurInfo[];
}

export interface ListeApurementResponse {
  user: UserInfo;
  groupes: ListeApurement[];
  page: PageInfo;
}

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private readonly apiUrl = `${environment.defaultauth}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les headers avec le token d'authentification
   */
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      const cleanToken = token.replace(/"/g, '');
      headers = headers.set('Authorization', `Bearer ${cleanToken}`);
    }

    return headers;
  }

  /**
   * Récupère le rôle de l'utilisateur courant
   */
  private getCurrentUserRole(): string {
    const role = sessionStorage.getItem('role') || '';
    return role.replace(/"/g, '');
  }

  /**
   * GET /api/listeRendezVousSortie
   * Liste des rendez-vous de sortie (paginée)
   */
  getListeRendezVousSortie(page: number = 0, size: number = 20): Observable<ListeRendezVousResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('📦 GET listeRendezVousSortie - Rôle:', this.getCurrentUserRole(), 'Page:', page, 'Size:', size);

    return this.http.get<ListeRendezVousResponse>(`${this.apiUrl}/listeRendezVousSortie`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      tap((response) => {
        console.log('✅ Rendez-vous sortie reçus:', response);
      }),
      catchError((error) => {
        console.error('❌ Erreur rendez-vous sortie:', error);
        this.handleError(error);
        return of(this.getEmptyRendezVousResponse());
      })
    );
  }

  /**
   * GET /api/listedesrendezvousAvecfiltresstatusSorti
   * Liste des rendez-vous avec filtres de date
   */
  getListeRendezVousAvecFiltres(
    page: number = 0,
    size: number = 20,
    dateDebut?: Date,
    dateFin?: Date
  ): Observable<ListeRendezVousResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (dateDebut) {
      params = params.set('dateDebut', this.formatDate(dateDebut));
    }
    if (dateFin) {
      params = params.set('dateFin', this.formatDate(dateFin));
    }

    console.log('🔍 GET rendez-vous avec filtres - Rôle:', this.getCurrentUserRole(), 'Params:', params.toString());

    return this.http.get<ListeRendezVousResponse>(
      `${this.apiUrl}/listedesrendezvousAvecfiltresstatusSorti`,
      { params, headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        console.log('✅ Rendez-vous filtrés reçus:', response);
      }),
      catchError((error) => {
        console.error('❌ Erreur rendez-vous filtrés:', error);
        this.handleError(error);
        return of(this.getEmptyRendezVousResponse());
      })
    );
  }

  /**
   * GET /api/AlllistedesrendezvousAvecglobalefiltres
   * Liste globale des rendez-vous avec filtre par déclarant
   */
  getListeRendezVousGlobale(
    page: number = 0,
    size: number = 20,
    codeDeclarant?: string
  ): Observable<ListeRendezVousResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (codeDeclarant) {
      params = params.set('codeDeclarant', codeDeclarant);
    }

    console.log('🌐 GET rendez-vous globale - Rôle:', this.getCurrentUserRole(), 'Code déclarant:', codeDeclarant);

    return this.http.get<ListeRendezVousResponse>(
      `${this.apiUrl}/AlllistedesrendezvousAvecglobalefiltres`,
      { params, headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        console.log('✅ Rendez-vous globale reçus:', response);
      }),
      catchError((error) => {
        console.error('❌ Erreur rendez-vous globale:', error);
        this.handleError(error);
        return of(this.getEmptyRendezVousResponse());
      })
    );
  }

  /**
   * GET /api/listesapurement
   * Liste d'apurement (paginée)
   */
  getListesApurement(page: number = 0, size: number = 20): Observable<ListeApurementResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('📋 GET listes apurement - Rôle:', this.getCurrentUserRole(), 'Page:', page);

    return this.http.get<ListeApurementResponse>(`${this.apiUrl}/listesapurement`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      tap((response) => {
        console.log('✅ Listes apurement reçues:', response);
      }),
      catchError((error) => {
        console.error('❌ Erreur listes apurement:', error);
        this.handleError(error);
        return of(this.getEmptyApurementResponse());
      })
    );
  }

  /**
   * Formater une date en yyyy-MM-dd
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: any): void {
    if (error.status === 401) {
      console.error('❌ Non authentifié - Token expiré ou invalide');
    } else if (error.status === 403) {
      console.error('❌ Accès refusé pour le rôle:', this.getCurrentUserRole());
    } else if (error.status === 404) {
      console.error('❌ Endpoint non trouvé');
    } else if (error.status === 500) {
      console.error('❌ Erreur serveur - Vérifiez les logs backend');
    }
  }

  /**
   * Retourne une réponse vide pour rendez-vous
   */
  private getEmptyRendezVousResponse(): ListeRendezVousResponse {
    return {
      user: {
        username: '',
        email: '',
        nom: '',
        prenom: '',
        role: this.getCurrentUserRole()
      },
      groupes: [],
      page: {
        pageNumber: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      }
    };
  }

  /**
   * Retourne une réponse vide pour apurement
   */
  private getEmptyApurementResponse(): ListeApurementResponse {
    return {
      user: {
        username: '',
        email: '',
        nom: '',
        prenom: '',
        role: this.getCurrentUserRole()
      },
      groupes: [],
      page: {
        pageNumber: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
      }
    };
  }

  /**
   * Vérifications de rôle
   */
  isDG(): boolean {
    return this.getCurrentUserRole() === 'DG';
  }

  isDGA(): boolean {
    return this.getCurrentUserRole() === 'DGA';
  }

  isDIS(): boolean {
    return this.getCurrentUserRole() === 'DIS';
  }

  isChefParc(): boolean {
    return this.getCurrentUserRole() === 'CHEF_BUREAU_PARC';
  }

  isDeclarant(): boolean {
    return this.getCurrentUserRole() === 'DECLARANT';
  }

  isDouane(): boolean {
    return this.getCurrentUserRole() === 'DOUANE';
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ADMIN';
  }

  /**
   * Vérifie si l'utilisateur a accès aux rendez-vous
   */
  canAccessRendezVous(): boolean {
    const role = this.getCurrentUserRole();
    return ['DG', 'DGA', 'DIS', 'CHEF_BUREAU_PARC', 'DECLARANT', 'DOUANE', 'ADMIN'].includes(role);
  }

  /**
   * Configuration d'interface selon le rôle
   */
  getInterfaceConfig(): {
    canFilterByDeclarant: boolean;
    showGlobalView: boolean;
    title: string;
  } {
    const role = this.getCurrentUserRole();

    switch (role) {
      case 'DG':
      case 'DGA':
      case 'DIS':
      case 'CHEF_BUREAU_PARC':
      case 'DOUANE':
      case 'ADMIN':
        return {
          canFilterByDeclarant: true,
          showGlobalView: true,
          title: 'Vue Globale des Rendez-vous'
        };
      
      case 'DECLARANT':
        return {
          canFilterByDeclarant: false,
          showGlobalView: false,
          title: 'Mes Rendez-vous'
        };
      
      default:
        return {
          canFilterByDeclarant: false,
          showGlobalView: false,
          title: 'Rendez-vous'
        };
    }
  }
}

