import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatistiqueRapportDTO {
  codeOffice: string;         // d.code_office
  office: string;             // d.office  
  dateStr: string;            // 'RESUME'
  conteneurs20Pieds: number;  // COUNT(CASE WHEN LOWER(dac.type_conteneur) LIKE '%20%'...)
  conteneurs40Pieds: number;  // COUNT(CASE WHEN LOWER(dac.type_conteneur) LIKE '%40%'...)
  
  // Pour compatibilité avec d'autres formats si nécessaire
  bureau?: string;
  tc20?: number;
  tc40?: number;
  totalConteneurs?: number;
}

export interface StatistiqueConteneurDTO {
  codeOffice: string,
    office: string,
    dateStr: string,
    conteneurs20Pieds: number,
    conteneurs40Pieds: number,
    totalConteneurs: number
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesDouaneService {
  // URL de base qui correspond exactement à votre contrôleur
  private readonly BASE_URL = `${environment.defaultauth}/api/statistiquesDouane`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les statistiques pour une période donnée
   * Correspond à l'endpoint: GET /api/statistiquesDouane/rapport-periode
   */
  getStatistiquesPeriode(dateDebut: string, dateFin: string): Observable<StatistiqueRapportDTO[]> {
    console.log('🚀 Appel API Période - URL:', `${this.BASE_URL}/rapport-periode`);
    console.log('📅 Dates:', { dateDebut, dateFin });

    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);

    console.log('🔗 URL complète:', `${this.BASE_URL}/rapport-periode?${params.toString()}`);

    return this.http.get<StatistiqueRapportDTO[]>(`${this.BASE_URL}/rapport-periode`, { 
      params,
      observe: 'body',
      responseType: 'json'
    });
  }

  /**
   * Récupère le rapport journalier pour une date donnée
   * Correspond à l'endpoint: GET /api/statistiquesDouane/rapport-journalier
   */
  getRapportJournalier(date: string): Observable<StatistiqueRapportDTO[]> {
    console.log('🚀 Appel API Journalier - URL:', `${this.BASE_URL}/rapport-journalier`);
    console.log('📅 Date:', date);

    const params = new HttpParams().set('date', date);
    console.log('🔗 URL complète:', `${this.BASE_URL}/rapport-journalier?${params.toString()}`);

    return this.http.get<StatistiqueRapportDTO[]>(`${this.BASE_URL}/rapport-journalier`, { 
      params,
      observe: 'body',
      responseType: 'json'
    });
  }

  /**
   * Récupère les statistiques d'aujourd'hui
   * Correspond à l'endpoint: GET /api/statistiquesDouane/aujourd-hui
   */
  getStatistiquesAujourdhui(): Observable<StatistiqueConteneurDTO[]> {
    console.log('🚀 Appel API Aujourd\'hui - URL:', `${this.BASE_URL}/aujourd-hui`);

    return this.http.get<StatistiqueConteneurDTO[]>(`${this.BASE_URL}/aujourd-hui`, {
      observe: 'body',
      responseType: 'json'
    });
  }

  /**
   * Méthode utilitaire pour tester la connexion
   */
  testConnexion(): Observable<any> {
    console.log('🔍 Test de connexion vers:', this.BASE_URL);
    return this.http.get(`${this.BASE_URL}/aujourd-hui`);
  }
}

