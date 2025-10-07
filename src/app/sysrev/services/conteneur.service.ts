import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AffectationConteneur } from '../models/AffectationConteneur';
import { PageResponse } from '../models/PageResponse';


@Injectable({
  providedIn: 'root'
})
export class ConteneurService {
  private readonly BASE_URL = `${environment.defaultauth}`;


    // Remplacer par l'URL réelle de votre API
    private getHeaders(): HttpHeaders {
      const token = sessionStorage.getItem('token');
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      if (token) {
        // Nettoyer le token des guillemets si présents
        const cleanToken = token.replace(/"/g, '');
        headers = headers.set('Authorization', `Bearer ${cleanToken}`);
      }
  
      return headers;
    }

  // État de recherche centralisé
   private searchParamsSubject = new BehaviorSubject<any>({
    searchKey: "",        // ✅ CHANGÉ: search → searchKey (correspond au backend)
    codeDeclarant: "",
    dateDebut: null,   
    dateFin: null,     
    page: 0,
    size: 10
  });

  searchParams$ = this.searchParamsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ✅ MÉTHODES EXISTANTES CONSERVÉES
  getConteneurs(reference: string): Observable<AffectationConteneur> {
    return this.http.get<AffectationConteneur>(`${this.BASE_URL}/conteneur/${reference}`);
  }

  getConteneeurByDeclaration(uuid: string): Observable<AffectationConteneur> {
    return this.http.get<AffectationConteneur>(`${this.BASE_URL}/conteneurbydec/${uuid}`);
  }

  getConteneurAffectation(): Observable<AffectationConteneur> {
    return this.http.get<AffectationConteneur>(`${this.BASE_URL}/conteneur`);
  }

  getByScan(numero: string): Observable<AffectationConteneur> {
    return this.http.get<AffectationConteneur>(`${this.BASE_URL}/conteneur/scan/${numero}`);
  }

  constationDeSortie(numero: string): Observable<AffectationConteneur> {
    return this.http.get<AffectationConteneur>(`${this.BASE_URL}/conteneur/constationDeSortie/${numero}`);
  }

  addConteneur(conteneur: AffectationConteneur): Observable<AffectationConteneur> {
    return this.http.post<AffectationConteneur>(`${this.BASE_URL}/conteneur`, conteneur);
  }
  modifierChauffeur(conteneur: any): Observable<any> {
  return this.http.put(`${this.BASE_URL}/modifier-chauffeur`, conteneur);
}

// Vous pouvez aussi ajouter une méthode pour récupérer les détails d'un conteneur
getConteneurDetails(numero: string): Observable<any> {
  return this.http.get(`${this.BASE_URL}/details/${numero}`);
}

  // ✅ MÉTHODE PRINCIPALE CORRIGÉE - Conforme au backend Spring Boot
  getConteneursWithPaginationAndSearch(params: any): Observable<PageResponse<AffectationConteneur>> {
    console.log('🔍 Paramètres reçus du frontend:', params);
    
    // ✅ RÉCUPÉRATION DU RÔLE ET UTILISATEUR directement depuis sessionStorage
    const userRole = this.getCurrentUserRole();  // ✅ Utilise la méthode qui nettoie les guillemets
    const currentUser = this.getCurrentUsername();  // ✅ Utilise la méthode qui nettoie les guillemets
    
    console.log('👤 Utilisateur actuel:', { 
      username: currentUser,
      role: userRole
    });

    let httpParams = new HttpParams();
    
    // ✅ GESTION DU CODE DÉCLARANT SELON LE RÔLE (logique backend répliquée)
    let effectiveCodeDeclarant = '';
    
    switch (userRole) {
      case 'DG':
        // Le DG peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🔑 DG - Code déclarant demandé:', effectiveCodeDeclarant);
        break;
        case 'CHEF_LIVREUR':
        // Le DG peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🔑 chef livreur - Code déclarant demandé:', effectiveCodeDeclarant);
        break;
        case 'DGA':
        // Le DGA peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🔑 DGA - Code déclarant demandé:', effectiveCodeDeclarant);
        break;

      case 'DIS':
        // Le DIS peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🔑 DIS - Code déclarant demandé:', effectiveCodeDeclarant);
        break;

      case 'CHEF_BUREAU_PARC':
        // Le chef de parc peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🛂 CHEF_BUREAU_PARC - Code déclarant demandé:', effectiveCodeDeclarant);
        break;

      case 'DECLARANT':
        // Le déclarant ne voit que ses données (ignore le filtre frontend)
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🔒 DECLARANT - Backend gérera via token/session');
        break;
        
      case 'DOUANE':
        // Le douanier peut filtrer par déclarant ou voir global
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('🛂 DOUANE - Code déclarant demandé:', effectiveCodeDeclarant);
        break;

      case 'ADMIN':
        // L'admin peut tout voir
        effectiveCodeDeclarant = params.codeDeclarant || '';
        console.log('⚙️ ADMIN - Code déclarant demandé:', effectiveCodeDeclarant);
        break;

        case 'SDT':
          // L'admin peut tout voir
          effectiveCodeDeclarant = params.codeDeclarant || '';
          console.log('⚙️ ADMIN - Code déclarant demandé:', effectiveCodeDeclarant);
          break; 
        
      default:
        console.warn('⚠️ Rôle non reconnu:', userRole);
        effectiveCodeDeclarant = '';
    }
    
    // ✅ MAPPING EXACT avec les paramètres attendus par le backend
    const backendParams: { [key: string]: any } = {
      searchKey: params.keyword || params.searchKey || params.search || '',  // Terme de recherche global
      codeDeclarant: effectiveCodeDeclarant,                                  // Code déclarant effectif selon le rôle
      dateDebut: params.startDate || params.dateDebut,                        // Date début
      dateFin: params.endDate || params.dateFin,                             // Date fin
      page: params.page || 0,                                                 // Numéro de page
      size: params.size || 10                                                 // Taille de page
    };
    
    console.log('🔄 Paramètres mappés pour le backend (avec rôle):', backendParams);
    
    // Construction des paramètres HTTP
    Object.keys(backendParams).forEach(key => {
      const value = backendParams[key];
      
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'dateDebut' || key === 'dateFin') {
          // ✅ FORMAT DE DATE ATTENDU PAR LE BACKEND (yyyy-MM-dd)
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split('T')[0];
            httpParams = httpParams.set(key, formattedDate);
            console.log(`📅 Date ${key} formatée:`, formattedDate);
          }
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    // ✅ ENDPOINT CONFORME AU CONTROLLER (/search)
    const endpoint = `${this.BASE_URL}/search`;
    const fullUrl = `${endpoint}?${httpParams.toString()}`;
    
    console.log('🌐 URL complète:', fullUrl);
    console.log('👤 Requête envoyée avec le rôle:', userRole);
    
    return this.http.get<any>(endpoint, { params: httpParams })
      .pipe(
        tap((response: any) => {
          console.log('📦 Réponse brute du backend pour le rôle', userRole, ':', response);
          console.log('📊 Structure de la réponse:', {
            hasData: !!response?.data,
            dataLength: response?.data?.length || 0,
            hasPage: !!response?.page,
            totalElements: response?.page?.totalElements || 0,
            totalPages: response?.page?.totalPages || 0
          });
        }),
        map((response: any) => {
          // ✅ ADAPTATION DE LA STRUCTURE DE RÉPONSE
          // Le backend renvoie PageDataDto<ConteneurAffectationDto>
          if (response && response.data && response.page) {
            return {
              data: response.data,
              page: {
                pageNumber: response.page.pageNumber,
                size: response.page.size,
                totalElements: response.page.totalElements,
                totalPages: response.page.totalPages
              }
            } as PageResponse<AffectationConteneur>;
          } else {
            console.warn('⚠️ Structure de réponse inattendue:', response);
            return {
              data: [],
              page: {
                pageNumber: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0
              }
            } as PageResponse<AffectationConteneur>;
          }
        }),
        catchError((error: any) => {
          console.error('❌ Erreur lors de la recherche de conteneurs pour le rôle', userRole, ':', error);
          
          // Informations de débogage détaillées
          if (error.status) {
            console.error(`❌ Status HTTP: ${error.status}`);
            console.error(`❌ URL: ${error.url}`);
            console.error(`❌ Message: ${error.message}`);
            
            if (error.status === 404) {
              console.error('❌ Endpoint non trouvé - Vérifiez que /search existe');
            } else if (error.status === 400) {
              console.error('❌ Paramètres invalides:', error.error);
            } else if (error.status === 500) {
              console.error('❌ Erreur serveur - Vérifiez les logs du backend');
            } else if (error.status === 403) {
              console.error('❌ Accès refusé - Vérifiez les permissions pour le rôle:', userRole);
            }
          }
          
          // Retourner une réponse vide en cas d'erreur
          return of({
            data: [],
            page: {
              pageNumber: 0,
              size: 10,
              totalElements: 0,
              totalPages: 0
            }
          } as PageResponse<AffectationConteneur>);
        })
      );
  }

  // ✅ MÉTHODE POUR LES STATISTIQUES (à implémenter côté backend)
   getStatistiquesConteneurs(params: any = {}): Observable<any> {
    const userRole = this.getCurrentUserRole();  // ✅ Utilise la méthode qui nettoie les guillemets
    const currentUser = this.getCurrentUsername();  // ✅ Utilise la méthode qui nettoie les guillemets
    
    let httpParams = new HttpParams();
    
    // ✅ GESTION DU CODE DÉCLARANT SELON LE RÔLE POUR LES STATISTIQUES
    let effectiveCodeDeclarant = '';
    
    switch (userRole) {
      case 'DG':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
        case 'DGA':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
        case 'DIS':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
        case 'CHEF_LIVREUR':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
        case 'CHEF_BUREAU_PARC':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
      case 'DECLARANT':
        // Pour les déclarants, le backend gérera via le token/session
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
      case 'DOUANE':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
      case 'ADMIN':
        effectiveCodeDeclarant = params.codeDeclarant || '';
        break;
    }
    
    // Même logique de formatage des paramètres
    if (effectiveCodeDeclarant) {
      httpParams = httpParams.set('codeDeclarant', effectiveCodeDeclarant);
    }
    if (params.startDate || params.dateDebut) {
      const date = new Date(params.startDate || params.dateDebut);
      if (!isNaN(date.getTime())) {
        httpParams = httpParams.set('dateDebut', date.toISOString().split('T')[0]);
      }
    }
    if (params.endDate || params.dateFin) {
      const date = new Date(params.endDate || params.dateFin);
      if (!isNaN(date.getTime())) {
        httpParams = httpParams.set('dateFin', date.toISOString().split('T')[0]);
      }
    }
    
    console.log('📊 Appel statistiques avec rôle:', { userRole, effectiveCodeDeclarant, params: httpParams.toString() });
    
    // ✅ ENDPOINT POUR LES STATISTIQUES
    const endpoint = `${this.BASE_URL}/statistiques`;
    
    return this.http.get<any>(endpoint, { params: httpParams })
      .pipe(
        tap((response: any) => {
          console.log('📈 Statistiques reçues pour le rôle', userRole, ':', response);
        }),
        catchError((error: any) => {
          console.warn('⚠️ Endpoint statistiques non disponible pour le rôle', userRole, ', utilisation de données par défaut');
          console.warn('⚠️ Erreur:', error.status, error.message);
          
          // Fallback avec statistiques par défaut selon le rôle
          return of({
            totalConteneurs: 0,
            conteneursSortis: 0,
            conteneursEnAttente: 0,
            pourcentageSortie: 0,
            roleUtilisateur: userRole,
            codeDeclarantEffectif: effectiveCodeDeclarant
          });
        })
      );
  }

  // ✅ MÉTHODES UTILITAIRES POUR LA GESTION DE L'ÉTAT (inchangées)
  updateSearchParams(newParams: any): void {
    const currentParams = this.searchParamsSubject.getValue();
    const updatedParams = { ...currentParams, ...newParams };
    
    console.log('🔄 Mise à jour des paramètres de recherche:', updatedParams);
    this.searchParamsSubject.next(updatedParams);
  }

  getSearchParamsValue(): any {
    return this.searchParamsSubject.getValue();
  }

  // ✅ MÉTHODE DE TEST POUR VALIDER LA CONNEXION (mise à jour avec contexte rôle)
  testConnection(): Observable<any> {
    const userRole = this.getCurrentUserRole();  // ✅ Utilise la méthode qui nettoie les guillemets
    console.log('🧪 Test de connexion avec le backend pour le rôle:', userRole);
    
    const testParams = {
      page: 0,
      size: 1
    };
    
    return this.getConteneursWithPaginationAndSearch(testParams)
      .pipe(
        tap((response) => {
          console.log('✅ Test de connexion réussi pour le rôle', userRole, ':', response);
        }),
        catchError((error) => {
          console.error('❌ Test de connexion échoué pour le rôle', userRole, ':', error);
          throw error;
        })
      );
  }

// ✅ NOUVELLES MÉTHODES UTILITAIRES POUR LA GESTION DES RÔLES

  /**
   * Récupère le rôle de l'utilisateur courant
   */
  getCurrentUserRole(): string {
    const role = sessionStorage.getItem('role') || '';
    // ✅ CORRECTION : Supprimer les guillemets supplémentaires si présents
    return role.replace(/"/g, '');
  }

  /**
   * Récupère le nom d'utilisateur courant
   */
  getCurrentUsername(): string {
    const username = JSON.parse(sessionStorage.getItem('currentUser') || '""');
    // ✅ CORRECTION : Supprimer les guillemets supplémentaires si présents
    return typeof username === 'string' ? username.replace(/"/g, '') : username;
  }

  /**
   * Vérifie si l'utilisateur est un DG
   */
  isDG(): boolean {
    return this.getCurrentUserRole() === 'DG';
  }

  isDGA(): boolean {
    return this.getCurrentUserRole() === 'DGA';
  }
  isDIS(): boolean {
    return this.getCurrentUserRole() === 'DIS';
  }
  isChefparc(): boolean {
    return this.getCurrentUserRole() === 'CHEF_BUREAU_PARC';
  }
  /**
   * Vérifie si l'utilisateur est un déclarant
   */
  isDeclarant(): boolean {
    return this.getCurrentUserRole() === 'DECLARANT';
  }

  /**
   * Vérifie si l'utilisateur est de la douane
   */
  isDouane(): boolean {
    return this.getCurrentUserRole() === 'DOUANE';
  }

  /**
   * Vérifie si l'utilisateur est un admin
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ADMIN';
  }

  /**
   * Vérifie si l'utilisateur a un accès filtré (déclarant uniquement)
   */
  hasFilteredAccess(): boolean {
    return this.isDeclarant();
  }

  /**
   * Obtient le nom d'affichage du rôle
   */
  getRoleDisplayName(): string {
    switch (this.getCurrentUserRole()) {
      case 'DG': return 'Directeur Général';
      case 'DECLARANT': return 'Déclarant';
      case 'DOUANE': return 'Douane';
      case 'ADMIN': return 'Administrateur';
      case 'CHEF_LIVREUR': return 'Chef de Livreur';
      case 'CHEF_BUREAU_PARC': return 'Chef de Bureau Parc';
      case 'DGA': return 'Directeur Général Adjoint';
      case 'DIS': return 'Directeur Informatique et  Des Statistique';
      default: return 'Utilisateur';
    }
  }

  /**
   * Vérifie si l'utilisateur peut modifier le filtre code déclarant
   */
  canModifyCodeDeclarant(): boolean {
    return this.getCurrentUserRole() !== 'DECLARANT';
  }

  /**
   * Obtient la configuration d'interface selon le rôle
   */
  getInterfaceConfig(): {
    showCodeDeclarantFilter: boolean;
    showGlobalStatistics: boolean;
    contextTitle: string;
    contextMessage: string;
  } {
    const userRole = this.getCurrentUserRole();
    const username = this.getCurrentUsername();

    switch (userRole) {
      case 'DG':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques DG - Vue Globale',
          contextMessage: 'Accès à toutes les données ou filtrage par déclarant'
        };
        case 'DGA':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques DGA - Vue Globale',
          contextMessage: 'Accès à toutes les données ou filtrage par déclarant'
        };
        
      case 'DIS':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques DIS - Vue Globale',
          contextMessage: 'Accès à toutes les données ou filtrage par déclarant'
        };
        
      case 'CHEF_BUREAU_PARC':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques Chef de Parc - Vue Globale',
          contextMessage: 'Accès à toutes les données ou filtrage par déclarant'
        };
        
      case 'CHEF_LIVREUR':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques Chef de Livreur - Vue Globale',
          contextMessage: 'Accès à toutes les données ou filtrage par déclarant'
        };
      case 'DECLARANT':
        return {
          showCodeDeclarantFilter: false,  // ✅ MASQUÉ pour les déclarants
          showGlobalStatistics: false,
          contextTitle: 'Statistiques Déclarant',
          contextMessage: 'Vos conteneurs et données'
        };
        
      case 'DOUANE':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques Douane',
          contextMessage: 'Contrôle des conteneurs sortis'
        };

