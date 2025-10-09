import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QuotaAnnuel} from "../models/QuotaAnnuel";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class QuotaAnnuelService {

  private readonly quotaAnnuelNameUrl: string =`${environment.defaultauth}` + `/quotaAnnuel`;

  constructor(private http : HttpClient) { }

  public newQuotaAnnuel (quotaAnnuel : QuotaAnnuel ) : Observable <QuotaAnnuel> {
    return this.http.post<QuotaAnnuel>(`${this.quotaAnnuelNameUrl}`,quotaAnnuel)
  }
  public updateQuotaAnnuel(quotaAnnuel : QuotaAnnuel) : Observable <QuotaAnnuel> {
    return this.http.put<QuotaAnnuel> (`${this.quotaAnnuelNameUrl}/${quotaAnnuel.uuid}`,quotaAnnuel)
  }
  public getOneQuotaAnnuel(uuidQuotaAnnuel : string): Observable  <QuotaAnnuel> {
    return  this.http.get<QuotaAnnuel>(`${this.quotaAnnuelNameUrl}/${uuidQuotaAnnuel}`)
  }
  public getAllQuotaAnnuel () : Observable  <any> {
    return this.http.get<QuotaAnnuel[]>(`${this.quotaAnnuelNameUrl}`)
  }
  public deleteQuotaAnnuel (uuidQuotaAnnuel : string): Observable <any> {
    return this.http.delete<void>(`${this.quotaAnnuelNameUrl}/${uuidQuotaAnnuel}`)
  }

  getQuotaAnnuelss(page:Page, key:String): Observable<any> {
    let url = `${this.quotaAnnuelNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getQuotaAnnuelsByUnite(page:Page, uuidUnite:String): Observable<any> {
    let url = `${environment.defaultauth}/quotaAnnuelByUnite?uuidUnite=${uuidUnite}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
}







