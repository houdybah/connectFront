import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompositionLigne } from '../models/CompositionLigne';

@Injectable({
  providedIn: 'root'
})
export class CompositionService {
  private readonly apiUrl = `${environment.defaultauth}/api/composition-ligne`;

  constructor(private http: HttpClient) {}

  // GET /api/composition-ligne/all
  getAllCompositions(): Observable<CompositionLigne[]> {
    return this.http.get<CompositionLigne[]>(`${this.apiUrl}/all`);
  }

  // GET /api/composition-ligne/{uuid}
  getCompositionById(uuid: string): Observable<CompositionLigne> {
    return this.http.get<CompositionLigne>(`${this.apiUrl}/${uuid}`);
  }

  // GET /api/composition-ligne/ligne/{ligneUuid}
  getCompositionsByLigne(ligneUuid: string): Observable<CompositionLigne[]> {
    return this.http.get<CompositionLigne[]>(`${this.apiUrl}/ligne/${ligneUuid}`);
  }

  // GET /api/composition-ligne/camion-chauffeur/{camionChauffeurUuid}
  getCompositionsByCamionChauffeur(camionChauffeurUuid: string): Observable<CompositionLigne[]> {
    return this.http.get<CompositionLigne[]>(`${this.apiUrl}/camion-chauffeur/${camionChauffeurUuid}`);
  }

  // GET /api/composition-ligne/zone-station/{zoneStation}
  getCompositionsByZoneStation(zoneStation: string): Observable<CompositionLigne[]> {
    return this.http.get<CompositionLigne[]>(`${this.apiUrl}/zone-station/${zoneStation}`);
  }

  // GET /api/composition-ligne/ligne/{ligneUuid}/camion-chauffeur/{camionChauffeurUuid}
  getCompositionByLigneAndCamionChauffeur(ligneUuid: string, camionChauffeurUuid: string): Observable<CompositionLigne> {
    return this.http.get<CompositionLigne>(`${this.apiUrl}/ligne/${ligneUuid}/camion-chauffeur/${camionChauffeurUuid}`);
  }

  // POST /api/composition-ligne/create
  createComposition(composition: CompositionLigne): Observable<CompositionLigne> {
    return this.http.post<CompositionLigne>(`${this.apiUrl}/create`, composition);
  }

  // PUT /api/composition-ligne/update/{uuid}
  updateComposition(uuid: string, composition: CompositionLigne): Observable<CompositionLigne> {
    return this.http.put<CompositionLigne>(`${this.apiUrl}/update/${uuid}`, composition);
  }

  // DELETE /api/composition-ligne/delete/{uuid}
  deleteComposition(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  // Méthode utilitaire pour mettre à jour seulement la zone/station
  updateZoneStation(uuid: string, zoneStation: string): Observable<CompositionLigne> {
    const composition: Partial<CompositionLigne> = { zoneStation };
    return this.http.put<CompositionLigne>(`${this.apiUrl}/update/${uuid}`, composition);
  }
}



