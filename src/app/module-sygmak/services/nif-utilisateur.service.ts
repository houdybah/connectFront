import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Abonnement } from '../models/abonnement';
import { Entreprise } from '../models/entreprise';
import { NifUtilisateur } from '../models/nif-utilisateur';
import { Page } from '../models/Page';
import { PagedData } from '../models/paged-data';
import { Utilisateur } from '../models/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class NifUtilisateurService {

  private readonly BASE_URL = `${environment.defaultauth}`;
 
   constructor(private http: HttpClient) {}
 
  
   // Créer un utilisateur
   create(nifUtilisateur: NifUtilisateur): Observable<NifUtilisateur> {
     return this.http.post<NifUtilisateur>(`${this.BASE_URL}/NifUtilisateur/save`, nifUtilisateur);
 
     
   }
   checkNifExists(nif: string, utilisateurUuid: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/NifUtilisateur/exists?nif=${nif}&utilisateurUuid=${utilisateurUuid}`);
  }
  
 

//http://localhost:8090/NifUtilisateur/all?key=1&page=0&size=10
 getAll(page: Page, key: string): Observable<PagedData<NifUtilisateur>> {
   const params = new HttpParams()
     .set('key', key) // Associe la clé au paramètre key
     .set('page', page.pageNumber.toString())
     .set('size', page.size.toString());   
   return this.http.get<PagedData<NifUtilisateur>>(`${this.BASE_URL}/NifUtilisateur/all`, { params });
 }
 




   // Récupérer un utilisateur par son UUID
  //  getById(nif: string): Observable<NifUtilisateur> {
  //    return this.http.get<NifUtilisateur>(`${this.BASE_URL}/NifUtilisateur/byUtilisateurs/${nif}`);
  //  }
 

   getByNif(nif: string): Observable<NifUtilisateur[]> {
  return this.http.get<NifUtilisateur[]>(`${this.BASE_URL}/NifUtilisateur/byUtilisateurs/${nif}`);
}

  
//http://localhost:8090/NifUtilisateur/byUtilisateurs/6050761321L
 
   public updateNif(nifUtilisateur :NifUtilisateur) : Observable<NifUtilisateur> {
     return this.http.put<NifUtilisateur>(`${this.BASE_URL}/NifUtilisateur/update/${nifUtilisateur.uuid}`, nifUtilisateur);

       
     }
     
 

   delete(uuid: string): Observable<void> {
     return this.http.delete<void>(`${this.BASE_URL}/NifUtilisateur/delete/${uuid}`);
   }

   getAlles(): Observable<NifUtilisateur[]> {
        return this.http.get<NifUtilisateur[]>(`${this.BASE_URL}/NifUtilisateur/alle`);
      }
      
      // getAlle(): Observable<NifUtilisateur[]> {
      //   return this.http.get<NifUtilisateur[]>(`${this.BASE_URL}/AllNif`);
      // }

      // getAlle(value: string): Observable<NifUtilisateur[]> {
      //   return this.http.get<NifUtilisateur[]>(`${this.BASE_URL}/api/oracle/AllNif`);
      // }
     
      // getAlle(value?: string): Observable<NifUtilisateur[]> {
      //   return this.http.get<NifUtilisateur[]>(`${this.BASE_URL}/api/oracle/AllNif`);
      // }



      // getAlless(value: string = '', page: number = 0, size: number = 20): Observable<NifUtilisateur[]> {
      //   const url = `${this.BASE_URL}/api/oracle/AllNif?nif=${value}&page=${page}&size=${size}`;
      //   return this.http.get<NifUtilisateur[]>(url);
      // }

      getAlle(value: string = '', page: number = 0, size: number = 20): Observable<Utilisateur[]> {
        const url = `${this.BASE_URL}/api/oracle/AllNif?nif=${value}&page=${page}&size=${size}`;
        return this.http.get<Utilisateur[]>(url);
      }


      getAlld(value: string = ''): Observable<Utilisateur[]> {
        const url = `${this.BASE_URL}/autocomplete-nif?search=${value}`;
        return this.http.get<Utilisateur[]>(url);
      }

         getAllds(value: string = ''): Observable<Entreprise[]> {
        const url = `${this.BASE_URL}/autocomplete-nif?search=${value}`;
        return this.http.get<Entreprise[]>(url);
      }

        getAlless(value: string = '', page: number = 0, size: number = 20): Observable<Entreprise[]> {
        const url = `${this.BASE_URL}/api/oracle/AllNif?nif=${value}&page=${page}&size=${size}`;
        return this.http.get<Entreprise[]>(url);
      }


         getAllesss(value: string = '', page: number = 0, size: number = 20): Observable<Abonnement[]> {
        const url = `${this.BASE_URL}/api/oracle/AllNif?nif=${value}&page=${page}&size=${size}`;
        return this.http.get<Abonnement[]>(url);
      }

         getAllnomclature(value: string = '', page: number = 0, size: number = 20): Observable<Utilisateur[]> {
        const url = `${this.BASE_URL}/api/oracle/nomenclatures?nomenclature=${value}&page=${page}&size=${size}`;
        return this.http.get<Utilisateur[]>(url);
      }
   
    
    
      searchNif(query: string): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(`/api/nif/search?query=${query}`);
      }
      
 
}
