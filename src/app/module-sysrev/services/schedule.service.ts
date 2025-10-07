import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BonSortie } from '../models/BonSortie';
import { Declaration } from '../models/Declaration';
import { DetailBonSortie } from '../models/DetailBonSortie';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
private readonly BASE_URL = `${environment.defaultauth}`;

  constructor(private http: HttpClient) {}


  getDeclaration(reference:any): Observable<Declaration> {
    return this.http.get<Declaration>(`${this.BASE_URL}/sydonia/declaration/${reference}`);
  }
  getBonSortie(reference:any): Observable<BonSortie[]> {
    return this.http.get<BonSortie[]>(`${this.BASE_URL}/sydonia/bonSortie/${reference}`);
  }


  getDetailBonSortie(reference:any, numeroBonSortie:any): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/sydonia/conteneurByBonSortie/${reference}/${numeroBonSortie}`);
  }

  allDeclaration(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/sydonia/declaration`);
  }
}




