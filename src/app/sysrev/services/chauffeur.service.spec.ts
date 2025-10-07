import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chauffeur } from '../models/Chauffeur';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  private readonly apiUrl = `${environment.defaultauth}/api/chauffeur`;

  constructor(private http: HttpClient) {}

  // GET /api/chauffeur/all
  getAllChauffeurs(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/all`);
  }

  // GET /api/chauffeur/{uuid}
  getChauffeurById(uuid: string): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/${uuid}`);
  }

  // GET /api/chauffeur/permis/{permis}
  getChauffeurByPermis(permis: string): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/permis/${permis}`);
  }

  // GET /api/chauffeur/phone/{phone}
  getChauffeurByPhone(phone: string): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/phone/${phone}`);
  }

  // GET /api/chauffeur/email/{email}
  getChauffeurByEmail(email: string): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/email/${email}`);
  }

  // POST /api/chauffeur/create
  createChauffeur(chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(`${this.apiUrl}/create`, chauffeur);
  }

  // PUT /api/chauffeur/update/{uuid}
  updateChauffeur(uuid: string, chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.put<Chauffeur>(`${this.apiUrl}/update/${uuid}`, chauffeur);
  }

  // DELETE /api/chauffeur/delete/{uuid}
  deleteChauffeur(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  // Méthode utilitaire pour obtenir les chauffeurs disponibles (si besoin)
  getChauffeursDisponibles(): Observable<Chauffeur[]> {
    // Pour l'instant retourne tous les chauffeurs
    // Vous pourrez ajouter un filtre côté backend plus tard
    return this.getAllChauffeurs();
  }
}



