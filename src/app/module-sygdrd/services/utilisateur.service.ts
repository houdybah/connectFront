import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Page} from "../models/Page";
import {Utilisateur} from "../models/Utilisateur";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private readonly utilisateurNameUrl: string =`${environment.defaultauth}` + `/utilisateur`;

  constructor(private http : HttpClient) { }

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

  getUtilisateurss(page:Page, key:String): Observable<any> {
    let url = `${this.utilisateurNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
}







