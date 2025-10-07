import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserPage } from '../models/user';
import { Utilisateur } from '../models/Utilisateur';
import { UtilisateurPage } from '../models/UtilisateurPage';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private readonly BASE_URL = `${environment.defaultauth}/api/utilisateurs`;

  constructor(private http: HttpClient) {}

  // Créer un utilisateur
  create(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.BASE_URL}/utilisateur`, utilisateur);
  }

  // Récupérer tous les utilisateurs
  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.BASE_URL}/utilisateur`);
  }

  // Récupérer un utilisateur par son UUID
  getById(uuid: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/${uuid}`);
  }

  // Mettre à jour un utilisateur
  update(uuid: string, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/update/${uuid}`, utilisateur);
  }

  // Supprimer un utilisateur
  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/delete/${uuid}`);
  }

  currentLogin(): Observable<Utilisateur>{
    return this.http.get<Utilisateur>(`${this.BASE_URL}/current`);
  }


  getEmailOrPhone(key:string): Observable<Utilisateur>{
    console.log(key)
    return this.http.get<Utilisateur>(`${this.BASE_URL}/check/emailOrPhone/${key}`);
  }



  // Récupérer la liste des utilisateurs avec pagination et recherche
  getUtilisateurs(page: number = 0, size: number = 10, search: string = ''): Observable<UtilisateurPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('keyword', search);
    }
    
    return this.http.get<UtilisateurPage>(`${this.BASE_URL}/page`, { params });
  }

  // Ajouter un utilisateur avec photo
  addUser(userData: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.BASE_URL}/create`, userData);
  }

  // Bloquer/débloquer un utilisateur
  toggleUserBlock(userId: string, blocked: boolean): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/${userId}/toggle-enabled`, { blocked });
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${userId}`);
  }
  // Mettre à jour le mot de passe
updatePassword(uuid: string, oldPassword: string, newPassword: string): Observable<any> {
  const url = `${this.BASE_URL}/${uuid}/password`;
  const body = { oldPassword, newPassword };
  
  console.log('🔗 URL appelée:', url);
  console.log('📤 Données envoyées:', { oldPassword: '***', newPassword: '***' });
  
  return this.http.put(url, body);
}

// Mettre à jour les informations de l'utilisateur
updateUser(uuid: string, userData: any): Observable<Utilisateur> {
  return this.http.put<Utilisateur>(`${this.BASE_URL}/${uuid}`, userData);
}

// **NOUVELLE MÉTHODE SIMPLE** : Vérifier si l'utilisateur doit changer son mot de passe
shouldChangePassword(user: any): boolean {
  // **VERSION SIMPLE** qui évite les erreurs TypeScript
  try {
    // Vérifier les flags de base (s'ils existent)
    if (user?.firstLogin === true || user?.requirePasswordChange === true) {
      return true;
    }
    
    // **POUR TESTER** : Décommentez cette ligne
    // return true;
    
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du changement de mot de passe:', error);
    return false;
  }
}


// Récupérer l'utilisateur actuel
getCurrentUser(): Observable<Utilisateur> {
  return this.http.get<Utilisateur>(`${this.BASE_URL}/current`);
}

// Marquer que l'utilisateur a changé son mot de passe (optionnel, si vous l'implémentez dans le backend)
markPasswordChanged(uuid: string): Observable<Utilisateur> {
  return this.http.put<Utilisateur>(`${this.BASE_URL}/${uuid}/password-changed`, {});
}

// **MÉTHODE ALTERNATIVE** : Pour contourner complètement les problèmes de typage
checkIfPasswordChangeNeeded(userEmail: string): Observable<boolean> {
  // Cette méthode pourrait appeler votre backend pour vérifier
  // Pour l'instant, retourne false par défaut
  return new Observable(observer => {
    observer.next(false); // Changez en true pour tester
    observer.complete();
  });
}
}




