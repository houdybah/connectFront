import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Exercice} from "../models/Exercice";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor(private http : HttpClient) { }

  public getTypesLoisFinance () : Observable  <any> {
    return this.http.get<string[]>(`${environment.defaultauth}/typeLoisFinance`)
  }

  public getProduits () : Observable  <any> {
    return this.http.get<string[]>(`${environment.defaultauth}/produits`)
  }

  public getGenres () : Observable  <any> {
    return this.http.get<string[]>(`${environment.defaultauth}/genres`)
  }

  public getTypesUnite () : Observable  <any> {
    return this.http.get<string[]>(`${environment.defaultauth}/typesUnite`)
  }

  public getRoles () : Observable  <any> {
    return this.http.get<string[]>(`${environment.defaultauth}/roles`)
  }
}







