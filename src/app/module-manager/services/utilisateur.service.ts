import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/models/Page';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../models/Utilisateur';
import { PagedData } from 'src/models/PageData';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private readonly utilisateurNameUrl: string =`${environment.defaultauth}` + `/utilisateur`;

  constructor(private readonly http: HttpClient) { }

  public newUtilisateur (utilisateur : Utilisateur ) : Observable <Utilisateur> {
    return this.http.post<Utilisateur>(`${this.utilisateurNameUrl}`,utilisateur)
  }
  public updateUtilisateur(utilisateur : Utilisateur) : Observable <Utilisateur> {
    return this.http.put<Utilisateur> (`${this.utilisateurNameUrl}/${utilisateur.uuid}`,utilisateur)
  }
  public getOneUtilisateur(uuidUtilisateur : string): Observable  <Utilisateur> {
    return  this.http.get<Utilisateur>(`${this.utilisateurNameUrl}/${uuidUtilisateur}`)
  }
  public getAllUtilisateur () : Observable  <any> {
    return this.http.get<Utilisateur[]>(`${this.utilisateurNameUrl}`)
  }
  public deleteUtilisateur (uuidUtilisateur : string): Observable <any> {
    return this.http.delete<void>(`${this.utilisateurNameUrl}/${uuidUtilisateur}`)
  }

  getUtilisateurss(page:Page, key:string): Observable<PagedData<Utilisateur>> {
    // Encoder correctement le paramètre key pour l'URL
    const encodedKey = encodeURIComponent(key);
    let url = `${this.utilisateurNameUrl}?key=${encodedKey}&page=${page.pageNumber}&size=${page.size}`;
    
    console.log('📡 === APPEL API getUtilisateurss ===');
    console.log('Paramètre key reçu:', `"${key}"`);
    console.log('Paramètre key encodé:', `"${encodedKey}"`);
    console.log('URL complète:', url);
    
    return this.http.get<PagedData<Utilisateur>>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  public populateAndActuateUserAppLinks (): Observable <PagedData<Utilisateur>> {
    return  this.http.get<PagedData<Utilisateur>>(`${environment.defaultauth}/api/admin/populate-user-app-links`)
  }

}
