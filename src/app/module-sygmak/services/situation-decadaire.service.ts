import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Page } from '../models/Page';
import { PagedData } from '../models/paged-data';
import { SituationDecadaire } from '../models/situation-decadaire';

@Injectable({
  providedIn: 'root'
})
export class SituationDecadaireService {
  private readonly BASE_URL = `${environment.defaultauth}`;
  //private BASE_URL = 'http://localhost:8090'; // URL de votre backend
 
  constructor(private http: HttpClient) {}
 
  // Fonction pour récupérer les déclarations avec un nif
  getDeclarationsByNif(nif: string): Observable<SituationDecadaire[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    return this.http.get<SituationDecadaire[]>(`${this.BASE_URL}/declaration?nif=${nif}`, { headers });
  }

  getDecadaire(
    page: Page, 
    key: string, 
    nif: string, 
    bureau: string, 
    nomenclature: string | null, // Marqué comme optionnel
    regime: string | null,       // Marqué comme optionnel
    dateDebut: string, 
    dateFin: string
  ): Observable<PagedData<SituationDecadaire>> {
    
    console.log("Service - Appel getDecadaire avec dates:", dateDebut, dateFin);
    
    // Initialisez les paramètres de base
    let params = new HttpParams()
      .set('key', key || '')
      .set('nif', nif)
      .set('bureau', bureau)
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin)
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());
    
    // Ajoutez les paramètres optionnels seulement s'ils ont une valeur
    if (nomenclature) {
      params = params.set('nomenclature', nomenclature);
    }
    
    if (regime) {
      params = params.set('regime', regime);
    }
        
    return this.http.get<PagedData<SituationDecadaire>>(
      `${this.BASE_URL}/api/oracle/decadaireOracle`, 
      { params }
    ).pipe(
      tap(response => console.log('Réponse API reçue:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des données:', error);
        return throwError(() => error);
      })
    );
  }

  getAll(): Observable<SituationDecadaire[]> {
    return this.http.get<SituationDecadaire[]>(`${this.BASE_URL}/NifUtilisateur/all`);
  }
   
  // Méthodes pour l'export modifiées pour utiliser le format de date correct
  exportToPdf(startDate: string, endDate: string, companyCode: string, tariffCode: string, customsOfficeCode: string, regime: string): Observable<Blob> {
    console.log("Service - Export PDF avec dates:", startDate, endDate);
    
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('companyCode', companyCode || '')
      .set('tariffCode', tariffCode || '') 
      .set('customsOfficeCode', customsOfficeCode || '')
      .set('regime', regime || '')
      .set('format', 'pdf');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/customs-declarations`, {
      params,
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Headers de réponse PDF:', response.headers);
        console.log('Type de contenu:', response.headers.get('Content-Type'));
        console.log('Taille du blob:', response.body?.size);
      }),
      map(response => response.body as Blob),
      catchError(error => {
        console.error('Erreur lors de l\'export PDF:', error);
        return throwError(() => error);
      })
    );
  }

  exportToExcel(startDate: string, endDate: string, companyCode: string, tariffCode: string, customsOfficeCode: string, regime: string): Observable<Blob> {
    console.log("Service - Export Excel avec dates:", startDate, endDate);
    
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('companyCode', companyCode || '')
      .set('tariffCode', tariffCode || '')
      .set('customsOfficeCode', customsOfficeCode || '')
      .set('regime', regime || '')
      .set('format', 'excel');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/customs-declarations`, {
      params,
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Headers de réponse Excel:', response.headers);
        console.log('Type de contenu:', response.headers.get('Content-Type'));
        console.log('Taille du blob:', response.body?.size);
      }),
      map(response => response.body as Blob),
      catchError(error => {
        console.error('Erreur lors de l\'export Excel:', error);
        return throwError(() => error);
      })
    );
  }
}

