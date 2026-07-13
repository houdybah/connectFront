import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attribut } from '../models/Attribut';

@Injectable({
  providedIn: 'root'
})
export class AttributService {
  private baseUrl = `${environment.apiUrl}/attribut`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  createAttribut(attribut: Attribut): Observable<Attribut> {
    return this.http.post<Attribut>(this.baseUrl, attribut, this.httpOptions);
  }

  updateAttribut(uuid: string, attribut: Attribut): Observable<Attribut> {
    return this.http.put<Attribut>(`${this.baseUrl}/${uuid}`, attribut, this.httpOptions);
  }

  deleteAttribut(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }

  getAttributByUuid(uuid: string): Observable<Attribut> {
    return this.http.get<Attribut>(`${this.baseUrl}/${uuid}`);
  }

  getAttributsByUtilisateur(uuidUtilisateur: string): Observable<Attribut[]> {
    return this.http.get<Attribut[]>(`${this.baseUrl}/utilisateur/${uuidUtilisateur}`);
  }

  getAttributByUtilisateurAndCle(uuidUtilisateur: string, cle: string): Observable<Attribut> {
    return this.http.get<Attribut>(`${this.baseUrl}/utilisateur/${uuidUtilisateur}/cle/${cle}`);
  }
}

