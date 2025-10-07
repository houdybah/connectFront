import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemandeCKT } from '../models/DemandeCKT';
import { Ligne } from '../models/Ligne';
import { CompositionLigne } from '../models/CompositionLigne';

export interface CamionChauffeur {
  uuid: string;
  // Ajoutez les autres propriétés selon votre modèle
}

export interface TraiterDemandeResponse {
  message: string;
  lignes: Ligne[];
}

export interface AssignerCamionResponse {
  message: string;
  composition: CompositionLigne;
}

export interface AssignerRendezVousResponse {
  message: string;
  ligneUuid: string;
  rendezVousAssignes: string[];
  nombreRendezVousAssignes: number;
}

export interface ChangerStatutResponse {
  message: string;
  ligne: Ligne;
}

export interface DashboardSDT {
  demandesEnAttente: DemandeCKT[];
  mesLignes: Ligne[];
  camionsChauffeursDisponibles: CamionChauffeur[];
  statistiques: {
    nombreDemandesEnAttente: number;
    nombreMesLignes: number;
    nombreCamionsDisponibles: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SDTService {
  private readonly apiUrl = `${environment.defaultauth}/api/sdt`;

  constructor(private http: HttpClient) {}

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

  private getCurrentUserRole(): string {
    const role = sessionStorage.getItem('role') || '';
    return role.replace(/"/g, '');
  }

  traiterDemandeCKT(demandeCKTUuid: string,lignes: Ligne[]): Observable<TraiterDemandeResponse> {
    console.log('🔧 Traitement demande CKT avec rôle:', this.getCurrentUserRole());
    return this.http.post<TraiterDemandeResponse>(
      `${this.apiUrl}/traiter-demande/${demandeCKTUuid}`,lignes,
      
      { headers: this.getHeaders() }
    );
  }

  assignerCamionChauffeur(
    ligneUuid: string,
    camionChauffeurUuid: string,
    zoneStation: string
  ): Observable<AssignerCamionResponse> {
    const params = new HttpParams()
      .set('ligneUuid', ligneUuid)
      .set('camionChauffeurUuid', camionChauffeurUuid)
      .set('zoneStation', zoneStation);

    return this.http.post<AssignerCamionResponse>(
      `${this.apiUrl}/assigner-camion-chauffeur`,
      {},
      { params, headers: this.getHeaders() }
    );
  }

  getDemandesEnAttente(): Observable<DemandeCKT[]> {
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/demandes-en-attente`, {
      headers: this.getHeaders()
    });
  }

  getMesLignes(): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/mes-lignes`, {
      headers: this.getHeaders()
    });
  }

  getCamionsChauffeursDisponibles(): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/camions-chauffeurs-disponibles`, {
      headers: this.getHeaders()
    });
  }

  changerStatutLigne(ligneUuid: string, nouveauStatut: string): Observable<ChangerStatutResponse> {
    const params = new HttpParams().set('nouveauStatut', nouveauStatut);
    return this.http.put<ChangerStatutResponse>(
      `${this.apiUrl}/changer-statut-ligne/${ligneUuid}`,
      {},
      { params, headers: this.getHeaders() }
    );
  }

  getDashboard(): Observable<DashboardSDT> {
    console.log('📊 Récupération dashboard SDT avec rôle:', this.getCurrentUserRole());
    return this.http.get<DashboardSDT>(`${this.apiUrl}/dashboard`, {
      headers: this.getHeaders()
    });
  }

  assignerRendezVousALigne(
    ligneUuid: string,
    camionChauffeurUuid: string,
    zoneStation: string,
    numeroLigne: string,
    position: string,
    rendezVousUuids: string[]
  ): Observable<AssignerRendezVousResponse> {
    const body = {
      ligneUuid,
      camionChauffeurUuid,
      zoneStation,
      numeroLigne,
      position,
      rendezVousUuids
    };

    return this.http.post<AssignerRendezVousResponse>(
      `${this.apiUrl}/assigner-rendez-vous-ligne`,
      body,
      { headers: this.getHeaders() }
    );
  }

  isSDT(): boolean {
    return this.getCurrentUserRole() === 'SDT';
  }
}



