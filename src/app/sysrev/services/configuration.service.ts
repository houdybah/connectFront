import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConfigurationHoraire {
  uuid?: string;
  heureDebutMatin: string;
  heureFinMatin: string;
  heureDebutApresMidi: string;
  heureFinApresMidi: string;
  dureeLigne: number; // en minutes
  capaciteParDefaut: number;
  pauseEntreHoraires: number; // en minutes
  joursOuvrables: string[]; // ['LUNDI', 'MARDI', etc.]
  derniereModification?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private  readonly  apiUrl = `${environment.defaultauth}/configuration`;

  constructor(private http: HttpClient) {}

  getConfiguration(): Observable<ConfigurationHoraire> {
    return this.http.get<ConfigurationHoraire>(`${this.apiUrl}/horaires`);
  }

  updateConfiguration(config: ConfigurationHoraire): Observable<ConfigurationHoraire> {
    return this.http.put<ConfigurationHoraire>(`${this.apiUrl}/horaires`, config);
  }

  resetToDefault(): Observable<ConfigurationHoraire> {
    return this.http.post<ConfigurationHoraire>(`${this.apiUrl}/horaires/reset`, {});
  }
}

