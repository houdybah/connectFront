import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Mensualisation} from "../models/Mensualisation";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class MensualisationService {

  private readonly mensualisationNameUrl: string =`${environment.defaultauth}` + `/mensualisation`;

  constructor(private http : HttpClient) { }

  public newMensualisation (mensualisation : Mensualisation ) : Observable <Mensualisation> {
    return this.http.post<Mensualisation>(`${this.mensualisationNameUrl}`,mensualisation)
  }
  public updateMensualisation(mensualisation : Mensualisation) : Observable <Mensualisation> {
    return this.http.put<Mensualisation> (`${this.mensualisationNameUrl}/${mensualisation.uuid}`,mensualisation)
  }
  public getOneMensualisation(uuidMensualisation : string): Observable  <Mensualisation> {
    return  this.http.get<Mensualisation>(`${this.mensualisationNameUrl}/${uuidMensualisation}`)
  }
  public getAllMensualisation () : Observable  <any> {
    return this.http.get<Mensualisation[]>(`${this.mensualisationNameUrl}`)
  }
  public deleteMensualisation (uuidMensualisation : string): Observable <any> {
    return this.http.delete<void>(`${this.mensualisationNameUrl}/${uuidMensualisation}`)
  }

  getMensualisationss(page:Page, key:String): Observable<any> {
    let url = `${this.mensualisationNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getMensualisationsByUnite(page:Page, uuidUnite:String): Observable<any> {
    let url = `${environment.defaultauth}/mensualisationByUnite?uuidUnite=${uuidUnite}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getMensualisationsByQuotaAnnuel(page:Page, uuidQuotaAnnuel:String): Observable<any> {
    let url = `${environment.defaultauth}/mensualisationByQuotaAnnuel?uuidQuotaAnnuel=${uuidQuotaAnnuel}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
}







