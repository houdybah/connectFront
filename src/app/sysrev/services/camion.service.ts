import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Camion, EnumTypeConteneur } from '../models/Camion';

@Injectable({
  providedIn: 'root'
})
export class CamionService {
  private readonly apiUrl = `${environment.defaultauth}/api/camion`;

  constructor(private http: HttpClient) {}

  // GET /api/camion/all
  getAllCamions(): Observable<Camion[]> {
    return this.http.get<Camion[]>(`${this.apiUrl}/all`);
  }

  // GET /api/camion/{uuid}
  getCamionById(uuid: string): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/${uuid}`);
  }

  // GET /api/camion/numero/{numero}
  getCamionByNumero(numero: string): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/numero/${numero}`);
  }

  // GET /api/camion/immatriculation/{immatriculation}
  getCamionByImmatriculation(immatriculation: string): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/immatriculation/${immatriculation}`);
  }

  // GET /api/camion/type-conteneur/{typeConteneur}
  getCamionsByTypeConteneur(typeConteneur: EnumTypeConteneur): Observable<Camion[]> {
    return this.http.get<Camion[]>(`${this.apiUrl}/type-conteneur/${typeConteneur}`);
  }

  // POST /api/camion/create
  createCamion(camion: Camion): Observable<Camion> {
    return this.http.post<Camion>(`${this.apiUrl}/create`, camion);
  }

  // PUT /api/camion/update/{uuid}
  updateCamion(uuid: string, camion: Camion): Observable<Camion> {
    return this.http.put<Camion>(`${this.apiUrl}/update/${uuid}`, camion);
  }

  // DELETE /api/camion/delete/{uuid}
  deleteCamion(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  // Méthode utilitaire pour obtenir les camions disponibles (si besoin)
  getCamionsDisponibles(): Observable<Camion[]> {
    // Pour l'instant retourne tous les camions
    // Vous pourrez ajouter un filtre côté backend plus tard
    return this.getAllCamions();
  }
}