      case 'ADMIN':
        return {
          showCodeDeclarantFilter: true,
          showGlobalStatistics: true,
          contextTitle: 'Statistiques Administrateur',
          contextMessage: 'Administration système'
        };
        
      default:
        return {
          showCodeDeclarantFilter: false,
          showGlobalStatistics: false,
          contextTitle: 'Statistiques',
          contextMessage: 'Accès limité'
        };
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté et a les permissions
   */
  isUserConnectedWithPermissions(): boolean {
    const hasToken = !!sessionStorage.getItem('token');
    const hasRole = !!this.getCurrentUserRole();
    const hasUsername = !!this.getCurrentUsername();
    
    console.log('🔐 Vérification permissions:', {
      hasToken,
      hasRole,
      hasUsername,
      role: this.getCurrentUserRole()
    });
    
    return hasToken && hasRole && hasUsername;
  }

//statistique par destination

  /**
 * Récupère les statistiques de destination avec pagination backend
 * Backend retourne: PageDataDto<StatistiquesDestinationDto>
 * @param params Paramètres de filtrage et pagination
 * @returns Observable avec les données paginées
 */
getStatistiquesDestinations(params: any = {}): Observable<any> {
  const userRole = this.getCurrentUserRole();
  const currentUser = this.getCurrentUsername();
  
  console.log('📍 Appel statistiques destinations paginées:', { 
    userRole, 
    currentUser, 
    params 
  });
  
  // Vérification du rôle DG côté frontend
  if (userRole !== 'DG' && userRole !== 'DGA' && userRole !== 'DIS' && userRole !== 'CHEF_BUREAU_PARC') {
    console.warn('⚠️ Accès refusé - Seul le DG peut voir les destinations');
    return throwError(() => new Error('Accès non autorisé. Les statistiques destinations sont réservées au DG.'));
  }
  
  let httpParams = new HttpParams();
  
  // Paramètres backend avec pagination
  const backendParams: { [key: string]: any } = {
    codeDeclarantFiltre: params.codeDeclarant || params.codeDeclarantFiltre || '',
    dateDebut: params.startDate || params.dateDebut,
    dateFin: params.endDate || params.dateFin,
    page: params.page || 0,
    size: params.size || 10
  };
  
  console.log('📍 Paramètres destinations avec pagination:', backendParams);
  
  // Construction des paramètres HTTP
  Object.keys(backendParams).forEach(key => {
    const value = backendParams[key];
    
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'dateDebut' || key === 'dateFin') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const formattedDate = date.toISOString().split('T')[0];
          httpParams = httpParams.set(key, formattedDate);
          console.log(`📅 Date destinations ${key} formatée:`, formattedDate);
        }
      } else {
        httpParams = httpParams.set(key, value.toString());
      }
    }
  });

  // Endpoint pour les statistiques destinations paginées
  const endpoint = `${this.BASE_URL}/destionation/statistiques`;
  
  console.log('📍 URL destinations paginée:', `${endpoint}?${httpParams.toString()}`);
  console.log('👤 Requête destinations paginée avec rôle DG:', userRole);
  
  return this.http.get<any>(endpoint, { 
    params: httpParams,
    headers: this.getHeaders()
  }).pipe(
    tap((response: any) => {
      console.log('📦 Réponse destinations paginée:', response);
      console.log('📊 Structure destinations paginée:', {
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
        hasPage: !!response?.page,
        totalElements: response?.page?.totalElements || 0,
        totalPages: response?.page?.totalPages || 0,
        currentPage: response?.page?.pageNumber || 0
      });
    }),
    map((response: any) => {
      // Backend retourne PageDataDto<StatistiquesDestinationDto>
      if (response && response.data && response.page) {
        
        // Transformer les données pour votre composant existant
        const transformedDestinations = this.transformDestinationsFromPageData(response.data);
        
        return {
          // Données dans le format de votre composant existant
          destinations: transformedDestinations,
          // Informations de pagination
          pagination: {
            currentPage: response.page.pageNumber,
            pageSize: response.page.size,
            totalElements: response.page.totalElements,
            totalPages: response.page.totalPages,
            hasNext: response.page.pageNumber < (response.page.totalPages - 1),
            hasPrevious: response.page.pageNumber > 0
          },
          // Données brutes si besoin
          rawData: response.data,
          rawPage: response.page
        };
      } else {
        console.warn('⚠️ Structure réponse destinations inattendue:', response);
        return {
          destinations: [],
          pagination: {
            currentPage: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
          },
          rawData: [],
          rawPage: null
        };
      }
    }),
    catchError((error: any) => {
      console.error('❌ Erreur destinations paginées pour DG:', error);
      
      if (error.status) {
        console.error(`❌ Status destinations: ${error.status}`);
        console.error(`❌ URL destinations: ${error.url}`);
        
        if (error.status === 403) {
          console.error('❌ Accès destinations refusé - Vérifiez que l\'utilisateur est bien DG');
        } else if (error.status === 404) {
          console.error('❌ Endpoint destinations non trouvé - Vérifiez /destionation/statistiques');
        } else if (error.status === 500) {
          console.error('❌ Erreur serveur destinations - Vérifiez les logs backend');
        }
      }
      
      // Retourner une réponse vide en cas d'erreur
      return of({
        destinations: [],
        pagination: {
          currentPage: 0,
          pageSize: 10,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        },
        rawData: [],
        rawPage: null
      });
    })
  );
}
/**
 * Transforme les StatistiquesDestinationDto du backend vers votre format composant
 * @param destinationsData Données du backend (Array de StatistiquesDestinationDto)
 * @returns Données dans le format de votre composant existant
 */
