import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuittanceService } from '../../services/quittance.service';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Quittance } from '../../models/quittance';
import { PagedData } from '../../models/paged-data';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-situation-quitance',
  templateUrl: './situation-quitance.component.html',
  styleUrls: ['./situation-quitance.component.scss']
})
export class SituationQuitanceComponent implements OnInit, OnDestroy {
  // ========== PROPRIÉTÉS DE DONNÉES ==========
  pageData: PagedData<Quittance> = { 
    content: [], 
    pageNumber: 0, 
    pageSize: 5, 
    totalElements: 0 
  };
  
  quittanceList: Quittance[] = [];
  selectedQuittance: Quittance | null = null;
  
  // ========== FORMULAIRE ET VALIDATION ==========
  quitanceForm!: FormGroup;
  formErrors: { [key: string]: string } = {};
  
  // ========== ÉTATS DE L'APPLICATION ==========
  isAuthorized: boolean = true;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  isGeneratingPdf: boolean = false;
  showUserList: boolean = false;
  
  // ========== GESTION DES ERREURS ET MESSAGES ==========
  errorMessage: string = '';
  successMessage: string = '';
  validationErrors: string[] = [];
  
  // ========== PAGINATION ==========
  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
  
  page: any = {
    pageNumber: 0,
    size: 5,
  };
  
  // ========== OBSERVABLES ET SUJETS ==========
  private destroy$ = new Subject<void>();
  filterednif!: Observable<Quittance[]>;
  
  // ========== OPTIONS DE CONFIGURATION ==========
  readonly BUREAUX_OPTIONS = [
    { code: 'GNB02', nom: 'Bureau de Conakry Port' },
    { code: 'GNB04', nom: 'Bureau de Conakry Aéroport' },
    { code: 'GNB10', nom: 'Bureau de Conakry Ville' },
    { code: 'CNK', nom: 'Bureau de Conakry' },
    { code: 'KAN', nom: 'Bureau de Kankan' },
    { code: 'LAB', nom: 'Bureau de Labé' },
    { code: 'BOK', nom: 'Bureau de Boké' },
    { code: 'SIG', nom: 'Bureau de Siguiri' }
  ];
  
  readonly SERIES_OPTIONS = ['L', 'C', 'T', 'D', 'P'];
  
  readonly PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

  constructor(
    private fb: FormBuilder,
    private quittanceService: QuittanceService,
    private authService: AuthenticationService
  ) {
    this.initializeForm();
  }

  // ========== INITIALISATION ==========
  
