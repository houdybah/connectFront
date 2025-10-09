import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/models/Page';
import { PagedData } from 'src/models/paged-data';
import { Quittance } from 'src/models/quittance';

@Injectable({
  providedIn: 'root'
})
export class QuittanceService {
  // Utiliser l'URL depuis l'environnement
    private readonly BASE_URL = `${environment.defaultauth}`;
  //private BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) {}


   // ========== MÉTHODES CORRIGÉES AVEC LES BONS NOMS DE PARAMÈTRES ==========

  /**
   * Générer la quittance en PDF selon l'endpoint du contrôleur Spring Boot
   * PARAMÈTRES CORRIGÉS : bureau, annee, code, serie, numero
   */
  generatePdfQuittance(
    bureau: string,      // ideCuoCod -> bureau
    annee: number,       // decRefYer -> annee  
    code: string,        // decCod -> code
    serie: string,       // ideAstSer -> serie
    numero: string,      // ideAstNbr -> numero
    impression: boolean = false
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('bureau', bureau || '')
      .set('annee', annee?.toString() || '')
      .set('code', code || '')
      .set('serie', serie || '')
      .set('numero', numero || '')
      .set('impression', impression.toString());
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/generate`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  /**
   * Obtenir les données JSON de la quittance pour validation
   */
  getQuittanceData(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('bureau', bureau || '')
      .set('annee', annee?.toString() || '')
      .set('code', code || '')
      .set('serie', serie || '')
      .set('numero', numero || '');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/generate`, {
      params,
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  /**
   * Visualiser la quittance dans le navigateur
   */
  viewQuittance(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<Blob> {
    return this.generatePdfQuittance(bureau, annee, code, serie, numero, false);
  }

  /**
   * Télécharger la quittance pour impression
   */
  printQuittance(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<Blob> {
    return this.generatePdfQuittance(bureau, annee, code, serie, numero, true);
  }

  /**
   * Tester les données d'une quittance (endpoint /test)
   */
  testQuittanceData(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('bureau', bureau || '')
      .set('annee', annee?.toString() || '')
      .set('code', code || '')
      .set('serie', serie || '')
      .set('numero', numero || '');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/test`, {
      params
    });
  }

  /**
   * Test simple de validation (endpoint /test-simple)
   */
  testSimpleQuittance(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('bureau', bureau || '')
      .set('annee', annee?.toString() || '')
      .set('code', code || '')
      .set('serie', serie || '')
      .set('numero', numero || '');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/test-simple`, {
      params
    });
  }

  // ========== MÉTHODES DE DIAGNOSTIC ET ADMINISTRATION ==========

  /**
   * Obtenir le diagnostic complet du système
   */
  getDiagnostic(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/diagnostic`);
  }

  /**
   * Vider le cache des quittances (admin seulement)
   */
  clearCache(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/reports/oracle/quittance/clear-cache`, {});
  }

  /**
   * Rafraîchir les signatures (admin seulement)
   */
  refreshSignatures(): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/reports/oracle/quittance/refresh-signatures`, {});
  }

  /**
   * Obtenir les statistiques du système
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/stats`);
  }