private transformDestinationsFromPageData(destinationsData: any[]): any[] {
  if (!destinationsData || !Array.isArray(destinationsData)) {
    return [];
  }

  return destinationsData.map((dto: any) => {
    // Votre backend retourne des StatistiquesDestinationDto
    // Adapter selon la structure exacte de votre DTO backend
    
    // Si le DTO contient statistiquesParDestination (liste avec une destination)
    if (dto.statistiquesParDestination && dto.statistiquesParDestination.length > 0) {
      const destData = dto.statistiquesParDestination[0];
      
      // Récupérer les données complètes depuis statistiquesCompletesParDestination
      const completeData = dto.statistiquesCompletesParDestination?.find(
        (complete: any) => complete.destination === destData.destination
      );
      
      return {
        destination: destData.destination || 'Destination Non Spécifiée',
        total: completeData?.total || destData.nombreConteneurs || 0,
        sortis: completeData?.sortis || destData.nombreConteneurs || 0,
        enAttente: completeData?.enAttente || 0,
        tauxSortie: completeData?.tauxSortie || 0
      };
    }
    
    // Si le DTO a une structure directe (selon votre implémentation backend)
    return {
      destination: dto.destination || 'Destination Non Spécifiée',
      total: dto.total || dto.nombreConteneurs || 0,
      sortis: dto.sortis || dto.nombreConteneurs || 0,
      enAttente: dto.enAttente || 0,
      tauxSortie: dto.tauxSortie || 0
    };
  });
}
// Dans votre ConteneurService, modifiez ou ajoutez cette méthode :

