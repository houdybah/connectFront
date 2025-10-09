import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Unite} from "../models/Unite";
import {Observable} from "rxjs";
import {Page} from "../models/Page";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UniteService {



  private readonly uniteNameUrl: string =`${environment.defaultauth}` + `/unite`;

  constructor(private http : HttpClient) { }

  public newUnite (unite : Unite ) : Observable <Unite> {
    return this.http.post<Unite>(`${this.uniteNameUrl}`,unite)
  }
  public updateUnite(unite : Unite) : Observable <Unite> {
    return this.http.put<Unite> (`${this.uniteNameUrl}/${unite.uuid}`,unite)
  }
  public getOneUnite(uuidUnite : string): Observable  <Unite> {
    return  this.http.get<Unite>(`${this.uniteNameUrl}/${uuidUnite}`)
  }
  public getAllUnite () : Observable  <any> {
    return this.http.get<Unite[]>(`${this.uniteNameUrl}?page=0&size=100000`)
  }
  public deleteUnite (uuidUnite : string): Observable <any> {
    return this.http.delete<void>(`${this.uniteNameUrl}/${uuidUnite}`)
  }

  getUnitess(page:Page, key:String): Observable<any> {
    let url = `${this.uniteNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
  
}







