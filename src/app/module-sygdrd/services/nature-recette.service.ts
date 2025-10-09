import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../models/Page";
import { NatureRecette } from '../models/NatureRecette';

@Injectable({
  providedIn: 'root'
})
export class NatureRecetteService {



  private readonly natureRecetteNameUrl: string =`${environment.defaultauth}` + `/natureRecette`;

  constructor(private http : HttpClient) { }

  public newNatureRecette (natureRecette : NatureRecette ) : Observable <NatureRecette> {
    return this.http.post<NatureRecette>(`${this.natureRecetteNameUrl}`,natureRecette)
  }
  public updateNatureRecette(natureRecette : NatureRecette) : Observable <NatureRecette> {
    return this.http.put<NatureRecette> (`${this.natureRecetteNameUrl}/${natureRecette.uuid}`,natureRecette)
  }
  public getOneNatureRecette(uuidNatureRecette : string): Observable  <NatureRecette> {
    return  this.http.get<NatureRecette>(`${this.natureRecetteNameUrl}/${uuidNatureRecette}`)
  }
  public getAllNatureRecette () : Observable  <any> {
    return this.http.get<NatureRecette[]>(`${this.natureRecetteNameUrl}`)
  }
  public deleteNatureRecette (uuidNatureRecette : string): Observable <any> {
    return this.http.delete<void>(`${this.natureRecetteNameUrl}/${uuidNatureRecette}`)
  }

  getNatureRecettess(page:Page, key:String): Observable<any> {
    let url = `${this.natureRecetteNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}







