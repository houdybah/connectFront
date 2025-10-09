import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Rubrique} from "../models/Rubrique";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class RubriqueService {



  private readonly rubriqueNameUrl: string =`${environment.defaultauth}` + `/rubrique`;

  constructor(private http : HttpClient) { }

  public newRubrique (rubrique : Rubrique ) : Observable <Rubrique> {
    return this.http.post<Rubrique>(`${this.rubriqueNameUrl}`,rubrique)
  }
  public updateRubrique(rubrique : Rubrique) : Observable <Rubrique> {
    return this.http.put<Rubrique> (`${this.rubriqueNameUrl}/${rubrique.uuid}`,rubrique)
  }
  public getOneRubrique(uuidRubrique : string): Observable  <Rubrique> {
    return  this.http.get<Rubrique>(`${this.rubriqueNameUrl}/${uuidRubrique}`)
  }
  public getAllRubrique () : Observable  <any> {
    return this.http.get<Rubrique[]>(`${this.rubriqueNameUrl}`)
  }
  public deleteRubrique (uuidRubrique : string): Observable <any> {
    return this.http.delete<void>(`${this.rubriqueNameUrl}/${uuidRubrique}`)
  }

  getRubriquess(page:Page, key:String): Observable<any> {
    let url = `${this.rubriqueNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

   public getAllRubriqueTypeProduit () : Observable  <any> {
    return this.http.get<Rubrique[]>(`${this.rubriqueNameUrl}/all`)
  }
  
}







