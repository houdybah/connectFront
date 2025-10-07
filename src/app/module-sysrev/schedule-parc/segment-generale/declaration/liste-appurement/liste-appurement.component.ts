import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, switchMap, catchError, of, shareReplay } from 'rxjs';
import { AffectationConteneur } from 'src/app/module-sysrev/models/AffectationConteneur';
import { DetailAffectationConteneur } from 'src/app/module-sysrev/models/DetailAffectationConteneur';
import { ConteneurService } from 'src/app/module-sysrev/services/conteneur.service';
import { DetailConteneurAffectationService } from 'src/app/module-sysrev/services/detail-conteneur-affectation.service';
import { ModificationChauffeurComponent } from '../modification-chauffeur/modification-chauffeur.component';

@Component({
  selector: 'app-liste-appurement',
  templateUrl: './liste-appurement.component.html',
  styleUrl: './liste-appurement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListeAppurementComponent implements OnInit, OnDestroy {
  declarations: any[] = [];
  loading = false;
  isSearching = false;
  page = 1;
  pageSize = 10; // Augmenté pour réduire les appels API
  collectionSize = 0;
  totalPages = 0;
  searchForm: FormGroup;
  parentProperty = new AffectationConteneur();
  parentPropertyDetail = new DetailAffectationConteneur();

  currentSearchKey = '';
  currentCodeDeclarant = '';
  isSearchMode = false;
   
  
  // Pour la destruction des observables
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<void>();
  
  // Propriétés pour gérer les rôles
  currentUserRole: string = '';
  isDeclarant: boolean = false;
  
  // Propriété pour accéder à Math dans le template
  Math = Math;
  
  // Cache pour optimiser les performances
  private cache = new Map<string, { data: any[], timestamp: number, totalElements: number }>();
  private readonly CACHE_DURATION = 3 * 60 * 1000; // 5 minutes
  uuidConteneurAffectation: string = '';

  constructor(
    private conteneurService: ConteneurService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private detailConteneurService: DetailConteneurAffectationService
  ) {
     this.currentUserRole = this.conteneurService.getCurrentUserRole();
    this.isDeclarant = this.currentUserRole === 'Declarant';
    this.searchForm = this.fb.group({
      searchKey: [''],
      codeDeclarant: [{ 
        value: '', 
        disabled: this.isDeclarant  // Désactiver pour les déclarants
      }],
      dateDebut: [null],
      dateFin: [null]
    })
  }

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.setupSearchDebounce();
    this.performAutoSearch();
  }
  ngOnDestroy(): void {
    // Nettoyer les observables
    this.destroy$.next();
    this.destroy$.complete();
    
    // Nettoyer le cache
    this.cache.clear();
  }

  /**
   * Configuration du debouncing optimisé
   */
  private setupSearchDebounce(): void {
    // Recherche automatique sur searchKey
    this.searchForm.get('searchKey')?.valueChanges
      .pipe(
        debounceTime(500), // Augmenté pour réduire les appels API
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.searchSubject.next();
      });
    
    // Recherche automatique sur codeDeclarant (seulement si pas déclarant)
    if (!this.isDeclarant) {
      this.searchForm.get('codeDeclarant')?.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.searchSubject.next();
        });
    }

    // Recherche automatique sur les dates
    this.searchForm.get('dateDebut')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.searchSubject.next();
      });

    this.searchForm.get('dateFin')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.searchSubject.next();
      });

    // Configuration du système de recherche optimisé
    this.searchSubject.pipe(
      switchMap(() => this.performSearch()),
      catchError(error => {
        console.error('Erreur lors de la recherche:', error);
        return of({ data: [], totalElements: 0 });
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.handleSearchResponse(response);
    });
  }

  /**
   * Effectue la recherche avec cache
   */
  private performSearch() {
    const searchCriteria = this.buildSearchCriteria();
    const cacheKey = this.getCacheKey(searchCriteria);
    
    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log('📦 Utilisation du cache pour la recherche des apurements');
      return of({
        data: cached.data,
        totalElements: cached.totalElements
      });
    }
    
    // Effectuer la recherche
    this.loading = true;
    this.cdr.markForCheck();
    
    return this.conteneurService.rechercherConteneursListeApurement(
    searchCriteria.searchKey,
    searchCriteria.page,
    searchCriteria.size,
    searchCriteria.dateDebut,
    searchCriteria.dateFin
    // Plus de paramètre status - recherche dans tous les conteneurs
  ).pipe(
      shareReplay(1),
      catchError(error => {
        console.error('Erreur lors de la recherche des apurements:', error);
        this.loading = false;
        this.cdr.markForCheck();
        return of({ data: [], totalElements: 0 });
      })
    );
  }

  /**
   * Gère la réponse de recherche
   */
  private handleSearchResponse(response: any) {
    if (response && response.data) {
      this.declarations = response.data;
      this.collectionSize = response.totalElements || response.data.length;
      this.totalPages = Math.ceil(this.collectionSize / this.pageSize);
      
      // Mettre en cache
      const searchCriteria = this.buildSearchCriteria();
      const cacheKey = this.getCacheKey(searchCriteria);
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        totalElements: this.collectionSize
      });
      
      console.log(`📊 ${this.declarations.length} apurements trouvés sur ${this.collectionSize} total`);
    } else {
      this.declarations = [];
      this.collectionSize = 0;
      this.totalPages = 1;
    }
    
    this.loading = false;
    this.isSearchMode = true;
    this.cdr.markForCheck();
  }

  /**
   * Construit les critères de recherche
   */
  private buildSearchCriteria() {
    const formValue = this.searchForm.value;
    return {
      searchKey: formValue.searchKey?.trim() || '',
      codeDeclarant: formValue.codeDeclarant?.trim() || '',
      dateDebut: formValue.dateDebut ? this.formatDate(formValue.dateDebut) : '',
      dateFin: formValue.dateFin ? this.formatDate(formValue.dateFin) : '',
      page: this.page - 1,
      size: this.pageSize
    };
  }

  /**
   * Génère une clé de cache unique
   */
  private getCacheKey(criteria: any): string {
    return JSON.stringify(criteria);
  }

  /**
   * Nettoie le cache expiré
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Formate une date NgbDate en string
   */
  private formatDate(ngbDate: any): string {
    if (!ngbDate || !ngbDate.year || !ngbDate.month || !ngbDate.day) {
      return '';
    }
    return `${ngbDate.year}-${String(ngbDate.month).padStart(2, '0')}-${String(ngbDate.day).padStart(2, '0')}`;
  }

  private setDefaultDateRange(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Convertir en format NgbDate
    const dateDebut = {
      year: firstDayOfMonth.getFullYear(),
      month: firstDayOfMonth.getMonth() + 1,
      day: firstDayOfMonth.getDate()
    };
    
    const dateFin = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
    
    this.searchForm.patchValue({
      dateDebut: dateDebut,
      dateFin: dateFin
    });

    this.loadDeclarations1();
  }
  /**
   * Recherche automatique optimisée
   */
  performAutoSearch(): void {
    // Éviter de déclencher la recherche si elle est déjà en cours
    if (this.loading || this.isSearching) {
      return;
    }

    const formValues = this.searchForm.getRawValue();
    
    // Vérifier si on a au moins un critère valide
    const hasValidCriteria = 
      formValues.searchKey?.trim() || 
      formValues.codeDeclarant?.trim() ||
      (formValues.dateDebut && formValues.dateDebut.year && formValues.dateDebut.month && formValues.dateDebut.day) ||
      (formValues.dateFin && formValues.dateFin.year && formValues.dateFin.month && formValues.dateFin.day);

    if (!hasValidCriteria) {
      // Si aucun critère valide, revenir au mode normal
      this.isSearchMode = false;
      this.loadDeclarations1();
      return;
    }

    // Nettoyer le cache expiré
    this.cleanExpiredCache();
    
    // Utiliser le système de recherche optimisé
    this.searchSubject.next();
  }
  // loadDeclarations(): void {
  //   this.loading = true;
  //   this.conteneurService.getConteneurAffectation().subscribe({
  //     next: (data: any) => {
  //       this.declarations = data;
  //       console.log(this.declarations);
  //       this.collectionSize = data.length;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors du chargement des déclarations', error);
  //       this.loading = false;
  //     }
  //   });
  // }

  get paginatedDeclarations(): AffectationConteneur[] {
    // Les données sont déjà paginées par le serveur, pas besoin de pagination côté client
    return this.declarations;
  }

  /**
   * Gestion optimisée de la pagination
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    
    if (this.isSearchMode) {
      const criteria = this.buildSearchCriteria();
      criteria.page = newPage - 1;
      const cacheKey = this.getCacheKey(criteria);
      
      // Vérifier le cache pour cette page
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        console.log('📦 Utilisation du cache pour la pagination des apurements');
        this.declarations = cached.data;
        this.collectionSize = cached.totalElements;
        this.totalPages = Math.ceil(cached.totalElements / this.pageSize);
        this.cdr.markForCheck();
        return;
      }
      
      // Effectuer la recherche pour la nouvelle page
      this.searchSubject.next();
    } else {
      this.loadDeclarations1();
    }
  }

  /**
   * Gestion optimisée du changement de taille de page
   */
  onPageSizeChange(): void {
    this.page = 1;
    if (this.isSearchMode) {
      // Vider le cache car la taille de page a changé
      this.cache.clear();
      this.searchSubject.next();
    } else {
      this.loadDeclarations1();
    }
  }

  private performSearchWithPagination(): void {
    if (this.loading || this.isSearching) {
      return;
    }

    const criteria = this.buildSearchCriteria();
    criteria.page = this.page - 1;

    this.loading = true;
    this.conteneurService.rechercherConteneursListeApurement(
      criteria.searchKey,
     // criteria.codeDeclarant,
      criteria.page,
      criteria.size,
      criteria.dateDebut,
      criteria.dateFin
    ).subscribe({
      next: (response: any) => {
        this.handleSearchResponse(response);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la pagination:', error);
        this.declarations = [];
        this.collectionSize = 0;
        this.totalPages = 0;
        this.loading = false;
        this.afficherMessageErreur('Erreur lors de la pagination. Veuillez réessayer.');
      }
    });
  }

