import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Page } from 'src/models/Page';
import {Compte} from "../models/Compte";

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  private readonly compteNameUrl: string =`${environment.defaultauth}` + `/compte`;

  constructor(private http : HttpClient) { }

  public newCompte (compte : Compte ) : Observable <Compte> {
    return this.http.post<Compte>(`${this.compteNameUrl}`,compte)
  }
  public updateCompte(compte : Compte) : Observable <Compte> {
    return this.http.put<Compte> (`${this.compteNameUrl}/${compte.uuid}`,compte)
  }
  public getOneCompte(uuidCompte : string): Observable  <Compte> {
    return  this.http.get<Compte>(`${this.compteNameUrl}/${uuidCompte}`)
  }
  public getAllCompte () : Observable  <any> {
    return this.http.get<Compte[]>(`${this.compteNameUrl}`)
  }
  public deleteCompte (uuidCompte : string): Observable <any> {
    return this.http.delete<void>(`${this.compteNameUrl}/${uuidCompte}`)
  }

  getComptess(page:Page, key:String): Observable<any> {
    let url = `${this.compteNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}
