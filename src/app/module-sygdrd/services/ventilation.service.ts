import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../models/Page';
import { VentilationParRubrique } from '../models/VentilationParRubrique';

@Injectable({
  providedIn: 'root'
})
export class VentilationService {

  private readonly VentilationParRubriqueUrl: string =`${environment.defaultauth}` + `/ventilationParRubrique`;
     constructor(private httpClient : HttpClient) { }
    
      public newVentilation (ventilationParRubrique : VentilationParRubrique ) : Observable <VentilationParRubrique> {
        return this.httpClient.post<VentilationParRubrique>(`${this.VentilationParRubriqueUrl}`,ventilationParRubrique)
      }


      public updateVentilation(ventilationParRubrique : VentilationParRubrique) : Observable <VentilationParRubrique> {
          return this.httpClient.put<VentilationParRubrique> (`${this.VentilationParRubriqueUrl}/${ventilationParRubrique.uuid}`,ventilationParRubrique)
        }
      
      public getAllventilationParRubrique (uuidMensualisation:string) : Observable  <any> {
        return this.httpClient.get<VentilationParRubrique[]>(`${this.VentilationParRubriqueUrl}`)
      }

       getVentilationByMensualisation(page:Page, uuidMensualisation:String): Observable<any> {
          let url = `${environment.defaultauth}/ventilationParRubriqueByMensualisation?uuidMensualisation=${uuidMensualisation}&page=${page.pageNumber}&size=${page.size}`;
          return this.httpClient.get<any>(url, {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
            }),
          });
        }


   public deleteVentilation (uuidVentilation : string): Observable <any> {
    return this.httpClient.delete<void>(`${this.VentilationParRubriqueUrl}/${uuidVentilation}`)
  }
      
}







