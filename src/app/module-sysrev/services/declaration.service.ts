import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BonBolorer } from '../models/BonBolorer';
import { BonCompagnie } from '../models/BonCompagnie';
import { Declaration_1 } from '../models/Declaration_1';

// Interface pour la réponse de votre API
export interface ApiSearchResponse {
  page: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  data: Declaration_1[];
}

// Interface pour les critères de recherche
export interface SearchCriteria {
  key?: string;        // Recherche globale (ref déclarant + numbl)
  dateDebut?: string;  // Format: yyyy-MM-dd
  dateFin?: string;    // Format: yyyy-MM-dd  
  page?: number;       // Numéro de page (base 0)
  size?: number;       // Taille de page
}

@Injectable({
  providedIn: 'root'
})
export class DeclarationService {
  
  private readonly BASE_URL = `${environment.defaultauth}/declaration`;
  private readonly BASE_URL_1 = `${environment.defaultauth}`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les declarations
  getDeclarations(): Observable<Declaration_1[]> {
    return this.http.get<Declaration_1[]>(`${this.BASE_URL}/pagination`);
  }

  // 🔥 RECHERCHE avec votre API
  searchDeclarations(criteria: SearchCriteria): Observable<ApiSearchResponse> {
    let params = new HttpParams();
    
    // Paramètre "key" pour la recherche globale
    if (criteria.key?.trim()) {
      params = params.set('key', criteria.key.trim());
    }
    
    // Paramètres de date
    if (criteria.dateDebut) {
      params = params.set('dateDebut', criteria.dateDebut);
    }
    if (criteria.dateFin) {
      params = params.set('dateFin', criteria.dateFin);
    }
    
    // Paramètres de pagination
    if (criteria.page !== undefined) {
      params = params.set('page', criteria.page.toString());
    }
    if (criteria.size !== undefined) {
      params = params.set('size', criteria.size.toString());
    }

    console.log('🔍 Appel API search avec params:', params.toString());
    
    return this.http.get<ApiSearchResponse>(`${this.BASE_URL}/search`, { params });
  }

  // Récupérer une declaration par ID
  getDeclarationById(uuid: string): Observable<Declaration_1> {
    const url = `${this.BASE_URL}/${uuid}`;
    return this.http.get<Declaration_1>(url);
  }

  // Créer une nouvelle declaration
  createDeclaration(declaration: Declaration_1): Observable<Declaration_1> {
    const url = `${this.BASE_URL}`;
    return this.http.post<Declaration_1>(url, declaration);
  }

  // Mettre à jour une declaration existante
  updateDeclaration(uuid: string, declaration: Declaration_1): Observable<Declaration_1> {
    const url = `${this.BASE_URL}/${uuid}`;
    return this.http.put<Declaration_1>(url, declaration);
  }

  // Supprimer une declaration
  deleteDeclaration(uuid: string): Observable<void> {
    const url = `${this.BASE_URL}/${uuid}`;
    return this.http.delete<void>(url);
  }

  createCompagnie(bonCompagnie: BonCompagnie): Observable<BonCompagnie> {
    const url = `${this.BASE_URL_1}/bon-compagnie`;
    return this.http.post<BonCompagnie>(url, bonCompagnie);
  }

  createBolorer(bonBolorer: BonBolorer): Observable<BonBolorer> {
    const url = `${this.BASE_URL_1}/api/bon-sorti-bolorer`;
    return this.http.post<BonBolorer>(url, bonBolorer);
  }
}