// MÉTHODE MODIFIÉE : Recherche manuelle (bouton)
  onSearch(): void {
    if (this.isSearching) {
      return; // Éviter les recherches multiples
    }
    this.performAutoSearch();
  }
  

   resetSearch(): void {
    console.log('🔄 Réinitialisation de la recherche');
    
    // Réinitialiser les états
    this.isSearching = false;
    this.loading = false;
    this.isSearchMode = false;
    
    this.searchForm.patchValue({
      searchKey: '',
      codeDeclarant: this.isDeclarant ? this.searchForm.get('codeDeclarant')?.value : '',
      dateDebut: null,
      dateFin: null
    });
    
    this.currentSearchKey = '';
    if (!this.isDeclarant) {
      this.currentCodeDeclarant = '';
    }
    this.page = 1;
    this.declarations = [];
    this.collectionSize = 0;
    this.totalPages = 0;
    
    // Recharger les données par défaut
    this.loadDeclarations1();
  }

  private loadDeclarations1(): void {
    this.loading = true;
  this.isSearchMode = false;
  
  this.conteneurService.rechercherConteneursListeApurement(
    '',
    this.page - 1,
    this.pageSize,
    '',
    ''
    ).subscribe({
      next: (response) => {
        this.handleSearchResponse(response);
        console.log('Chargement initial réussi:', response);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des déclarations:', error);
        this.declarations = [];
        this.collectionSize = 0;
        this.totalPages = 0;
        this.loading = false;
        this.afficherMessageErreur('Erreur lors du chargement des données. Veuillez réessayer.');
      }
    });
  }

  openDetailsModal(content: any, Declaration: AffectationConteneur): void {
    this.parentProperty = Declaration;
    console.log(Declaration);
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  hasActiveFilters(): boolean {
    const formValues = this.searchForm.getRawValue();
    return !!(formValues.searchKey?.trim() || formValues.codeDeclarant?.trim());
  }
   getSearchSummary(): string {
    const formValues = this.searchForm.getRawValue();
    const criteria = [];
    
    if (formValues.searchKey?.trim()) {
      criteria.push(`Recherche: "${formValues.searchKey}"`);
    }
    if (formValues.codeDeclarant?.trim()) {
      criteria.push(`Code déclarant: "${formValues.codeDeclarant}"`);
    }
    
    return criteria.join(' - ');
  }
  openConteneurModal(content: any, Declaration: AffectationConteneur): void {

    this.uuidConteneurAffectation = Declaration.uuid;
    this.modalService.open(content, { size: 'xl', centered: true });
    // this.parentProperty = Declaration;
    // console.log(Declaration);
    // this.modalService.open(content, { size: 'xl', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  // ✅ MÉTHODE POUR LA MODIFICATION DU Chauffeur AVEC SWEETALERT
  ouvrirModificationChauffeur(Declaration: AffectationConteneur) {
    console.log('Ouverture modification pour:', Declaration);
    
    if (Declaration.status === true) {
      this.afficherMessageErreur('Impossible de modifier : ce conteneur est déjà sorti (statut validé)');
      return;
    }
    
    this.conteneurService.getConteneurDetails(Declaration.numero).subscribe({
      next: (conteneurDetails) => {
        if (conteneurDetails.status === true) {
          this.afficherMessageErreur('Impossible de modifier : ce conteneur est déjà sorti');
          return;
        }
        
        // Filtrer les doublons avec typage explicite
        let conteneurs: any[] = conteneurDetails.detailAffectationConteneurDtos || [];
        
        // Supprimer les doublons basés sur numeroConteneur
        const conteneursSansDoublons = conteneurs.filter((conteneur: any, index: number, array: any[]) => {
          return array.findIndex((c: any) => c.numeroConteneur === conteneur.numeroConteneur) === index;
        });
        
        console.log('🔍 Conteneurs avant filtrage:', conteneurs.length);
        console.log('🔍 Conteneurs après filtrage:', conteneursSansDoublons.length);
        
        const modalRef = this.modalService.open(ModificationChauffeurComponent, {
          size: 'lg',
          centered: true,
          backdrop: 'static'
        });

        modalRef.componentInstance.conteneurData = {
          uuid: conteneurDetails.uuid,
          numero: conteneurDetails.numero,
          refDeclarant: conteneurDetails.referenceDeclaration,
          quittance: conteneurDetails.quittance,
          immatriculation: conteneurDetails.immarticulation,
          nomChauffeur: conteneurDetails.nomcompletDriver,
          phoneChauffeur: conteneurDetails.phoneDriver,
          permisChauffeur: conteneurDetails.permitDriver,
          commune: conteneurDetails.commune,
          destination: conteneurDetails.destination,
          status: conteneurDetails.status,
          referenceCompagnie: conteneurDetails.referenceCompagnie,
          referenceAGL: conteneurDetails.referenceBolorer,
          conteneurs: conteneursSansDoublons
        };

        modalRef.result.then(
          (result) => {
            if (result) {
              console.log('Modification réussie:', result);
             // this.loadDeclarations();
              this.afficherMessageSucces('Les informations du Chauffeur ont été modifiées avec succès');
            }
          },
          () => {
            console.log('Modification annulée');
          }
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails:', error);
        this.afficherMessageErreur('Erreur lors de la récupération des informations du conteneur');
      }
    });
  }

  trackByNumero(index: number, Declaration: any): any {
    return Declaration ? Declaration.numero : index;
  }
  // ✅ MÉTHODE POUR AFFICHER UN MESSAGE DE SUCCÈS AVEC SWEETALERT
  afficherMessageSucces(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      timer: 5000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }

  // ✅ MÉTHODE POUR AFFICHER UN MESSAGE D'ERREUR AVEC SWEETALERT
  afficherMessageErreur(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur!',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545',
      timer: 7000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }

  // ✅ MÉTHODE OPTIONNELLE POUR AFFICHER UN MESSAGE D'AVERTISSEMENT
  afficherMessageAvertissement(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Attention!',
      text: message,
      confirmButtonText: 'Compris',
      confirmButtonColor: '#ffc107',
      timer: 6000,
      timerProgressBar: true
    });
  }

  // ✅ MÉTHODE OPTIONNELLE POUR AFFICHER UN MESSAGE D'INFORMATION
  afficherMessageInfo(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Information',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#17a2b8',
      timer: 5000,
      timerProgressBar: true
    });
  }

  // ✅ MÉTHODE OPTIONNELLE POUR CONFIRMATION AVEC SWEETALERT
  confirmerAction(titre: string, message: string): Promise<boolean> {
    return Swal.fire({
      title: titre,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  viderCacheEtTester(): void {
  this.cache.clear();
  console.log('Cache vidé');
  this.performAutoSearch();
}
}








