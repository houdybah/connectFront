import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../models/Page';
import { PagedData } from '../models/paged-data';
import { SituationDeclaration } from '../models/situation-declaration';

@Injectable({
  providedIn: 'root'
})
export class SituationDeclarationService {
  // Utiliser l'URL depuis l'environnement pour plus de flexibilité
 // private BASE_URL =  'http://localhost:8090';
    private readonly BASE_URL = `${environment.defaultauth}`;

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les déclarations avec un nif
getDeclarationsByNif(nif: string): Observable<SituationDeclaration[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.get<SituationDeclaration[]>(`${this.BASE_URL}/declaration`, {
    headers,
    params: new HttpParams().set('nif', nif)
  });
}

// Récupération des déclarations par bureau
getDeclarationsByNifsParBureau(
  page: Page, 
  key: string, 
  nif: string, 
  bureau: string, 
  statut: string, 
  dateDebut: string, 
  dateFin: string
): Observable<PagedData<SituationDeclaration>> {
  // Log pour déboguer les paramètres de pagination
  console.log('Pagination - Paramètres:', { pageNumber: page?.pageNumber, pageSize: page?.size });
  
  let params = new HttpParams()
    .set('nif', nif || '')
    .set('bureau', bureau || '')
    .set('statut', this.mapStatutValue(statut)) // Utiliser la méthode mapStatutValue uniquement
    .set('dateDebut', dateDebut || '')
    .set('dateFin', dateFin || '')
    .set('page', page?.pageNumber?.toString() || '0')
    .set('size', page?.size?.toString() || '10');
    
  if (key) {
    params = params.set('key', key);
  }
  
  // Log pour déboguer tous les paramètres
  console.log('API Call - Paramètres complets:', {
    url: `${this.BASE_URL}/api/oracle/declarationsBureau`,
    nif: nif || '',
    bureau: bureau || '',
    statut: this.mapStatutValue(statut),
    dateDebut: dateDebut || '',
    dateFin: dateFin || '',
    page: page?.pageNumber?.toString() || '0',
    size: page?.size?.toString() || '10',
    key: key || ''
  });
 
  return this.http.get<PagedData<SituationDeclaration>>(`${this.BASE_URL}/api/oracle/declarationsBureau`, { params });
}



getDeclarationsByNifsParCodeDec(
  page: Page, 
  key: string, 
  nif: string, 
  codeDec: string, 
  statut: string, 
  dateDebut: string, 
  dateFin: string
): Observable<PagedData<SituationDeclaration>> {
  // Ajouter un timestamp unique pour empêcher le cache
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  const uniqueParam = `${timestamp}_${random}`;
  
  // Construction des paramètres avec valeurs explicites
  let params = new HttpParams()
    .set('nif', nif || '')
    .set('codeDec', codeDec || '')
    .set('statut', this.mapStatutValue(statut))
    .set('dateDebut', dateDebut || '')
    .set('dateFin', dateFin || '')
    .set('page', page.pageNumber.toString())
    .set('size', page.size.toString())
    .set('nocache', uniqueParam); // Ce paramètre force une nouvelle requête

  // Headers anti-cache
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<PagedData<SituationDeclaration>>(
    `${this.BASE_URL}/api/oracle/declarationsCodeDec`, 
    { params, headers }
  );
}


getDeclarationsByNifsAll(
  page: Page, 
  key: string, 
  nif: string, 
  nomenclature: string, 
  statut: string, 
  dateDebut: string, 
  dateFin: string
): Observable<PagedData<SituationDeclaration>> {
  let params = new HttpParams()
    .set('nif', nif || '')
     .set('nomenclature', nomenclature || '')
    .set('statut', this.mapStatutValue(statut))
    .set('dateDebut', dateDebut || '')
    .set('dateFin', dateFin || '')
    .set('page', page?.pageNumber?.toString() || '0')
    .set('size', page?.size?.toString() || '10');
    
  if (key && key.trim() !== '') {
    params = params.set('key', key);
  }
 
  return this.http.get<PagedData<SituationDeclaration>>(`${this.BASE_URL}/api/oracle/declarationsAll`, { params });
}

// Méthode utilitaire pour normaliser les valeurs de statut
private mapStatutValue(statut: string): string {
  if (!statut) return 'ALL';
  
  switch (statut.toUpperCase()) {
    case 'NULL':
    case 'NON QUITTANCÉ':
    case 'NONQUITANCE':
      return 'NULL';
    case 'NOT_NULL':
    case 'QUITTANCÉ':
    case 'QUITANCE':
      return 'NOT_NULL';
    case 'ALL':
    case 'TOUS':
    case 'TOUT':
      return 'ALL';
    default:
      return statut;
  }
}
  
