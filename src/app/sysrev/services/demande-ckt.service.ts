import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemandeCKT } from '../models/DemandeCKT';

@Injectable({
  providedIn: 'root'
})
export class DemandeCKTService {
  private readonly apiUrl = `${environment.defaultauth}/api/demande-ckt`;

  constructor(private http: HttpClient) {}

  // ✅ Ajouter les headers avec token comme dans ConteneurService
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

  // ✅ Récupérer le rôle de l'utilisateur
  private getCurrentUserRole(): string {
    const role = sessionStorage.getItem('role') || '';
    return role.replace(/"/g, '');
  }

  // GET /api/demande-ckt/my-demandes (pour utilisateur CKT connecté)
  getMyDemandes(): Observable<DemandeCKT[]> {
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/my-demandes`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/all (pour ADMIN/DOUANE)
  getAllDemandeCKT(): Observable<DemandeCKT[]> {
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/{uuid}
  getDemandeCKTById(uuid: string): Observable<DemandeCKT> {
    return this.http.get<DemandeCKT>(`${this.apiUrl}/${uuid}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/numero/{numero}
  getDemandeCKTByNumero(numero: string): Observable<DemandeCKT> {
    return this.http.get<DemandeCKT>(`${this.apiUrl}/numero/${numero}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/date/{date}
  getDemandeCKTByDate(date: string): Observable<DemandeCKT[]> {
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/date/${date}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/date-between?startDate=xxx&endDate=xxx
  getDemandeCKTByDateBetween(startDate: string, endDate: string): Observable<DemandeCKT[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/date-between`, { 
      params,
      headers: this.getHeaders()
    });
  }

  // GET /api/demande-ckt/utilisateur/{utilisateurUuid} (pour ADMIN/DOUANE)
  getDemandeCKTByUtilisateur(utilisateurUuid: string): Observable<DemandeCKT[]> {
    return this.http.get<DemandeCKT[]>(`${this.apiUrl}/utilisateur/${utilisateurUuid}`, {
      headers: this.getHeaders()
    });
  }

  // POST /api/demande-ckt/create
  createDemandeCKT(demandeCKT: DemandeCKT): Observable<DemandeCKT> {
    console.log('📝 Création demande CKT avec rôle:', this.getCurrentUserRole());
    return this.http.post<DemandeCKT>(`${this.apiUrl}/create`, demandeCKT, {
      headers: this.getHeaders()
    });
  }

  // PUT /api/demande-ckt/update/{uuid}
  updateDemandeCKT(uuid: string, demandeCKT: DemandeCKT): Observable<DemandeCKT> {
    console.log('✏️ Mise à jour demande CKT avec rôle:', this.getCurrentUserRole());
    return this.http.put<DemandeCKT>(`${this.apiUrl}/update/${uuid}`, demandeCKT, {
      headers: this.getHeaders()
    });
  }

  // DELETE /api/demande-ckt/delete/{uuid}
  deleteDemandeCKT(uuid: string): Observable<void> {
    console.log('🗑️ Suppression demande CKT avec rôle:', this.getCurrentUserRole());
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Vérifications de rôle
  isCKT(): boolean {
    return this.getCurrentUserRole() === 'CKT';
  }

  isAdminOrDouane(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ADMIN' || role === 'DOUANE';
  }
}



