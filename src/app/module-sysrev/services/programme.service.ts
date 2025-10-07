import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Programme } from '../models/Programme';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService {
  private readonly apiUrl = `${environment.defaultauth}/programmes`;

  constructor(private http: HttpClient) {}

  getAllProgrammes(): Observable<Programme[]> {
    return this.http.get<Programme[]>(this.apiUrl);
  }

  getProgrammesWithPagination(page: number, size: number, date?: string, horaire?: string): Observable<PageResponse<Programme>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (date) {
      params = params.set('date', date);
    }
    if (horaire) {
      params = params.set('horaire', horaire);
    }
    
    return this.http.get<PageResponse<Programme>>(`${this.apiUrl}/paginated`, { params });
  }

  getProgrammeById(uuid: string): Observable<Programme> {
    return this.http.get<Programme>(`${this.apiUrl}/${uuid}`);
  }

  createProgramme(programme: Programme): Observable<Programme> {
    return this.http.post<Programme>(this.apiUrl, programme);
  }

  updateProgramme(uuid: string, programme: Programme): Observable<Programme> {
    return this.http.put<Programme>(`${this.apiUrl}/${uuid}`, programme);
  }

  deleteProgramme(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }

  getProgrammesByDate(date: string): Observable<Programme[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Programme[]>(`${this.apiUrl}/by-date`, { params });
  }
}



