import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entreprise } from 'src/models/entreprise';
import { Page } from 'src/models/Page';
import { PagedData } from 'src/models/paged-data';
import { RechargementSolde } from 'src/models/rechargement-solde';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
private readonly BASE_URL = `${environment.defaultauth}`;
 
   constructor(private http: HttpClient) {}
 


  //  getAll(page: Page, key: string): Observable<PagedData<RechargementSolde>> {
  //    const params = new HttpParams()
  //      .set('key', key) // Associe la clé au paramètre key
  //      .set('page', page.pageNumber.toString())
  //      .set('size', page.size.toString());   
  //    return this.http.get<PagedData<Entreprise>>(`${this.BASE_URL}/rechargements?token=moussa`, { params });
  //  }


//    getAll(page: Page, p0: string): Observable<RechargementSolde[]> {
//   return this.http.get<RechargementSolde[]>(`${this.BASE_URL}/rechargements?token=moussa`);
// }




getAll(page: Page, key: string): Observable<PagedData<Entreprise>> {
    const params = new HttpParams()
      .set('key', key)
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());

    return this.http.get<PagedData<Entreprise>>(
      `${this.BASE_URL}/EntreprisePayement/all`,
      { params }
    );
  }

// getAlls(page: Page, key: string): Observable<PagedData<RechargementSolde>> {
//   const params = new HttpParams()
//     .set('key', key)
//     .set('page', page.pageNumber.toString())
//     .set('size', page.size.toString())
//     .set('tokenParam', 'moussa');  // <- ici, utiliser le nom exact attendu

//   return this.http.get<PagedData<RechargementSolde>>(
//     `${this.BASE_URL}/rechargements`,
//     { params }
//   );
// }


getAlls(page: Page, key: string): Observable<PagedData<RechargementSolde>> {
  const params = new HttpParams()
    .set('key', key)
    .set('page', page.pageNumber.toString())
    .set('size', page.size.toString())
    .set('tokenParam', 'moussa');

  return this.http.get<PagedData<RechargementSolde>>(
    `${this.BASE_URL}/rechargements`,
    { params }
  );
}




// Modifier un rechargement existant
updateRechargement(uuid: string, rechargement: RechargementSolde): Observable<RechargementSolde> {
  const params = new HttpParams().set('tokenParam', 'moussa'); // Token requis par le backend
  return this.http.put<RechargementSolde>(
    `${this.BASE_URL}/rechargements/${uuid}`,
    rechargement,
    { params }
  );
}



recharger(entreprise: Entreprise): Observable<Entreprise> {
return this.http.put<Entreprise>(
    `${this.BASE_URL}/EntreprisePayement/recharger?token=moussa`,
    entreprise
);

}



   
   delete(uuid: string): Observable<void> {
     return this.http.delete<void>(`${this.BASE_URL}/EntreprisePayement/delete/${uuid}`);
   }


      // Créer un utilisateur
      create(entreprise: Entreprise): Observable<Entreprise> {
        return this.http.post<Entreprise>(`${this.BASE_URL}/EntreprisePayement/save`, entreprise);
    
    
      }
     // checkNifExists(nif: string, utilisateurUuid: string): Observable<boolean> {
      // return this.http.get<boolean>(`${this.BASE_URL}/EntreprisePayement/by-nif?nif=${nif}&utilisateurUuid=${utilisateurUuid}`);
    // }
     


checkNifExists(nif: string, utilisateurUuid: string): Observable<boolean> {
  const token = 'moussa'; // idéalement via `environment`
  return this.http.get<boolean>(`${this.BASE_URL}/EntreprisePayement/by-nif?nif=${nif}&utilisateurUuid=${utilisateurUuid}&token=${token}`);
}




     public updateNif(nifUtilisateur :Entreprise) : Observable<Entreprise> {
          return this.http.put<Entreprise>(`${this.BASE_URL}/EntreprisePayement/update/${nifUtilisateur.uuid}`, nifUtilisateur);
     
            
          }
}