/*import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Page } from '../models/Page';
import { PagedData } from '../models/paged-data';
import { SituationDecadaire } from '../models/situation-decadaire';

@Injectable({
  providedIn: 'root'
})
export class SituationDecadaireService {

  private BASE_URL = 'http://localhost:8090'; // Remplacez par l'URL de votre backend
 
   constructor(private http: HttpClient) {}
 
   // Fonction pour récupérer les déclarations avec un nif
   getDeclarationsByNif(nif: string): Observable<SituationDecadaire[]> {
     const headers = new HttpHeaders({
       'Content-Type': 'application/json',
     });
 
     return this.http.get<SituationDecadaire[]>(`${this.BASE_URL}/declaration?nif=${nif}`, { headers });
   }
 
 /*
 getDecadaire(page: Page, key: string, nif: string,bureau: string, nomenclature: string,regime: string, dateDebut: string,dateFin: string
 ): Observable<PagedData<SituationDecadaire>> {
   const params = new HttpParams()
     .set('key', key) // Associe la clé au paramètre key
     .set('nif', nif) // Ajoute le NIF au paramètre nif
     .set('bureau', bureau) // Ajoute le NIF au paramètre nif
     .set('nomenclature', nomenclature) // Ajoute le NIF au paramètre nif
     .set('regime', regime) // Ajoute le NIF au paramètre nif
     .set('dateDebut', dateDebut) // Ajoute le NIF au paramètre nif
     .set('dateFin', dateFin) // Ajoute le NIF au paramètre nif
     .set('page', page.pageNumber.toString())
     .set('size', page.size.toString());
     
     
   return this.http.get<PagedData<SituationDecadaire>>(`${this.BASE_URL}/api/oracle/decadaireOracle`, { params });
 }

 

 getDecadaire(
  page: Page, 
  key: string, 
  nif: string, 
  bureau: string, 
  nomenclature: string | null, // Marqué comme optionnel
  regime: string | null,       // Marqué comme optionnel
  dateDebut: string, 
  dateFin: string
): Observable<PagedData<SituationDecadaire>> {
  
  // Initialisez les paramètres de base
  let params = new HttpParams()
    .set('key', key || '')
    .set('nif', nif)
    .set('bureau', bureau)
    .set('dateDebut', dateDebut)
    .set('dateFin', dateFin)
    .set('page', page.pageNumber.toString())
    .set('size', page.size.toString());
  
  // Ajoutez les paramètres optionnels seulement s'ils ont une valeur
  if (nomenclature) {
    params = params.set('nomenclature', nomenclature);
  }
  
  if (regime) {
    params = params.set('regime', regime);
  }
      
  return this.http.get<PagedData<SituationDecadaire>>(
    `${this.BASE_URL}/api/oracle/decadaireOracle`, 
    { params }
  );
}
   getAll(): Observable<SituationDecadaire[]> {
     return this.http.get<SituationDecadaire[]>(`${this.BASE_URL}/NifUtilisateur/all`);
   }
   
 
 
   // Ajout des nouvelles méthodes pour l'export
 exportToPdf(startDate: string, endDate: string, companyCode: string, tariffCode: string, customsOfficeCode: string, regime: string): Observable<Blob> {
  return this.http.get(`${this.BASE_URL}/api/reports/oracle/customs-declarations`, {
    params: {
      startDate,
      endDate,
      companyCode,
      tariffCode, // Correspond au champ nomenclature dans votre formulaire
      customsOfficeCode, // Correspond au champ bureau
      regime,
      format: 'pdf'
    },
    responseType: 'blob'
  });
}

exportToExcel(startDate: string, endDate: string, companyCode: string, tariffCode: string, customsOfficeCode: string, regime: string): Observable<Blob> {
  return this.http.get(`${this.BASE_URL}/api/reports/oracle/customs-declarations`, {
    params: {
      startDate,
      endDate,
      companyCode,
      tariffCode,      // Correspond à nomenclature dans votre formulaire
      customsOfficeCode, // Correspond à bureau dans votre formulaire
      regime,
      format: 'excel'
    },
    responseType: 'blob'
  });
}

   
}
*/