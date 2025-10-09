import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Journal} from "../models/Journal";
import {Observable} from "rxjs";
import {Page} from "../models/Page";

@Injectable({
  providedIn: 'root'
})
export class JournalService {



  private readonly journalNameUrl: string =`${environment.defaultauth}` + `/journal`;

  constructor(private http : HttpClient) { }

  public newJournal (journal : Journal ) : Observable <Journal> {
    return this.http.post<Journal>(`${this.journalNameUrl}`,journal)
  }
  public updateJournal(journal : Journal) : Observable <Journal> {
    return this.http.put<Journal> (`${this.journalNameUrl}/${journal.uuid}`,journal)
  }
  public getOneJournal(uuidJournal : string): Observable  <Journal> {
    return  this.http.get<Journal>(`${this.journalNameUrl}/${uuidJournal}`)
  }
  public getAllJournal () : Observable  <any> {
    return this.http.get<Journal[]>(`${this.journalNameUrl}`)
  }
  public deleteJournal (uuidJournal : string): Observable <any> {
    return this.http.delete<void>(`${this.journalNameUrl}/${uuidJournal}`)
  }

  getJournalss(page:Page, key:String): Observable<any> {
    let url = `${this.journalNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
}







