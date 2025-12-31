import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Page} from "../../../models/Page";
import {Observable} from "rxjs";
import {Application} from "../models/application";
import { UserApplicationAcces } from 'src/app/module-manager/models/UserApplicationAcces';
import { PagedData } from 'src/models/PageData';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private readonly applicationNameUrl: string =`${environment.defaultauth}` + `/application`;

  constructor(private readonly http: HttpClient) { }

  public newApplication (application : Application ) : Observable <Application> {
    return this.http.post<Application>(`${this.applicationNameUrl}`,application)
  }
  public updateApplication(application : Application) : Observable <Application> {
    return this.http.put<Application> (`${this.applicationNameUrl}/${application.uuid}`,application)
  }
  public getOneApplication(uuidApplication : string): Observable  <Application> {
    return  this.http.get<Application>(`${this.applicationNameUrl}/${uuidApplication}`)
  }
  public getAllApplication () : Observable<any> {
    console.log('📡 Appel API getAllApplication:', `${this.applicationNameUrl}`);
    return this.http.get<any>(`${this.applicationNameUrl}?key=&page=0&size=10000`)
  }
  public deleteApplication (uuidApplication : string): Observable <any> {
    return this.http.delete<void>(`${this.applicationNameUrl}/${uuidApplication}`)
  }

  getApplicationss(page:Page, key:string): Observable<PagedData<Application>> {
    // Encoder correctement le paramètre key pour l'URL
    const encodedKey = encodeURIComponent(key);
    let url = `${this.applicationNameUrl}?key=${encodedKey}&page=${page.pageNumber}&size=${page.size}`;
    
    console.log('📡 === APPEL API getApplicationss ===');
    console.log('Paramètre key reçu:', `"${key}"`);
    console.log('Paramètre key encodé:', `"${encodedKey}"`);
    console.log('URL complète:', url);
    
    return this.http.get<PagedData<Application>>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  public applicationUser (uuidUser : string): Observable <UserApplicationAcces[]> {
    return  this.http.get<UserApplicationAcces[]>(`${environment.defaultauth}/api/utilisateur/${uuidUser}/applications/active`)
  }

}
