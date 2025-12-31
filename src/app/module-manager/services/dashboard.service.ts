import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  DashboardStats, 
  ApplicationStats, 
  UserStats, 
  ConnectionLog 
} from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.defaultauth}/api/dashboard`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Récupère les statistiques globales du dashboard
   * Endpoint: GET /api/dashboard/stats
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  /**
   * Récupère les statistiques par application (ancienne méthode - conservée)
   */
  getApplicationStats(): Observable<ApplicationStats[]> {
    return this.http.get<ApplicationStats[]>(`${this.baseUrl}/applications/stats`);
  }

  /**
   * Récupère les statistiques par utilisateur (ancienne méthode - conservée)
   */
  getUserStats(limit: number = 10): Observable<UserStats[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<UserStats[]>(`${this.baseUrl}/users/stats`, { params });
  }

  /**
   * Récupère l'historique des connexions (ancienne méthode - conservée)
   */
  getConnectionLogs(page: number = 0, size: number = 20): Observable<ConnectionLog[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ConnectionLog[]>(`${this.baseUrl}/connections`, { params });
  }

  /**
   * Récupère les connexions récentes (ancienne méthode - conservée)
   */
  getRecentConnections(limit: number = 10): Observable<ConnectionLog[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ConnectionLog[]>(`${this.baseUrl}/connections/recent`, { params });
  }

  /**
   * Récupère les statistiques de connexion par période (ancienne méthode - conservée)
   */
  getConnectionsByPeriod(period: 'day' | 'week' | 'month'): Observable<any> {
    const params = new HttpParams().set('period', period);
    return this.http.get<any>(`${this.baseUrl}/connections/by-period`, { params });
  }
}