  /**
   * Tester un code bureau
   */
  testBureauCode(code: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/test-bureau/${code}`);
  }

  // ========== MÉTHODES UTILITAIRES POUR LES PDF ==========

  /**
   * Ouvrir un PDF dans un nouvel onglet
   */
  openPdfInNewTab(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      newWindow.onclose = () => {
        window.URL.revokeObjectURL(url);
      };
    } else {
      console.warn('Ouverture de nouvel onglet bloquée. Téléchargement proposé à la place.');
      this.downloadPdf(blob);
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * Télécharger un PDF
   */
  downloadPdf(blob: Blob, filename: string = 'Quittance.pdf'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }

  /**
   * Imprimer un PDF via iframe
   */
  printPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    iframe.onerror = () => {
      console.error('Erreur lors du chargement du PDF pour impression');
      window.URL.revokeObjectURL(url);
      document.body.removeChild(iframe);
      this.openPdfInNewTab(blob);
    };
    
    iframe.onload = () => {
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.print();
        } catch (error) {
          console.error('Erreur lors de l\'impression:', error);
          this.openPdfInNewTab(blob);
        }
        
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    };
    
    iframe.src = url;
    document.body.appendChild(iframe);
  }

  /**
   * Méthode polyvalente pour gérer les documents
   */
  handleDocument(
    action: 'download' | 'view' | 'print' | 'test',
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string
  ): Observable<Blob | any> {
    switch (action) {
      case 'download':
      case 'view':
        return this.generatePdfQuittance(bureau, annee, code, serie, numero, false);
      case 'print':
        return this.generatePdfQuittance(bureau, annee, code, serie, numero, true);
      case 'test':
        return this.testQuittanceData(bureau, annee, code, serie, numero);
      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  }

  /**
   * Créer un nom de fichier personnalisé pour les téléchargements
   */
  createFilename(bureau: string, annee: number, code: string, serie: string, numero: string): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `quittance_${bureau}_${annee}_${code}_${serie}_${numero}_${date}.pdf`;
  }

  // ========== MÉTHODES DE COMPATIBILITÉ (ANCIENNES VERSIONS) ==========

  /**
   * Méthode de compatibilité avec anciens noms de paramètres
   * @deprecated Utilisez les nouvelles méthodes avec les bons noms de paramètres
   */
  generatePdfQuittanceOld(
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string,
    forPrint: boolean = false
  ): Observable<Blob> {
    console.warn('Méthode dépréciée. Utilisez generatePdfQuittance avec les nouveaux noms de paramètres.');
    return this.generatePdfQuittance(ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr, forPrint);
  }

  /**
   * Méthode originale conservée pour compatibilité
   */
  getQuitance(
    page: Page, 
    key: string, 
 
    bureau: string, 
    codDec: string, 
    serliq: string, 
    numliq: string, 
    annee: string
  ): Observable<PagedData<Quittance>> {
    const params = new HttpParams()
      
      .set('key', key)
    
      .set('bureau', bureau)
      .set('codDec', codDec)
      .set('serliq', serliq)
      .set('numliq', numliq)
      .set('annee', annee)
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());
    
    return this.http.get<PagedData<Quittance>>(`${this.BASE_URL}/api/oracle/quitanceOracle`, { params });
  }








  getQuitances(
    page: Page, 
    key: string, 
      nif: string, 
    bureau: string, 
    codDec: string, 
    serliq: string, 
    numliq: string, 
    annee: string
  ): Observable<PagedData<Quittance>> {
    const params = new HttpParams()
      
      .set('key', key)
      .set('nif', nif)
      .set('bureau', bureau)
      .set('codDec', codDec)
      .set('serliq', serliq)
      .set('numliq', numliq)
      .set('annee', annee)
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());
    
    return this.http.get<PagedData<Quittance>>(`${this.BASE_URL}/api/oracle/quitanceOracle`, { params });
  }

  // ========== GESTION D'ERREURS ==========

  /**
   * Journalisation des erreurs
   */
  private logError(message: string, error: any): void {
    console.error(`QuittanceService - ${message}:`, error);
  }

  /**
   * Vérifier la validité des paramètres avant l'envoi
   */
  private validateParams(bureau: string, annee: number, code: string, serie: string, numero: string): boolean {
    if (!bureau || !annee || !code || !serie || !numero) {
      console.error('Paramètres manquants pour la génération de quittance');
      return false;
    }
    return true;
  }

  /**
   * Méthode sécurisée qui valide avant d'appeler l'API
   */
  generatePdfQuittanceSafe(
    bureau: string,
    annee: number,
    code: string,
    serie: string,
    numero: string,
    impression: boolean = false
  ): Observable<Blob> {
    if (!this.validateParams(bureau, annee, code, serie, numero)) {
      throw new Error('Paramètres invalides pour la génération de quittance');
    }
    return this.generatePdfQuittance(bureau, annee, code, serie, numero, impression);
  }
}

  // Générer la quittance en PDF selon le endpoint du controller
 /* generatePdfQuittance(
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string,
    forPrint: boolean = false
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('ideCuoCod', ideCuoCod || '')
      .set('decRefYer', decRefYer?.toString() || '')
      .set('decCod', decCod || '')
      .set('ideAstSer', ideAstSer || '')
      .set('ideAstNbr', ideAstNbr || '')
      .set('forPrint', forPrint.toString());
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/generate`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  // Visualiser la quittance dans le navigateur
  viewQuittance(
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string
  ): Observable<Blob> {
    return this.generatePdfQuittance(
      ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr, false
    );
  }

  // Imprimer directement la quittance
  printQuittance(
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string
  ): Observable<Blob> {
    return this.generatePdfQuittance(
      ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr, true
    );
  }

  // Méthode utilitaire pour ouvrir un PDF dans un nouvel onglet
  openPdfInNewTab(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      // Si la fenêtre a été ouverte, nettoyer l'URL quand l'utilisateur la ferme
      newWindow.onclose = () => {
        window.URL.revokeObjectURL(url);
      };
    } else {
      // Si popup est bloqué, informer l'utilisateur et proposer un téléchargement
      console.warn('Ouverture de nouvel onglet bloquée. Téléchargement proposé à la place.');
      this.downloadPdf(blob);
      window.URL.revokeObjectURL(url);
    }
  }

