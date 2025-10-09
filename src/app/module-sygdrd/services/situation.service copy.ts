import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SituationResteARecouvrir } from '../models/situation-reste-arecouvrir';
import { environment } from 'src/environments/environment';
import {ResteARecouvrer} from "../models/resteARecouvrer";
import {Provisoire} from "../models/Provisoire";
import {TransactionFt} from "../models/transactionFt";
import {Quittance} from "../models/Quittance";


/**
 * Interface représentant la réponse d'une requête venant de l'API
 */
export interface ApiResponse {
  message: string;
  filename: string;
  details: any;
}

@Injectable({
  providedIn: 'root'
})
export class SituationService {

  constructor(private http : HttpClient) { }

  getSituationResteARecouvrir(dateDebut:string, dateFin:string): Observable<SituationResteARecouvrir[]> {

    return this.http.get<[]>(`${environment.defaultauth}/restesARecouvrir/${dateDebut}/${dateFin}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }


  getResteARecouvrir(dateDebut:string, dateFin:string): Observable<ResteARecouvrer[]> {
    return this.http.get<[]>(`${environment.defaultauth}/rar?dateDebut=${dateDebut}&dateFin=${dateFin}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getProvisoire(annee:string): Observable<Provisoire[]> {
    return this.http.get<[]>(`${environment.defaultauth}/provisoire?annee=${annee}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

  getFtBCRG(dateDebut:string, dateFin:string): Observable<TransactionFt[]> {
    let url = `${environment.defaultauth}/api/bank-statements/ftIn?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    console.log(url)
    return this.http.get<TransactionFt[]>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }

/**
 * Methode qui permet d'uploader un fichier FT BCRG
 * @param file 
 * @returns 
 */
  uploadFileF(file: File): Observable<ApiResponse> {
    let url = `${environment.defaultauth}/api/bank-statements/upload`; 
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(url, formData);
  }

  uploadExcelFile(file: File): Observable<string> {
    let apiUrl = `${environment.defaultauth}/api/excel/upload`; 
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(apiUrl, formData, { responseType: 'text' }).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred while uploading the file';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid fichier ou données !';
        } else if (error.status === 500) {
          errorMessage = 'Erreur Serveur : ' + (error.error || 'Veuillez essayer encore !');
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  getQuittance(dateDebut:string, dateFin:string): Observable<Quittance[]> {
    let url = `${environment.defaultauth}/quittance?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    console.log(url)
    return this.http.get<Quittance[]>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }



}







