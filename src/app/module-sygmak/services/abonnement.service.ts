import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Abonnement } from '../models/abonnement';
import { Page } from '../models/Page';
import { PagedData } from '../models/paged-data';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {

  private readonly BASE_URL = `${environment.defaultauth}`;

  constructor(private http: HttpClient) {}

  // getAll(page: Page, key: string): Observable<PagedData<Abonnement>> {
  //   const params = new HttpParams()
  //     .set('key', key)
  //     .set('page', page.pageNumber.toString())
  //     .set('size', page.size.toString());
  //   return this.http.get<PagedData<Abonnement>>(`${this.BASE_URL}/api/souscriptions/souscription/all`, { params });
  // }



  getAll(page: Page, key: string): Observable<PagedData<Abonnement>> {
  const params = new HttpParams()
    .set('key', key)
    .set('page', page.pageNumber.toString())
    .set('size', page.size.toString());

  return this.http.get<PagedData<Abonnement>>(
    `${this.BASE_URL}/api/souscriptions/souscription/all`,
    { params }
  );
}



  getById(uuid: string): Observable<Abonnement> {
  const params = new HttpParams().set('id', uuid);
  return this.http.get<Abonnement>(`${this.BASE_URL}/api/souscriptions/souscription`, { params });
}


  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/api/souscriptions/souscription/delete/${uuid}`);
  }

  create(entreprise: Abonnement): Observable<Abonnement> {
    return this.http.post<Abonnement>(`${this.BASE_URL}/api/souscriptions/souscription/save`, entreprise);
  }

  updateNif(nifUtilisateur: Abonnement): Observable<Abonnement> {
    return this.http.put<Abonnement>(`${this.BASE_URL}/api/souscriptions/souscription/update/${nifUtilisateur.uuid}`, nifUtilisateur);
  }

  souscrire(nif: string, enumAbonnement: string): Observable<any> {
    const params = new HttpParams()
      .set('nif', nif)
      .set('enumAbonnement', enumAbonnement);
    return this.http.post(`${this.BASE_URL}/api/souscriptions/souscription`, null, { params });
  }
}
