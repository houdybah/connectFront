import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  AuditLog, 
  LoginHistory, 
  Page, 
  ActionType, 
  LoginStats,
  AuditSearchFilter,
  LoginHistorySearchFilter
} from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly baseUrl = `${environment.defaultauth}/api/audit`;

  constructor(private readonly http: HttpClient) { }

  // ========== HISTORIQUE DES CONNEXIONS ==========

  /**
   * Récupère l'historique des connexions
   * Endpoint: GET /api/audit/login-history?email=xxx&page=0&size=20
   */
  getLoginHistory(email?: string, page: number = 0, size: number = 20): Observable<Page<LoginHistory>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (email) {
      params = params.set('email', email);
    }

    return this.http.get<Page<LoginHistory>>(`${this.baseUrl}/login-history`, { params });
  }

  /**
   * Récupère l'historique des connexions par application
   * Endpoint: GET /api/audit/login-history/application/{codeApp}
   */
  getLoginHistoryByApp(codeApp: string, page: number = 0, size: number = 20): Observable<Page<LoginHistory>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<LoginHistory>>(`${this.baseUrl}/login-history/application/${codeApp}`, { params });
  }

  /**
   * Récupère les connexions échouées
   * Endpoint: GET /api/audit/login-history/failed
   */
  getFailedLogins(page: number = 0, size: number = 20): Observable<Page<LoginHistory>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<LoginHistory>>(`${this.baseUrl}/login-history/failed`, { params });
  }

  /**
   * Récupère les statistiques de connexion d'un utilisateur
   * Endpoint: GET /api/audit/login-history/stats/{email}
   */
  getLoginStats(email: string): Observable<LoginStats> {
    return this.http.get<LoginStats>(`${this.baseUrl}/login-history/stats/${email}`);
  }

  // ========== AUDIT LOG ==========

  /**
   * Récupère tous les logs d'audit (paginés)
   * Endpoint: GET /api/audit/logs
   */
  getAuditLogs(page: number = 0, size: number = 20): Observable<Page<AuditLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AuditLog>>(`${this.baseUrl}/logs`, { params });
  }

  /**
   * Récupère les logs d'audit d'un utilisateur
   * Endpoint: GET /api/audit/logs/user/{email}
   */
  getAuditByUser(email: string, page: number = 0, size: number = 20): Observable<Page<AuditLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AuditLog>>(`${this.baseUrl}/logs/user/${email}`, { params });
  }

  /**
   * Récupère les logs d'audit d'une entité
   * Endpoint: GET /api/audit/logs/entity/{entityName}
   */
  getAuditByEntity(entityName: string, page: number = 0, size: number = 20): Observable<Page<AuditLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AuditLog>>(`${this.baseUrl}/logs/entity/${entityName}`, { params });
  }

  /**
   * Récupère l'historique complet d'une entité spécifique
   * Endpoint: GET /api/audit/logs/entity/{entityName}/{entityId}
   */
  getEntityHistory(entityName: string, entityId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/logs/entity/${entityName}/${entityId}`);
  }

  /**
   * Récupère les logs d'audit par type d'action
   * Endpoint: GET /api/audit/logs/action/{actionType}
   */
  getAuditByActionType(actionType: ActionType, page: number = 0, size: number = 20): Observable<Page<AuditLog>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AuditLog>>(`${this.baseUrl}/logs/action/${actionType}`, { params });
  }

  // ========== MÉTHODES UTILITAIRES ==========

  /**
   * Formate une date pour l'affichage
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Retourne une classe CSS en fonction du type d'action
   */
  getActionTypeClass(actionType: ActionType): string {
    const classMap: Record<ActionType, string> = {
      [ActionType.CREATE]: 'badge bg-success',
      [ActionType.READ]: 'badge bg-info',
      [ActionType.UPDATE]: 'badge bg-warning',
      [ActionType.DELETE]: 'badge bg-danger',
      [ActionType.LOGIN]: 'badge bg-primary',
      [ActionType.LOGOUT]: 'badge bg-secondary',
      [ActionType.ACCESS_GRANTED]: 'badge bg-success',
      [ActionType.ACCESS_DENIED]: 'badge bg-danger',
      [ActionType.EXPORT]: 'badge bg-info',
      [ActionType.IMPORT]: 'badge bg-info',
      [ActionType.CONFIG_CHANGE]: 'badge bg-warning'
    };
    return classMap[actionType] || 'badge bg-secondary';
  }

  /**
   * Retourne le libellé français d'un type d'action
   */
  getActionTypeLabel(actionType: ActionType): string {
    const labelMap: Record<ActionType, string> = {
      [ActionType.CREATE]: 'Création',
      [ActionType.READ]: 'Lecture',
      [ActionType.UPDATE]: 'Modification',
      [ActionType.DELETE]: 'Suppression',
      [ActionType.LOGIN]: 'Connexion',
      [ActionType.LOGOUT]: 'Déconnexion',
      [ActionType.ACCESS_GRANTED]: 'Accès accordé',
      [ActionType.ACCESS_DENIED]: 'Accès refusé',
      [ActionType.EXPORT]: 'Export',
      [ActionType.IMPORT]: 'Import',
      [ActionType.CONFIG_CHANGE]: 'Configuration'
    };
    return labelMap[actionType] || actionType;
  }
}