rechercherConteneursListeApurement(
  searchKey: string,
  page: number,
  size: number,
  dateDebut: string,
  dateFin: string,
  status?: boolean // Paramètre optionnel
): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  // Ajouter les paramètres optionnels seulement s'ils ont des valeurs
  if (dateDebut && dateDebut.trim()) {
    params = params.set('dateDebut', dateDebut);
  }
  
  if (dateFin && dateFin.trim()) {
    params = params.set('dateFin', dateFin);
  }
  
  if (searchKey && searchKey.trim()) {
    params = params.set('key', searchKey);
  }

  // MODIFICATION : Ajouter status seulement si fourni
  if (status !== undefined && status !== null) {
    params = params.set('status', status.toString());
  }
  // Si status n'est pas fourni, ne pas l'ajouter aux paramètres

  const url = `${this.BASE_URL}/api/apurement/filtered`;
  
  console.log('URL d\'apurement:', url);
  console.log('Paramètres:', params.toString());

  return this.http.get<any>(url, { 
    params,
    headers: this.getHeaders()
  }).pipe(
    tap((response: any) => {
      console.log('Réponse backend apurement:', response);
    }),
    map((response: any) => {
      return {
        data: response.data || [],
        totalElements: response.page?.totalElements || 0,
        totalPages: response.page?.totalPages || 0,
        currentPage: response.page?.pageNumber || 0,
        size: response.page?.size || size
      };
    }),
    catchError((error: any) => {
      console.error('Erreur apurement:', error);
      return of({ 
        data: [], 
        totalElements: 0, 
        totalPages: 0, 
        currentPage: 0, 
        size: size 
      });
    })
  );
}