  ngOnInit(): void {
    this.checkUserAuthorization();
    this.setupFormValidation();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Initialise le formulaire avec les validateurs appropriés
   */
  private initializeForm(): void {
    this.quitanceForm = this.fb.group({
      ideCuoCod: ['', [Validators.required]], 
      decRefYer: ['', [
        Validators.required, 
        Validators.pattern(/^\d{4}$/),
        Validators.min(2000),
        Validators.max(2050)
      ]], 
      decCod: ['', [Validators.required, Validators.minLength(2)]], 
      ideAstSer: ['L', [Validators.required]], 
      ideAstNbr: ['', [
        Validators.required, 
        Validators.minLength(1),
        Validators.maxLength(20)
      ]]
    });
  }
  
  /**
   * Configure la validation en temps réel du formulaire
   */
  private setupFormValidation(): void {
    this.quitanceForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.validateForm();
    });
  }
  
  /**
   * Vérifie les autorisations de l'utilisateur
   */
  private checkUserAuthorization(): void {
    try {
      // Note: hasRole et isAuthenticated non disponibles dans cette version
      // this.isAdmin = this.authService['hasRole']('ADMIN');
      // this.isAuthorized = this.authService['isAuthenticated']();
      this.isAdmin = false; // À implémenter selon les besoins
      this.isAuthorized = true; // À implémenter selon les besoins
    } catch (error) {
      console.warn('Erreur lors de la vérification des autorisations:', error);
      this.isAdmin = false;
      this.isAuthorized = true; // Par défaut, autoriser l'accès
    }
  }

  // ========== VALIDATION ==========
  
  /**
   * Valide le formulaire et met à jour les messages d'erreur
   */
  private validateForm(): void {
    this.formErrors = {};
    this.validationErrors = [];
    
    Object.keys(this.quitanceForm.controls).forEach(key => {
      const control = this.quitanceForm.get(key);
      if (control && !control.valid && (control.dirty || control.touched)) {
        this.formErrors[key] = this.getFieldErrorMessage(key, control.errors);
      }
    });
    
    if (this.quitanceForm.valid) {
      const quittance = this.createQuittanceFromForm();
      this.validationErrors = quittance.getValidationErrors();
    }
  }
  
  /**
   * Retourne le message d'erreur approprié pour un champ
   */
  private getFieldErrorMessage(fieldName: string, errors: any): string {
    const fieldLabels: { [key: string]: string } = {
      'ideCuoCod': 'Bureau de douane',
      'decRefYer': 'Année',
      'decCod': 'Code déclaration',
      'ideAstSer': 'Série',
      'ideAstNbr': 'Numéro'
    };
    
    const label = fieldLabels[fieldName] || fieldName;
    
    if (errors?.required) return `${label} est obligatoire`;
    if (errors?.pattern) return `Format ${label} invalide`;
    if (errors?.min || errors?.max) return `${label} doit être entre ${errors.min?.min || 2000} et ${errors.max?.max || 2050}`;
    if (errors?.minlength) return `${label} trop court (min. ${errors.minlength.requiredLength} caractères)`;
    if (errors?.maxlength) return `${label} trop long (max. ${errors.maxlength.requiredLength} caractères)`;
    
    return `${label} invalide`;
  }

  // ========== GESTION DES DONNÉES ==========
  
  /**
   * Crée une instance Quittance à partir des valeurs du formulaire
   */
  private createQuittanceFromForm(): Quittance {
    const formValues = this.quitanceForm.value;
    return new Quittance({
      ideCuoCod: formValues.ideCuoCod,
      decRefYer: formValues.decRefYer,
      decCod: formValues.decCod,
      ideAstSer: formValues.ideAstSer,
      ideAstNbr: formValues.ideAstNbr
    });
  }
  
  /**
   * Récupère toutes les quittances selon les critères de recherche
   */
getAllQuitance(quittance?: Quittance): void {
  const searchQuittance = quittance || this.createQuittanceFromForm();
  const params = searchQuittance.getApiParams();
  
  console.log("🔹 Recherche avec paramètres:", params);
  console.log("🔹 Quittance utilisée:", searchQuittance);
  
  this.isLoading = true;
  this.clearMessages();

  this.quittanceService.getQuitance(
    this.page, 
    '', // searchTerm - réservé pour plus tard
    params.bureau,
    params.code,
    params.serie,
    params.numero,
    params.annee.toString()
  ).pipe(
    finalize(() => this.isLoading = false)
  ).subscribe({
    next: (pagedData: PagedData<Quittance>) => {
      this.handleSearchResults(pagedData);
    },
    error: (error: any) => {
      console.error("❌ Erreur API :", error);

      // 👉 Message backend si dispo
      if (error?.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = "Erreur lors de la récupération des données.";
      }

      // Vider les résultats
      this.pageData = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };
      this.quittanceList = [];
    }
  });
}


