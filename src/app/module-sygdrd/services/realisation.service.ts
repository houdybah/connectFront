import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Realisation} from "../models/Realisation";
import {Page} from "../models/Page";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RealisationService {

  private readonly realisationUrl: string =`${environment.defaultauth}` + `/realisation`;

  constructor(private httpClient : HttpClient) { }

  getAllRealisation () : Observable  <any> {
    return this.httpClient.get<Realisation[]>(`${this.realisationUrl}/all`)
  }

  getRealisationAll(page:Page, periodicite: string,debut: string,fin: string) {
    let url = `${this.realisationUrl}/all?periodicite=${periodicite}&dateDebut=${debut}&dateFin=${fin}`;
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getRARparCodeBudget(page:Page,debut: string,fin: string,uuidUnite: string) {
    let url = `${environment.defaultauth}` + `/situation/rarParCodeBudget?dateDebut=${debut}&dateFin=${fin}&uuidUnite=${uuidUnite}`;
     console.log(url)
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getComptantCredit(page:Page, type: string, isQuittanced: string, uuidUnite: string,debut: string,fin: string) {
    let url = `${environment.defaultauth}` + `/situation/comptant_credit?type=${type}&dateDebut=${debut}&dateFin=${fin}&uuidUnite=${uuidUnite}&isQuittanced=${isQuittanced}&page=${page.pageNumber}&size=${page.size}`;
    console.log(url);
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getRealisationByUnite(page:Page, uuidUnite: string, periodicite: string,debut: string,fin: string) {
    let url = `${this.realisationUrl}/unite?uuidUnite=${uuidUnite}&periodicite=${periodicite}&dateDebut=${debut}&dateFin=${fin}`;
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getRealisationCumul(page:Page, periodicite: string,debut: string,fin: string) {
    let url = `${this.realisationUrl}/cumul?periodicite=${periodicite}&dateDebut=${debut}&dateFin=${fin}`;
    return this.httpClient.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
}







