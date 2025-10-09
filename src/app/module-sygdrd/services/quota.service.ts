import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Quota} from "../models/Quota";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class QuotaService {



  private readonly quotaNameUrl: string =`${environment.defaultauth}` + `/quota`;

  constructor(private http : HttpClient) { }

  public newQuota (quota : Quota ) : Observable <Quota> {
    return this.http.post<Quota>(`${this.quotaNameUrl}`,quota)
  }
  public updateQuota(quota : Quota) : Observable <Quota> {
    return this.http.put<Quota> (`${this.quotaNameUrl}/${quota.uuid}`,quota)
  }
  public getOneQuota(uuidQuota : string): Observable  <Quota> {
    return  this.http.get<Quota>(`${this.quotaNameUrl}/${uuidQuota}`)
  }
  public getAllQuota () : Observable  <any> {
    return this.http.get<Quota[]>(`${this.quotaNameUrl}`)
  }
  public deleteQuota (uuidQuota : string): Observable <any> {
    return this.http.delete<void>(`${this.quotaNameUrl}/${uuidQuota}`)
  }

  getQuotass(page:Page, key:String): Observable<any> {
    let url = `${this.quotaNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}







