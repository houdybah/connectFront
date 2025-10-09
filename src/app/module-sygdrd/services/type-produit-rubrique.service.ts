import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../models/Page';
import { TypeProduitRubrique } from '../models/TypeProduitRubrique';

@Injectable({
  providedIn: 'root'
})
export class TypeProduitRubriqueService {

   private readonly typeProduitRubriqueUrl: string =`${environment.defaultauth}` + `/typeProduitRubrique/all`;
    private readonly typeProduitRubriqueNameUrl: string =`${environment.defaultauth}` + `/typeProduitRubrique`;
   constructor(private httpClient : HttpClient) { }
  
    public newTypeProduitRubrique (typeProduitRubrique : TypeProduitRubrique ) : Observable <TypeProduitRubrique> {
      return this.httpClient.post<TypeProduitRubrique>(`${this.typeProduitRubriqueNameUrl}`,typeProduitRubrique)
    }
    public updateTypeProduitRubrique(typeProduitRubrique : TypeProduitRubrique) : Observable <TypeProduitRubrique> {
      return this.httpClient.put<TypeProduitRubrique> (`${this.typeProduitRubriqueNameUrl}/${typeProduitRubrique.uuid}`,typeProduitRubrique)
    }
    
    public getAllRubrique () : Observable  <any> {
      return this.httpClient.get<TypeProduitRubrique[]>(`${this.typeProduitRubriqueUrl}`)
    }
    public deleteRubrique (uuidTypeProduitRubrique : string): Observable <any> {
      return this.httpClient.delete<void>(`${this.typeProduitRubriqueUrl}/${uuidTypeProduitRubrique}`)
    }

     getTypeProduitRubriqueByNatureRecette(page:Page, uuidNatureRecette:String): Observable<any> {
              let url = `${environment.defaultauth}/mensualisationByNatureRecette?uuidNatureRecette=${uuidNatureRecette}&page=${page.pageNumber}&size=${page.size}`;
              return this.httpClient.get<any>(url, {
                headers: new HttpHeaders({
                  "Content-Type": "application/json",
                }),
              });
            }
}







