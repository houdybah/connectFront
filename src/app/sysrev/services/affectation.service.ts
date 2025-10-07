import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CamionChauffeur, EnumStatusCamionChauffeur, EnumStatusEtat } from '../models/CamionChauffeur';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
  private readonly apiUrl = `${environment.defaultauth}/api/camion-chauffeur`;

  constructor(private http: HttpClient) {}

  // GET /api/camion-chauffeur/all
  getAllAffectations(): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/all`);
  }

  // GET /api/camion-chauffeur/{uuid}
  getAffectationById(uuid: string): Observable<CamionChauffeur> {
    return this.http.get<CamionChauffeur>(`${this.apiUrl}/${uuid}`);
  }

  // GET /api/camion-chauffeur/camion/{camionUuid}
  getAffectationsByCamion(camionUuid: string): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/camion/${camionUuid}`);
  }

  // GET /api/camion-chauffeur/chauffeur/{chauffeurUuid}
  getAffectationsByChauffeur(chauffeurUuid: string): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/chauffeur/${chauffeurUuid}`);
  }

  // GET /api/camion-chauffeur/status/{status}
  getAffectationsByStatus(status: EnumStatusCamionChauffeur): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/status/${status}`);
  }

  // GET /api/camion-chauffeur/status-etat/{statusEtat}
  getAffectationsByStatusEtat(statusEtat: EnumStatusEtat): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/status-etat/${statusEtat}`);
  }

  // GET /api/camion-chauffeur/camion/{camionUuid}/chauffeur/{chauffeurUuid}
  getAffectationByCamionAndChauffeur(camionUuid: string, chauffeurUuid: string): Observable<CamionChauffeur> {
    return this.http.get<CamionChauffeur>(`${this.apiUrl}/camion/${camionUuid}/chauffeur/${chauffeurUuid}`);
  }

  // POST /api/camion-chauffeur/create
  createAffectation(affectation: CamionChauffeur): Observable<CamionChauffeur> {
    return this.http.post<CamionChauffeur>(`${this.apiUrl}/create`, affectation);
  }

  // PUT /api/camion-chauffeur/update/{uuid}
  updateAffectation(uuid: string, affectation: CamionChauffeur): Observable<CamionChauffeur> {
    return this.http.put<CamionChauffeur>(`${this.apiUrl}/update/${uuid}`, affectation);
  }

  // DELETE /api/camion-chauffeur/delete/{uuid}
  deleteAffectation(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  getByStatus(status: string): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/status/${status}`);
  }

  getByStatusEtat(statusEtat: string): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/status-etat/${statusEtat}`);
  }
  // Méthodes utilitaires
  getAffectationsDisponibles(): Observable<CamionChauffeur[]> {
    return this.getAffectationsByStatusEtat(EnumStatusEtat.DISPONIBLE);
  }

  getAffectationsActives(): Observable<CamionChauffeur[]> {
    return this.getAffectationsByStatus(EnumStatusCamionChauffeur.ACTIF);
  }
  getDisponiblesPourLigne(ligneUuid: string): Observable<CamionChauffeur[]> {
    return this.http.get<CamionChauffeur[]>(`${this.apiUrl}/disponibles-pour-ligne/${ligneUuid}`);
  }
}