private handleSearchResults(pagedData: PagedData<Quittance>): void {
  console.log("✅ Données reçues de l'API :", pagedData);
  
  if (!pagedData || !pagedData.content || pagedData.content.length === 0) {
    console.warn("⚠️ Aucune donnée reçue !");
    this.errorMessage = "Aucune quittance trouvée avec ces critères.";
    this.pageData = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };
    this.quittanceList = [];
  } else {
    this.successMessage = `${pagedData.totalElements} quittance(s) trouvée(s)`;
    this.pageData = pagedData;
    
    // Synchroniser les propriétés de chaque quittance
    this.pageData.content = this.pageData.content.map((q: any) => {
      const quittance = new Quittance(q);
      quittance.syncProperties();
      return quittance;
    });

    this.quittanceList = this.pageData.content;
  }
  
  this.nombreTotalEnregistrement = pagedData?.totalElements ?? 0;
}


  downloadQuittance(quittance: Quittance): void {
    this.executeQuittanceAction(quittance, 'download', 'téléchargement');
  }

  /**
   * Visualise une quittance dans un nouvel onglet
   */
  viewQuittance(quittance: Quittance): void {
    this.executeQuittanceAction(quittance, 'view', 'visualisation');
  }

  /**
   * Imprime une quittance
   */
  printQuittance(quittance: Quittance): void {
    this.executeQuittanceAction(quittance, 'print', 'impression');
  }
  
  /**
   * Exécute une action sur une quittance (download, view, print)
   */
  private executeQuittanceAction(quittance: Quittance, action: 'download' | 'view' | 'print', actionName: string): void {
    if (!this.validateQuittanceForAction(quittance)) {
      return;
    }
    
    const params = quittance.getApiParams();
    this.isGeneratingPdf = true;
    this.clearMessages();
    
    // Sélectionner le service approprié selon l'action
    let serviceCall: Observable<Blob>;
    
    switch (action) {
      case 'download':
        serviceCall = this.quittanceService.generatePdfQuittance(
          params.bureau, params.annee, params.code, params.serie, params.numero, false
        );
        break;
      case 'view':
        serviceCall = this.quittanceService.viewQuittance(
          params.bureau, params.annee, params.code, params.serie, params.numero
        );
        break;
      case 'print':
        serviceCall = this.quittanceService.printQuittance(
          params.bureau, params.annee, params.code, params.serie, params.numero
        );
        break;
    }
    
    serviceCall.pipe(
      finalize(() => this.isGeneratingPdf = false),
      catchError(error => {
        console.error(`Erreur lors du ${actionName}:`, error);
        this.handleApiError(error, actionName);
        return of(new Blob());
      })
    ).subscribe(blob => {
      if (blob.size > 0) {
        this.handlePdfBlob(blob, action, quittance);
        this.successMessage = `${actionName.charAt(0).toUpperCase() + actionName.slice(1)} réussie`;
      }
    });
  }
  
  /**
   * Traite le blob PDF selon l'action demandée
   */
  private handlePdfBlob(blob: Blob, action: 'download' | 'view' | 'print', quittance: Quittance): void {
    switch (action) {
      case 'download':
        const filename = quittance.getSuggestedFilename();
        this.quittanceService.downloadPdf(blob, filename);
        break;
      case 'view':
        this.quittanceService.openPdfInNewTab(blob);
        break;
      case 'print':
        this.quittanceService.printPdf(blob);
        break;
    }
  }
  
  /**
   * Valide qu'une quittance peut être utilisée pour une action
   */
  private validateQuittanceForAction(quittance: Quittance): boolean {
    if (!quittance.isValid()) {
      this.errorMessage = `Données quittance incomplètes: ${quittance.getValidationErrors().join(', ')}`;
      return false;
    }
    return true;
  }

  // ========== ACTIONS ADMINISTRATEUR ==========
  
  /**
   * Teste les données d'une quittance (admin uniquement)
   */
  testQuittanceData(quittance: Quittance): void {
    if (!this.isAdmin) {
      this.errorMessage = "Action réservée aux administrateurs";
      return;
    }
    
    if (!this.validateQuittanceForAction(quittance)) {
      return;
    }
    
    const params = quittance.getApiParams();
    this.isLoading = true;
    this.clearMessages();
    
    this.quittanceService.testQuittanceData(
      params.bureau, params.annee, params.code, params.serie, params.numero
    ).pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        console.error("Erreur lors du test:", error);
        this.handleApiError(error, "test des données");
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response) {
        console.log("Test réussi:", response);
        this.successMessage = "Test des données réussi";
      }
    });
  }

  /**
   * Vide le cache (admin uniquement)
   */
  clearCache(): void {
    if (!this.isAdmin) {
      this.errorMessage = "Action réservée aux administrateurs";
      return;
    }
    
    this.isLoading = true;
    this.clearMessages();
    
    this.quittanceService.clearCache().pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        console.error("Erreur lors du vidage du cache:", error);
        this.handleApiError(error, "vidage du cache");
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response) {
        console.log("Cache vidé:", response);
        this.successMessage = "Cache vidé avec succès";
      }
    });
  }

  // ========== GESTION DU FORMULAIRE ==========
  
  /**
   * Soumet le formulaire de recherche
   */
  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(this.quitanceForm.controls).forEach(key => {
      const control = this.quitanceForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    
    if (this.quitanceForm.invalid) {
      this.validateForm();
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire";
      return;
    }
    
    const quittance = this.createQuittanceFromForm();
    
    if (!quittance.isValid()) {
      this.validationErrors = quittance.getValidationErrors();
      this.errorMessage = `Données invalides: ${this.validationErrors.join(', ')}`;
      return;
    }

    // Réinitialiser la pagination
    this.resetPagination();
    this.clearMessages();
    
    // Lancer la recherche
    this.getAllQuitance(quittance);
  }
  
  /**
   * Génère une quittance selon les critères du formulaire
   */
  generateQuittanceByFilter(action: 'download' | 'view' | 'print'): void {
    if (this.quitanceForm.invalid) {
      this.onSubmit(); // Cela va afficher les erreurs
      return;
    }

    const quittance = this.createQuittanceFromForm();
    
    if (!quittance.isValid()) {
      this.validationErrors = quittance.getValidationErrors();
      this.errorMessage = `Tous les champs sont requis: ${this.validationErrors.join(', ')}`;
      return;
    }

    this.executeQuittanceAction(quittance, action, action);
  }

  // ========== GESTION DE LA PAGINATION ==========
  
  /**
   * Change de page
   */
  onPageChange(page: number): void {
    this.page.pageNumber = page - 1;
    this.pageSelectionne = page;
    
    if (this.quitanceForm.valid) {
      const quittance = this.createQuittanceFromForm();
      this.getAllQuitance(quittance);
    }
  }

  /**
   * Change la taille de page
   */
  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    this.resetPagination();
    
    if (this.quitanceForm.valid) {
      const quittance = this.createQuittanceFromForm();
      this.getAllQuitance(quittance);
    }
  }
  
  /**
   * Remet la pagination à zéro
   */
  private resetPagination(): void {
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;
  }

  // ========== UTILITAIRES ==========
  
  /**
   * Efface tous les messages d'erreur et de succès
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.validationErrors = [];
  }
  
  /**
   * Gère les erreurs API de manière uniforme
   */
  private handleApiError(error: any, operation: string): void {
    const message = error?.error?.message || error?.message || "Erreur inconnue";
    this.errorMessage = `Erreur lors de ${operation}: ${message}`;
    console.error(`Erreur ${operation}:`, error);
  }
  
  /**
   * Sélectionne une quittance
   */
  selectQuittance(quittance: Quittance): void {
    this.selectedQuittance = quittance;
  }
  
  /**
   * Désélectionne la quittance courante
   */
  deselectQuittance(): void {
    this.selectedQuittance = null;
  }
  
  /**
   * Remet le formulaire à zéro
   */
  resetForm(): void {
    this.quitanceForm.reset({
      ideAstSer: 'L' // Valeur par défaut
    });
    this.clearMessages();
    this.pageData = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };
    this.quittanceList = [];
    this.selectedQuittance = null;
  }
  
  /**
   * Retourne le nom complet d'un bureau
   */
  getBureauName(code: string): string {
    const bureau = this.BUREAUX_OPTIONS.find(b => b.code === code);
    return bureau ? bureau.nom : `Bureau ${code}`;
  }
  
  /**
   * Vérifie si une action est en cours
   */
  isActionInProgress(): boolean {
    return this.isLoading || this.isGeneratingPdf;
  }

  /**
   * Fonction de tracking pour ngFor (améliore les performances)
   */
  trackByQuittance(index: number, quittance: Quittance): string {
    return quittance.getUniqueKey();
  }

  /**
   * Utilitaire Math pour le template
   */
  Math = Math;

  /**
   * Nouvelle propriété pour accéder à Date dans le template
   */
  Date = Date;

  /**
   * Imprime le tableau des résultats actuels
   */
  printCurrentResults(): void {
    if (!this.pageData?.content?.length) {
      this.errorMessage = "Aucun résultat à imprimer";
      return;
    }

    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      window.print();
    }, 100);
  }

  /**
   * Calcule le montant total de toutes les quittances affichées
   */
  getTotalAmount(): number {
    if (!this.pageData?.content?.length) {
      return 0;
    }

    return this.pageData.content.reduce((total: any, quittance: any) => {
      const amount = parseFloat(quittance.totalFinAmtTbp || quittance.totalTaxAmt || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }

  /**
   * Exporte les données vers Excel (optionnel)
   */
  exportToExcel(): void {
    if (!this.pageData?.content?.length) {
      this.errorMessage = "Aucune donnée à exporter";
      return;
    }

    // Préparer les données pour l'export
    const exportData = this.pageData.content.map((quittance: any, index: any) => ({
      'N°': index + 1,
      'Bureau': quittance.ideCuoCod || quittance.ide_CUO_COD || '-',
      'Nom Déclarant': quittance.dec_NAM || '-',
      'Code Déclaration': quittance.decCod || quittance.dec_cod || '-',
      'NIF': quittance.cmpConCod || '-',
      'Liquidation': quittance.liquidation || '-',
      'Date Liquidation': quittance.ide_ast_dat || '-',
      'Enregistrement': quittance.enregistrement || '-',
      'Date Enregistrement': quittance.ide_reg_dat || '-',
      'Quittance': quittance.quittance || '-',
      'Date Quittance': quittance.ide_rcp_dat || '-',
      'Référence/Num BFU': quittance.ref || '-',
      'Droits et Taxes (GNF)': quittance.totalFinAmtTbp || quittance.totalTaxAmt || '0'
    }));

    // Vous pourriez intégrer une bibliothèque comme xlsx pour l'export Excel
    console.log('Données à exporter:', exportData);
    this.successMessage = "Fonctionnalité d'export Excel à implémenter";
  }

  /**
   * Génère un rapport complet (toutes les pages)
   */
  generateFullReport(): void {
    if (!this.quitanceForm.valid) {
      this.errorMessage = "Veuillez d'abord effectuer une recherche valide";
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    // Récupérer toutes les données (sans pagination)
    const quittance = this.createQuittanceFromForm();
    const params = quittance.getApiParams();

    // Sauvegarder les paramètres de pagination actuels
    const originalPage = { ...this.page };
    
    // Définir une taille de page très grande pour récupérer tout
    this.page.size = 10000;
    this.page.pageNumber = 0;

    this.quittanceService.getQuitance(
      this.page,
      '',
      params.bureau,
      params.code,
      params.serie,
      params.numero,
      params.annee.toString()
    ).pipe(
      finalize(() => {
        this.isLoading = false;
        // Restaurer les paramètres de pagination
        this.page = originalPage;
      }),
      catchError(error => {
        console.error("❌ Erreur lors de la génération du rapport complet :", error);
        this.handleApiError(error, "génération du rapport complet");
        return of({ content: [], pageNumber: 0, pageSize: 0, totalElements: 0 });
      })
    ).subscribe(
      (pagedData: PagedData<Quittance>) => {
        if (pagedData?.content?.length > 0) {
          // Temporairement remplacer les données pour l'impression
          const originalPageData = this.pageData;
          this.pageData = pagedData;
          
          // Imprimer après un délai pour que le DOM soit mis à jour
          setTimeout(() => {
            window.print();
            // Restaurer les données originales
            this.pageData = originalPageData;
          }, 500);
          
          this.successMessage = `Rapport complet généré (${pagedData.totalElements} éléments)`;
        } else {
          this.errorMessage = "Aucune donnée trouvée pour le rapport complet";
        }
      }
    );
  }
}





