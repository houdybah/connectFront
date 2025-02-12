import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utilisateur } from 'src/models/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private readonly BASE_URL = `${environment.defaultauth}`;

  constructor(private http: HttpClient) {}

  // Créer un utilisateur
  create(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.BASE_URL}/utilisateur`, utilisateur);
  }

  // Récupérer tous les utilisateurs
  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.BASE_URL}/utilisateur`);
  }

  // Récupérer un utilisateur par son UUID
  getById(uuid: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/${uuid}`);
  }

  // Mettre à jour un utilisateur
  // update(uuid: string, utilisateur: Utilisateur): Observable<Utilisateur> {
  //   return this.http.put<Utilisateur>(`${this.BASE_URL}/utilisateur/${uuid}`, utilisateur);
  // }





  public update (utilisateur :Utilisateur) : Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/utilisateur/${utilisateur.uuid}`, utilisateur);
    
      
    }



  // Supprimer un utilisateur
  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/utilisateur/${uuid}`);
  }

  currentLogin(): Observable<Utilisateur>{
    return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/login`);
  }
}
