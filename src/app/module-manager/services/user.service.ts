import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserApplicationAccess } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.defaultauth}/api/utilisateur`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers(): Observable<User[]> {
    console.log('📡 Appel API getAllUsers:', this.baseUrl);
    return this.http.get<User[]>(this.baseUrl);
  }

  /**
   * Récupère un utilisateur par son UUID
   */
  getUserByUuid(uuid: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${uuid}`);
  }

  /**
   * Crée un nouvel utilisateur
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  /**
   * Met à jour un utilisateur
   */
  updateUser(uuid: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${uuid}`, user);
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }

  /**
   * Active ou désactive un utilisateur
   */
  toggleUserStatus(uuid: string, enabled: boolean): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${uuid}/status`, { enabled });
  }

  /**
   * Récupère les applications accessibles par un utilisateur
   */
  getUserApplications(userUuid: string): Observable<UserApplicationAccess[]> {
    return this.http.get<UserApplicationAccess[]>(`${this.baseUrl}/${userUuid}/applications`);
  }

  /**
   * Accorde l'accès à une application pour un utilisateur
   */
  grantApplicationAccess(userUuid: string, applicationUuid: string): Observable<UserApplicationAccess> {
    return this.http.post<UserApplicationAccess>(
      `${this.baseUrl}/${userUuid}/applications/${applicationUuid}/grant`,
      {}
    );
  }

  /**
   * Révoque l'accès à une application pour un utilisateur
   */
  revokeApplicationAccess(userUuid: string, applicationUuid: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${userUuid}/applications/${applicationUuid}/revoke`
    );
  }

  /**
   * Recherche des utilisateurs par nom, prénom ou email
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<User[]>(`${this.baseUrl}/search`, { params });
  }
}

