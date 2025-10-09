import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../models/Page';
import { Prevision } from '../models/Prevision';

@Injectable({
  providedIn: 'root'
})
export class PrevisionService {

   private readonly previsionUrl: string =`${environment.defaultauth}` + `/prevision`;

  constructor(private httpClient : HttpClient) { }

   public getAllPrevision () : Observable  <any> {
      return this.httpClient.get<Prevision[]>(`${this.previsionUrl}`)
   }

   getPrevision(page:Page, key:String): Observable<any> {
       let url = `${this.previsionUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
       return this.httpClient.get<any>(url, {
         headers: new HttpHeaders({
           "Content-Type": "application/json",
         }),
       });
   }
}







