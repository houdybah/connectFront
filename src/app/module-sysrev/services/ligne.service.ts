import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ligne, EnumStatusLigne } from '../models/Ligne';

@Injectable({
  providedIn: 'root'
})
export class LigneService {
  private readonly apiUrl = `${environment.defaultauth}/api/ligne`;

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

  // GET /api/ligne/my-lignes (pour SDT connecté)
  getMyLignes(): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/my-lignes`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/all (pour ADMIN/DOUANE)
  getAllLignes(): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/{uuid}
  getLigneById(uuid: string): Observable<Ligne> {
    return this.http.get<Ligne>(`${this.apiUrl}/${uuid}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/numero/{numero}
  getLigneByNumero(numero: string): Observable<Ligne> {
    return this.http.get<Ligne>(`${this.apiUrl}/numero/${numero}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/demande-ckt/{demandeCKTUuid}
  getLignesByDemandeCKT(demandeCKTUuid: string): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/demande-ckt/${demandeCKTUuid}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/status/{status}
  getLignesByStatus(status: EnumStatusLigne): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/status/${status}`, {
      headers: this.getHeaders()
    });
  }

  // GET /api/ligne/date/{date}
  getLignesByDate(date: string): Observable<Ligne[]> {
    return this.http.get<Ligne[]>(`${this.apiUrl}/date/${date}`, {
      headers: this.getHeaders()
    });
  }

  // POST /api/ligne/create
  createLigne(ligne: Ligne): Observable<Ligne> {
    console.log('📝 Création ligne avec rôle:', this.getCurrentUserRole());
    return this.http.post<Ligne>(`${this.apiUrl}/create`, ligne, {
      headers: this.getHeaders()
    });
  }

  // PUT /api/ligne/update/{uuid}
  updateLigne(uuid: string, ligne: Ligne): Observable<Ligne> {
    console.log('✏️ Mise à jour ligne avec rôle:', this.getCurrentUserRole());
    return this.http.put<Ligne>(`${this.apiUrl}/update/${uuid}`, ligne, {
      headers: this.getHeaders()
    });
  }

  // DELETE /api/ligne/delete/{uuid}
  deleteLigne(uuid: string): Observable<void> {
    console.log('🗑️ Suppression ligne avec rôle:', this.getCurrentUserRole());
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`, {
      headers: this.getHeaders()
    });
  }

  // Vérifications de rôle
  isSDT(): boolean {
    return this.getCurrentUserRole() === 'SDT';
  }

  isAdminOrDouane(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ADMIN' || role === 'DOUANE';
  }
}