/**
 * Récupère la liste des rendez-vous par validité syndicat
 * @param validSyndicat Boolean pour filtrer par validité syndicat
 * @returns Observable avec la liste des rendez-vous
 */
getListeRendezVousByValidSyndicat(validSyndicat: boolean): Observable<any[]> {
  const userRole = this.getCurrentUserRole();
  const currentUser = this.getCurrentUsername();
  
  console.log('📋 Appel liste rendez-vous par validité syndicat:', { 
    userRole, 
    currentUser, 
    validSyndicat 
  });
  
  let httpParams = new HttpParams();
  httpParams = httpParams.set('validSyndicat', validSyndicat.toString());
  
  const endpoint = `${this.BASE_URL}/liste-rendez-vous-by-valid-syndicat`;
  const fullUrl = `${endpoint}?${httpParams.toString()}`;
  
  console.log('🌐 URL complète:', fullUrl);
  console.log('👤 Requête envoyée avec le rôle:', userRole);
  
  return this.http.get<any[]>(endpoint, { 
    params: httpParams,
    headers: this.getHeaders()
  }).pipe(
    tap((response: any[]) => {
      console.log('📦 Réponse liste rendez-vous par validité syndicat:', response);
      console.log('📊 Nombre d\'éléments reçus:', response?.length || 0);
    }),
    map((response: any[]) => {
      // Vérifier que la réponse est un tableau
      if (Array.isArray(response)) {
        return response;
      } else {
        console.warn('⚠️ Réponse n\'est pas un tableau:', response);
        return [];
      }
    }),
    catchError((error: any) => {
      console.error('❌ Erreur lors de la récupération des rendez-vous par validité syndicat:', error);
      
      if (error.status) {
        console.error(`❌ Status HTTP: ${error.status}`);
        console.error(`❌ URL: ${error.url}`);
        console.error(`❌ Message: ${error.message}`);
        
        if (error.status === 404) {
          console.error('❌ Endpoint non trouvé - Vérifiez que /liste-rendez-vous-by-valid-syndicat existe');
        } else if (error.status === 400) {
          console.error('❌ Paramètres invalides:', error.error);
        } else if (error.status === 500) {
          console.error('❌ Erreur serveur - Vérifiez les logs du backend');
        } else if (error.status === 403) {
          console.error('❌ Accès refusé - Vérifiez les permissions pour le rôle:', userRole);
        }
      }
      
      // Retourner un tableau vide en cas d'erreur
      return of([]);
    })
  );
}
//validationsdt
validerRendezVousSYC(uuid: string, validationData: any): Observable<any> {
  console.log('📝 Validation RDV par SYC:', { uuid, validationData });
  
  const endpoint = `${this.BASE_URL}/valider-syc/${uuid}`;
  
  return this.http.put<any>(endpoint, validationData, {
    headers: this.getHeaders()
  }).pipe(
    tap((response: any) => {
      console.log('✅ RDV validé par SYC:', response);
    }),
    catchError((error: any) => {
      console.error('❌ Erreur validation SYC:', error);
      throw error;
    })
  );
}
/**
 * Récupérer la liste paginée des rendez-vous validés par le syndicat (SDT)
 * @param page Numéro de la page (commence à 0)
 * @param size Taille de la page
 * @returns Observable avec les données paginées
 */
