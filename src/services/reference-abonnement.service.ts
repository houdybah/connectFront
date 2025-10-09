import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/models/Page';
import { PagedData } from 'src/models/paged-data';
import { ReferenceAbonnement } from 'src/models/reference-abonnement';

@Injectable({
  providedIn: 'root'
})
export class ReferenceAbonnementService {

  private readonly BASE_URL = `${environment.defaultauth}`;
   
     constructor(private http: HttpClient) {}
   
  
  
     getAlls(page: Page, key: string): Observable<PagedData<ReferenceAbonnement>> {
       const params = new HttpParams()
         .set('key', key) // Associe la clé au paramètre key
         .set('page', page.pageNumber.toString())
         .set('size', page.size.toString());   
       return this.http.get<PagedData<ReferenceAbonnement>>(`${this.BASE_URL}/api/ref-souscriptions/RefSouscription/all`, { params });
     }
  

getAll(page: Page, key?: string): Observable<PagedData<ReferenceAbonnement>> {
    let params = new HttpParams()
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());

    if (key) {
      params = params.set('key', key);
    }

    return this.http.get<PagedData<ReferenceAbonnement>>(`${this.BASE_URL}/api/ref-souscriptions/RefSouscription/all`, { params }).pipe(
      tap(response => console.log('Réponse brute du backend:', response)),
      map(response => {
        if (response.content && Array.isArray(response.content)) {
          response.content.forEach(user => {
            // Normaliser blocked comme booléen (true ou false)
           // user.blocked = user.blocked === true;
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








     
  
     
     delete(uuid: string): Observable<void> {
       return this.http.delete<void>(`${this.BASE_URL}/api/ref-souscriptions/RefSouscription/delete/${uuid}`);
     }
  
  
        // Créer un utilisateur
        create(entreprise: ReferenceAbonnement): Observable<ReferenceAbonnement> {
          return this.http.post<ReferenceAbonnement>(`${this.BASE_URL}/api/ref-souscriptions/RefSouscription/save`, entreprise);
      
      
        }
       // checkNifExists(nif: string, utilisateurUuid: string): Observable<boolean> {
        // return this.http.get<boolean>(`${this.BASE_URL}/EntreprisePayement/by-nif?nif=${nif}&utilisateurUuid=${utilisateurUuid}`);
      // }
       
  
  
  checkNifExists(nif: string, utilisateurUuid: string): Observable<boolean> {
    const token = 'moussa'; // idéalement via `environment`
    return this.http.get<boolean>(`${this.BASE_URL}/EntreprisePayement/by-nif?nif=${nif}&utilisateurUuid=${utilisateurUuid}&token=${token}`);
  }
  
 
  
  
       public updateNif(nifUtilisateur :ReferenceAbonnement) : Observable<ReferenceAbonnement> {
            return this.http.put<ReferenceAbonnement>(`${this.BASE_URL}/api/ref-souscriptions/RefSouscription/update/${nifUtilisateur.uuid}`, nifUtilisateur);
       
              
            }
}


