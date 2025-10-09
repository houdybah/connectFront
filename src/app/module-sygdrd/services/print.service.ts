import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Page} from "../models/Page";
import {ReportResultDto} from "../models/reportResultDto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient) {}

  printRealisation(periodicite:string,dateDebut:string, dateFin:string ) {
    return this.http.post<ReportResultDto>(`${environment.defaultauth}/printRealisation?periodicite=${periodicite}&dateDebut=${dateDebut}&dateFin=${dateFin}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  printSituationAuJour(dateDebut:string, dateFin:string ) {
    return this.http.post<ReportResultDto>(`${environment.defaultauth}/printSituationAuJour?dateDebut=${dateDebut}&dateFin=${dateFin}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  printRealisationUnite(uuidUnite: string, periodicite:string,dateDebut:string, dateFin:string ) {
    return this.http.post<ReportResultDto>(`${environment.defaultauth}/printRealisationUnite?uuidUnite=${uuidUnite}&periodicite=${periodicite}&dateDebut=${dateDebut}&dateFin=${dateFin}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

    printComptantCredit(dateDebut: string, dateFin: string, param3: string | null, param4: string | null, param5: string | null) {
      return this.http.post<ReportResultDto>(`${environment.defaultauth}/printRealisationUnite`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      });
    }
}