getRendezVousValidesSYC(page: number = 0, size: number = 20): Observable<any> {
  console.log('📋 Appel RDV validés SYC - Page:', page, 'Size:', size);
  
  const userRole = this.getCurrentUserRole();
  const currentUser = this.getCurrentUsername();
  
  console.log('👤 Utilisateur:', currentUser, '- Rôle:', userRole);
  
  let httpParams = new HttpParams();
  httpParams = httpParams.set('page', page.toString());
  httpParams = httpParams.set('size', size.toString());
  
  const endpoint = `${this.BASE_URL}/liste-rdv-valides-syc`;
  const fullUrl = `${endpoint}?${httpParams.toString()}`;
  
  console.log('🌐 URL complète:', fullUrl);
  
  return this.http.get<any>(endpoint, { 
    params: httpParams,
    headers: this.getHeaders()
  }).pipe(
    tap((response: any) => {
      console.log('📦 Réponse RDV validés SYC:', response);
      console.log('📊 Structure:', {
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
        hasPage: !!response?.page,
        totalElements: response?.page?.totalElements || 0,
        totalPages: response?.page?.totalPages || 0,
        currentPage: response?.page?.pageNumber || 0
      });
    }),
    map((response: any) => {
      // Adapter la structure de réponse si nécessaire
      if (response && response.data && response.page) {
        return {
          data: response.data,
          totalElements: response.page.totalElements,
          totalPages: response.page.totalPages,
          currentPage: response.page.pageNumber,
          size: response.page.size
        };
      } else {
        console.warn('⚠️ Structure de réponse inattendue:', response);
        return {
          data: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          size: size
        };
      }
    }),
    catchError((error: any) => {
      console.error('❌ Erreur RDV validés SYC:', error);
      
      if (error.status) {
        console.error(`❌ Status HTTP: ${error.status}`);
        console.error(`❌ URL: ${error.url}`);
        console.error(`❌ Message: ${error.message}`);
        
        if (error.status === 404) {
          console.error('❌ Endpoint non trouvé - Vérifiez /liste-rdv-valides-syc');
        } else if (error.status === 403) {
          console.error('❌ Accès refusé - Vérifiez les permissions pour le rôle:', userRole);
        } else if (error.status === 500) {
          console.error('❌ Erreur serveur - Vérifiez les logs backend');
        }
      }
      
      // Retourner une réponse vide en cas d'erreur
      return of({
        data: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        size: size
      });
    })
  );
}
validerRendezVousSYCWithFile(numero: string, formData: FormData): Observable<any> {
  const url = `${this.BASE_URL}/valider-syc/${numero}`;
  
  // Ne pas ajouter de headers Content-Type, Angular le fait automatiquement pour FormData
  return this.http.put(url, formData).pipe(
    tap(() => console.log('✅ Validation SYC envoyée avec fichier')),
    catchError(error => {
      console.error('❌ Erreur validation SYC:', error);
      return throwError(() => error);
    })
  );
}

validerSelection(rendezVous: any,ligneUuid: string): Observable<any> {
  const url = `${this.BASE_URL}/valider-selection/${ligneUuid}`;
  return this.http.post(url, rendezVous).pipe(
    tap(() => console.log('✅ Selection validée')),
    catchError(error => {
      console.error('❌ Erreur validation selection:', error);
      return throwError(() => error);
    })
  );
}
}



