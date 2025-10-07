import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailConteneurAffectationService {

  constructor(private http: HttpClient) { }

  private readonly BASE_URL = `${environment.defaultauth}/api/detail-affectation-conteneur`;

  getDetailConteneurAffectation(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${uuid}`);
  }
}



