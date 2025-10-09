import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../models/Page";
import {LoisFinance} from "../models/LoisFinance";

@Injectable({
  providedIn: 'root'
})
export class LoisFinanceService {



  private readonly loisFinanceNameUrl: string =`${environment.defaultauth}` + `/loisFinance`;

  constructor(private http : HttpClient) { }

  public newLoisFinance (loisFinance : any ) : Observable <any> {
    return this.http.post<any>(`${this.loisFinanceNameUrl}`,loisFinance)
  }
  public updateLoisFinance(loisFinance : any) : Observable <any> {
    return this.http.put<any> (`${this.loisFinanceNameUrl}/${loisFinance.uuid}`,loisFinance)
  }
  public getOneLoisFinance(uuidLoisFinance : string): Observable  <any> {
    return  this.http.get<any>(`${this.loisFinanceNameUrl}/${uuidLoisFinance}`)
  }
  public getAllLoisFinance () : Observable  <any> {
    return this.http.get<any[]>(`${this.loisFinanceNameUrl}/?page=0&size=100000`)
  }
  public deleteLoisFinance (uuidLoisFinance : string): Observable <any> {
    return this.http.delete<void>(`${this.loisFinanceNameUrl}/${uuidLoisFinance}`)
  }

  getLoisFinancess(page:Page, key:String): Observable<any> {
    let url = `${this.loisFinanceNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}







