import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Exercice} from "../models/Exercice";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {


  private readonly exerciceNameUrl: string =`${environment.defaultauth}` + `/exercice`;

  constructor(private http : HttpClient) { }

  public newExercice (exercice : Exercice ) : Observable <Exercice> {
    return this.http.post<Exercice>(`${this.exerciceNameUrl}`,exercice)
  }
  public updateExercice(exercice : Exercice) : Observable <Exercice> {
    return this.http.put<Exercice> (`${this.exerciceNameUrl}/${exercice.uuid}`,exercice)
  }
  public getOneExercice(uuidExercice : string): Observable  <Exercice> {
    return  this.http.get<Exercice>(`${this.exerciceNameUrl}/${uuidExercice}`)
  }
  public getAllExercice () : Observable  <any> {
    return this.http.get<Exercice[]>(`${this.exerciceNameUrl}`)
  }
  public deleteExercice (uuidExercice : string): Observable <any> {
    return this.http.delete<void>(`${this.exerciceNameUrl}/${uuidExercice}`)
  }

  getExercicess(page:Page, key:String): Observable<any> {
    let url = `${this.exerciceNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}