  // Méthode utilitaire pour télécharger un PDF
  downloadPdf(blob: Blob, filename: string = 'Quittance.pdf'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Nettoyer l'URL après un court délai pour assurer que le téléchargement commence
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }

  // Méthode utilitaire pour lancer l'impression avec gestion des erreurs
  printPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    // Ajouter un gestionnaire d'erreur
    iframe.onerror = () => {
      console.error('Erreur lors du chargement du PDF pour impression');
      window.URL.revokeObjectURL(url);
      document.body.removeChild(iframe);
      // Proposer d'ouvrir dans un nouvel onglet à la place
      this.openPdfInNewTab(blob);
    };
    
    iframe.onload = () => {
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.print();
        } catch (error) {
          console.error('Erreur lors de l\'impression:', error);
          // Proposer une alternative en cas d'échec
          this.openPdfInNewTab(blob);
        }
        
        // Nettoyage après impression
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    };
    
    iframe.src = url;
    document.body.appendChild(iframe);
  }
  
  // Méthode polyvalente pour gérer les documents: télécharger, afficher ou imprimer
  handleDocument(
    action: 'download' | 'view' | 'print',
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string
  ): Observable<Blob> {
    switch (action) {
      case 'download':
        return this.generatePdfQuittance(
          ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr, false
        );
      case 'view':
        return this.viewQuittance(
          ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr
        );
      case 'print':
        return this.printQuittance(
          ideCuoCod, decRefYer, decCod, ideAstSer, ideAstNbr
        );
      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  }
  
  // Tester les données d'une quittance
  testQuittanceData(
    ideCuoCod: string,
    decRefYer: number,
    decCod: string,
    ideAstSer: string,
    ideAstNbr: string
  ): Observable<string> {
    const params = new HttpParams()
      .set('ideCuoCod', ideCuoCod || '')
      .set('decRefYer', decRefYer?.toString() || '')
      .set('decCod', decCod || '')
      .set('ideAstSer', ideAstSer || '')
      .set('ideAstNbr', ideAstNbr || '');
    
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/test-quittance`, {
      params,
      responseType: 'text'
    });
  }
  
  // Vider le cache des quittances (admin seulement)
  clearCache(): Observable<string> {
    return this.http.get(`${this.BASE_URL}/api/reports/oracle/quittance/clear-cache`, {
      responseType: 'text'
    });
  }
  
  // Journalisation des erreurs pour faciliter le débogage
  private logError(message: string, error: any): void {
    console.error(`QuittanceService - ${message}:`, error);
  }

  // Conserver la méthode originale pour compatibilité si nécessaire
  getQuitance(page: Page, key: string, bureau: string, codDec: string, serliq: string, numliq: string, annee: string
  ): Observable<PagedData<Quittance>> {
    const params = new HttpParams()
      .set('key', key)
      .set('bureau', bureau)
      .set('codDec', codDec)
      .set('serliq', serliq)
      .set('numliq', numliq)
      .set('annee', annee)
      .set('page', page.pageNumber.toString())
      .set('size', page.size.toString());
    
    return this.http.get<PagedData<Quittance>>(`${this.BASE_URL}/api/oracle/quitanceOracle`, { params });
  }
} */
/*
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from 'src/models/Page';
import { PagedData } from 'src/models/paged-data';
import { Quittance } from 'src/models/quittance';

@Injectable({
  providedIn: 'root'
})
export class QuittanceService {
  // Utiliser l'URL depuis l'environnement pour plus de flexibilité comme dans SituationDeclarationService
  private BASE_URL = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  // Générer la quittance en PDF à télécharger
  generatePdfQuittance(
    customsOffice: string,
    declarationYear: string,
    declarationCode: string,
    assessmentSeries: string,
    assessmentNumber: string
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('customsOffice', customsOffice || '')
      .set('declarationYear', declarationYear || '')
      .set('declarationCode', declarationCode || '')
      .set('assessmentSeries', assessmentSeries || '')
      .set('assessmentNumber', assessmentNumber || '');
    
    return this.http.get(`${this.BASE_URL}/api/oracle/quittance/pdf`, {
      params,
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  // Visualiser la quittance dans le navigateur
  viewQuittance(
    customsOffice: string,
    declarationYear: string,
    declarationCode: string,
    assessmentSeries: string,
    assessmentNumber: string
  ): Observable<Blob> {
    // Ajouter un timestamp unique pour éviter le cache, comme dans SituationDeclarationService
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    const uniqueParam = `${timestamp}_${random}`;
    
    const params = new HttpParams()
      .set('customsOffice', customsOffice || '')
      .set('declarationYear', declarationYear || '')
      .set('declarationCode', declarationCode || '')
      .set('assessmentSeries', assessmentSeries || '')
      .set('assessmentNumber', assessmentNumber || '')
      .set('nocache', uniqueParam); // Force une nouvelle requête
    
    // Headers anti-cache comme dans SituationDeclarationService
    const headers = new HttpHeaders({
      'Accept': 'application/pdf',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    return this.http.get(`${this.BASE_URL}/api/quittance/view`, {
      params,
      responseType: 'blob',
      headers
    });
  }

  // Imprimer directement la quittance
  printQuittance(
    customsOffice: string,
    declarationYear: string,
    declarationCode: string,
    assessmentSeries: string,
    assessmentNumber: string
  ): Observable<Blob> {
    // Ajouter un timestamp unique pour éviter le cache
    const timestamp = new Date().getTime();
    
    const params = new HttpParams()
      .set('customsOffice', customsOffice || '')
      .set('declarationYear', declarationYear || '')
      .set('declarationCode', declarationCode || '')
      .set('assessmentSeries', assessmentSeries || '')
      .set('assessmentNumber', assessmentNumber || '')
      .set('_', timestamp.toString()); // Anti-cache
    
    const headers = new HttpHeaders({
      'Accept': 'application/pdf',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    return this.http.get(`${this.BASE_URL}/api/oracle/quittance/print`, {
      params,
      responseType: 'blob',
      headers
    });
  }

  // Méthode utilitaire pour ouvrir un PDF dans un nouvel onglet
  openPdfInNewTab(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      // Si la fenêtre a été ouverte, nettoyer l'URL quand l'utilisateur la ferme
      newWindow.onclose = () => {
        window.URL.revokeObjectURL(url);
      };
    } else {
      // Si popup est bloqué, informer l'utilisateur et proposer un téléchargement
      console.warn('Ouverture de nouvel onglet bloquée. Téléchargement proposé à la place.');
      this.downloadPdf(blob);
      window.URL.revokeObjectURL(url);
    }
  }

  // Méthode utilitaire pour télécharger un PDF, similaire 
  downloadPdf(blob: Blob, filename: string = 'Quittance.pdf'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Nettoyer l'URL après un court délai pour assurer que le téléchargement commence
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }

  // Méthode utilitaire pour lancer l'impression avec gestion des erreurs
  printPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    // Ajouter un gestionnaire d'erreur
    iframe.onerror = () => {
      console.error('Erreur lors du chargement du PDF pour impression');
      window.URL.revokeObjectURL(url);
      document.body.removeChild(iframe);
      // Proposer d'ouvrir dans un nouvel onglet à la place
      this.openPdfInNewTab(blob);
    };
    
    iframe.onload = () => {
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.print();
        } catch (error) {
          console.error('Erreur lors de l\'impression:', error);
          // Proposer une alternative en cas d'échec
          this.openPdfInNewTab(blob);
        }
        
        // Nettoyage après impression
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    };
    
    iframe.src = url;
    document.body.appendChild(iframe);
  }
  
  // Méthode polyvalente pour gérer les documents: télécharger, afficher ou imprimer
  handleDocument(
    action: 'download' | 'view' | 'print',
    customsOffice: string,
    declarationYear: string,
    declarationCode: string,
    assessmentSeries: string,
    assessmentNumber: string
  ): Observable<Blob> {
    switch (action) {
      case 'download':
        return this.generatePdfQuittance(
          customsOffice, declarationYear, declarationCode, 
          assessmentSeries, assessmentNumber
        );
      case 'view':
        return this.viewQuittance(
          customsOffice, declarationYear, declarationCode, 
          assessmentSeries, assessmentNumber
        );
      case 'print':
        return this.printQuittance(
          customsOffice, declarationYear, declarationCode, 
          assessmentSeries, assessmentNumber
        );
      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  }
  
  // Journalisation des erreurs pour faciliter le débogage
  private logError(message: string, error: any): void {
    console.error(`QuittanceService - ${message}:`, error);
  }






  getQuitance(page: Page, key: string, bureau: string,codDec: string, serliq: string,numliq: string, annee: string
   ): Observable<PagedData<Quittance>> {
     const params = new HttpParams()
       .set('key', key) // Associe la clé au paramètre key
       .set('bureau', bureau) // Ajoute le NIF au paramètre nif
       .set('codDec', codDec) // Ajoute le NIF au paramètre nif
       .set('serliq', serliq) // Ajoute le NIF au paramètre nif
       .set('numliq', numliq) // Ajoute le NIF au paramètre nif
       .set('annee', annee) // Ajoute le NIF au paramètre nif

       .set('page', page.pageNumber.toString())
       .set('size', page.size.toString());
       
       
     return this.http.get<PagedData<Quittance>>(`${this.BASE_URL}/api/oracle/quitanceOracle`, { params });
   }
}  */