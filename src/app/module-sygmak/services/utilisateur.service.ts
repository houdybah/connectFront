import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnumRole } from 'src/models/enum-role';
import { Page } from 'src/models/Page';
import { PagedData } from 'src/models/paged-data';
import { Utilisateur } from 'src/models/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  
  searchUtilisateur(searchQuery: any, page: Page) {
    throw new Error('Method not implemented.');
  }

  private readonly BASE_URL = `${environment.defaultauth}`;

  constructor(private http: HttpClient) {}

  // Créer un utilisateur
  create(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.BASE_URL}/utilisateur`, utilisateur);

    
  }

// Dans UtilisateurService (Angular)
getUtilisateurConnecte(): Observable<Utilisateur> {
  return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/login`);
}




  getAlls(page:Page, key:String): Observable<PagedData<Utilisateur>> {
  return this.http.get<PagedData<Utilisateur>>(`${this.BASE_URL}/utilisateur?key=${key}&page=${page.pageNumber}&size=${page.size}`);
 }

 

  getAlle(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.BASE_URL}/utilisateur/all`);
  }
  





  

// getAll(page: Page, key?: string): Observable<PagedData<Utilisateur>> {
//   let params = new HttpParams()
//     .set('page', page.pageNumber.toString())
//     .set('size', page.size.toString());

//   if (key) {
//     params = params.set('key', key);
//   }

//   return this.http.get<PagedData<Utilisateur>>(`${this.BASE_URL}/utilisateur`, { params, responseType: 'text' as 'json' }).pipe(
//     tap(response => console.log('Réponse brute du backend:', response)),
//     map(response => JSON.parse(response as unknown as string)),
//     catchError(error => {
//       console.error('Erreur lors de la récupération des utilisateurs :', error);
//       return throwError(() => new Error('Erreur lors de la récupération des utilisateurs.'));
//     })
//   );
// }

getAll(page: Page, key?: string): Observable<PagedData<Utilisateur>> {
    let params = new HttpParams()
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());

    if (key) {
      params = params.set('key', key);
    }

    return this.http.get<PagedData<Utilisateur>>(`${this.BASE_URL}/utilisateur`, { params }).pipe(
      tap(response => console.log('Réponse brute du backend:', response)),
      map(response => {
        if (response.content && Array.isArray(response.content)) {
          response.content.forEach(user => {
            // Normaliser blocked comme booléen (true ou false)
            user.blocked = user.blocked === true;
          });
        }
        return response;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        return throwError(() => new Error('Erreur lors de la récupération des utilisateurs.'));
      })
    );
  }



// getAll(page: Page, key?: string): Observable<PagedData<Utilisateur>> {
//   let params = new HttpParams()
//     .set('page', page.pageNumber.toString())
//     .set('size', page.size.toString());

//   if (key) {
//     params = params.set('key', key);
//   }

//   return this.http.get<string>(`${this.BASE_URL}/utilisateur`, { params, responseType: 'text' as 'json' }).pipe(
//     tap(response => console.log('Réponse brute du backend:', response)),
//     map(response => {
//       // Parse la réponse en JSON
//       const parsedResponse = JSON.parse(response as unknown as string) as PagedData<Utilisateur>;
      
//       // Vérifier et normaliser la propriété blocked pour chaque utilisateur
//       if (parsedResponse.content && Array.isArray(parsedResponse.content)) {
//         parsedResponse.content.forEach(user => {
//           // Convertir explicitement en booléen (traite null, undefined, 0, "" comme false)
//           user.blocked = user.blocked === true;
//         });
//       }
      
//       return parsedResponse;
//     }),
//     catchError(error => {
//       console.error('Erreur lors de la récupération des utilisateurs :', error);
//       return throwError(() => new Error('Erreur lors de la récupération des utilisateurs.'));
//     })
//   );
// }

  // Récupérer tous les utilisateurs
  getAllEnum(): Observable<EnumRole[]> {
    return this.http.get<EnumRole[]>(`${this.BASE_URL}/marketeur`);
  }



  // Récupérer un utilisateur par son UUID
  getById(uuid: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/${uuid}`);
  }

 


  public update (utilisateur :Utilisateur) : Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/utilisateur/${utilisateur.uuid}`, utilisateur);
    
      
    }
   




   delete(uuid: string): Observable<void> {
     return this.http.delete<void>(`${this.BASE_URL}/utilisateur/delete/${uuid}`);
   }


  

  currentLogin(): Observable<Utilisateur>{
    return this.http.get<Utilisateur>(`${this.BASE_URL}/utilisateur/login`);
  }


deconnecter(uuid: string) {
  return this.http.post<Utilisateur>(`${this.BASE_URL}/${uuid}/deconnexion`, {});
}


  getUtilisateurByEmail(email: string): Observable<any> {
  return this.http.get<any>(`http://localhost:8090/utilisateurEmail/${encodeURIComponent(email)}`);
}






// block(uuid: string) {
//   return this.http.put(`${this.BASE_URL}/${uuid}/block`, {}, { responseType: 'text' });
// }

// unblock(uuid: string) {
//   return this.http.put(`${this.BASE_URL}/${uuid}/unblock`, {}, { responseType: 'text' });
// }





block(uuid: string): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/${uuid}/block`, {}).pipe(
      map(user => {
        // Normaliser blocked comme booléen
        user.blocked = true;
        return user;
      }),
      catchError(error => {
        console.error('Erreur lors du blocage de l\'utilisateur :', error);
        return throwError(() => new Error('Erreur lors du blocage de l\'utilisateur.'));
      })
    );
  }

  unblock(uuid: string): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.BASE_URL}/${uuid}/unblock`, {}).pipe(
      map(user => {
        // Normaliser blocked comme booléen
        user.blocked = false;
        return user;
      }),
      catchError(error => {
        console.error('Erreur lors du déblocage de l\'utilisateur :', error);
        return throwError(() => new Error('Erreur lors du déblocage de l\'utilisateur.'));
      })
    );
  }

}