  // Export toutes déclarations en PDF
 /* exportToTPdf(date_debut: string, date_fin: string, nif: string, nomenclature?: string, statut?: string ): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('statut', statut || '')
      .set('nomenclature', nomenclature || '')
      .set('format', 'pdf');

   // return this.http.get(`${this.BASE_URL}/api/declarationT/customs`, {
    return this.http.get(`${this.BASE_URL}/api/declarationT/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  // Export toutes déclarations en Excel
  exportToTExcel(date_debut: string, date_fin: string, nif: string, statut: string, nomenclature?: string): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('nomenclature', nomenclature || '')
      .set('statut', statut || '')
      .set('format', 'excel');

    return this.http.get(`${this.BASE_URL}/api/declarationT/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.ms-excel'
      })
    });
  }
*/
 // Export toutes déclarations en PDF
 exportToTPdf(date_debut: string, date_fin: string, nif: string, nomenclature?: string, statut?: string ): Observable<Blob> {
  const params = new HttpParams()
    .set('date_debut', date_debut || '')
    .set('date_fin', date_fin || '')
    .set('nif', nif || '')
    .set('nomenclature', nomenclature || '')
    .set('statut', statut || '')
    .set('format', 'pdf');

 // return this.http.get(`${this.BASE_URL}/api/declarationT/customs`, {
  return this.http.get(`${this.BASE_URL}/api/declarationT/oracle/customs`, {
    params,
    responseType: 'blob',
    headers: new HttpHeaders({
      'Accept': 'application/pdf'
    })
  });
}

// Export toutes déclarations en Excel
exportToTExcel(date_debut: string, date_fin: string, nif: string , nomenclature?: string, statut?: string): Observable<Blob> {
  const params = new HttpParams()
    .set('date_debut', date_debut || '')
    .set('date_fin', date_fin || '')
    .set('nif', nif || '')
    .set('nomenclature', nomenclature || '')
    .set('statut', statut || '')
    .set('format', 'excel');

  return this.http.get(`${this.BASE_URL}/api/declarationT/oracle/customs`, {
    params,
    responseType: 'blob',
    headers: new HttpHeaders({
      'Accept': 'application/vnd.ms-excel'
    })
  });
}  
  // Export déclarations par code en PDF
  exportToDPdf(date_debut: string, date_fin: string, nif: string, statut: string, declaration: string): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('declaration', declaration || '')
      .set('statut', statut || '')
      .set('format', 'pdf');

    return this.http.get(`${this.BASE_URL}/api/declarationD/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  // Export déclarations par code en Excel
  exportToDExcel(date_debut: string, date_fin: string, nif: string, statut: string, declaration: string): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('declaration', declaration || '')
      .set('statut', statut || '')
      .set('format', 'excel');

    return this.http.get(`${this.BASE_URL}/api/declarationD/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.ms-excel'
      })
    });
  }

  // Export déclarations par bureau en PDF
  exportToPdf(date_debut: string, date_fin: string, nif: string, statut: string, bureau: string): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('bureau', bureau || '')
      .set('statut', statut || '')
      .set('format', 'pdf');

    return this.http.get(`${this.BASE_URL}/api/declaration/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  // Export déclarations par bureau en Excel
  exportToExcel(date_debut: string, date_fin: string, nif: string, statut: string, bureau: string): Observable<Blob> {
    const params = new HttpParams()
      .set('date_debut', date_debut || '')
      .set('date_fin', date_fin || '')
      .set('nif', nif || '')
      .set('bureau', bureau || '')
      .set('statut', statut || '')
      .set('format', 'excel');

    return this.http.get(`${this.BASE_URL}/api/declaration/oracle/customs`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.ms-excel'
      })
    });
  }

  // Méthode utilitaire pour télécharger le fichier
  downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Dans situation-declaration.service.ts
getDeclarationsByNifsParCodeDecForcedRefresh(
  page: Page, 
  key: string, 
  nif: string, 
  codeDec: string, 
  statut: string, 
  dateDebut: string, 
  dateFin: string
): Observable<PagedData<SituationDeclaration>> {
  // Force le rafraîchissement avec un timestamp unique
  const timestamp = new Date().getTime();
  
  // Création de nouveaux paramètres de requête
  let params = new HttpParams()
    .set('nif', nif || '')
    .set('codeDec', codeDec || '')
    .set('statut', this.mapStatutValue(statut))
    .set('dateDebut', dateDebut || '')
    .set('dateFin', dateFin || '')
    .set('page', page.pageNumber.toString())
    .set('size', page.size.toString())
    .set('_', timestamp.toString()); // Anti-cache avec timestamp
  
  console.log(`API Request - Page: ${page.pageNumber}, Size: ${page.size}, Timestamp: ${timestamp}`);
  
  // Ajout d'en-têtes spécifiques pour éviter la mise en cache
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  return this.http.get<PagedData<SituationDeclaration>>(
    `${this.BASE_URL}/declarationsCodeDec`, 
    { params, headers }
  );
}
}

