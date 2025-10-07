import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chauffeur } from '../models/Chauffeur';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {
  private readonly apiUrl = `${environment.defaultauth}/api/chauffeur`;

  constructor(private http: HttpClient) {}

  getAllChauffeurs(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/all`);
  }

  getChauffeursWithPagination(page: number, size: number): Observable<PageResponse<Chauffeur>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Chauffeur>>(`${this.apiUrl}/paginated`, { params });
  }

  getChauffeurById(uuid: string): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/${uuid}`);
  }

  createChauffeur(chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(`${this.apiUrl}/create`, chauffeur);
  }

  updateChauffeur(uuid: string, chauffeur: Chauffeur): Observable<Chauffeur> {
    return this.http.put<Chauffeur>(`${this.apiUrl}/update/${uuid}`, chauffeur);
  }

  deleteChauffeur(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid}`);
  }

  searchChauffeurs(keyword: string): Observable<Chauffeur[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/search`, { params });
  }

  getChauffeursDisponibles(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/disponibles`);
  }

  getChauffeursActifs(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/actifs`);
  }

  uploadPhoto(uuid: string, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post(`${this.apiUrl}/${uuid}/photo`, formData);
  }
}



