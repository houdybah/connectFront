import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription, filter } from 'rxjs';
import {AffectationConteneur} from "../../models/AffectationConteneur";
import {ConteneurService} from "../../services/conteneur.service";
import {DetailConteneurAffectationService} from "../../services/detail-conteneur-affectation.service";
import {PageResponse} from "../../models/PageResponse";

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.scss',
  changeDetection: ChangeDetectionStrategy.Default // Optimisation Angular
})
export class StatistiqueComponent implements OnInit, OnDestroy {
  // Données essentielles uniquement
  declarations: AffectationConteneur[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 20;
  searchForm: FormGroup;
  loading = false;
  
  statistics = {
    totalConteneurs: 0,
    conteneursEnAttente: 0,
    conteneursSortis: 0,
    pourcentageSortie: 0
  };
  
  chartData = {
    conteneursByType: [
      { name: '20 pieds', value: 0, color: '#007bff' },
      { name: '40 pieds', value: 0, color: '#28a745' }
    ],
    conteneursByStatus: [
      { name: 'En attente', value: 0, color: '#ffc107' },
      { name: 'Sortis', value: 0, color: '#28a745' }
    ]
  };

  // Contexte utilisateur minimal
  userRole: string = '';
  username: string = '';
  isFilteredAccess: boolean = false;
  interface: any = {};

  // Modal
  parentProperty: any;
  title: string = "";

  // Cache performant avec Map pour O(1)
  private readonly containerCache = new Map<string, any>();
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5000; // 5 secondes
  detailsCache: { [key: string]: any[] } = {};

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public conteneurService: ConteneurService,
    private detailConteneurService: DetailConteneurAffectationService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      codeDeclarant: [''],
      startDate: [this.getDefaultStartDate()],
      endDate: [new Date()]
    });
  }
Math = Math;
  ngOnInit(): void {
    if (!this.conteneurService.isUserConnectedWithPermissions()) return;
    
    this.loadUserContext();
    this.updateInterfaceForRole();
    this.setupFormSubscription();
    this.loadData();
    
    // Écouter les changements de route pour recharger les données automatiquement
    this.subscriptions.push(
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd)
        )
        .subscribe(() => {
          // Recharger les données quand l'utilisateur navigue vers cette page
          if (this.conteneurService.isUserConnectedWithPermissions()) {
            console.log('🔄 Rechargement automatique des données après navigation');
            this.loadData();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.containerCache.clear();
  }

  private setupFormSubscription(): void {
    this.subscriptions.push(
      this.searchForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      ).subscribe(values => {
        console.log('🔍 Valeurs du formulaire de recherche:', values);
        
        const searchParams = {
          searchKey: values.keyword || '',
          codeDeclarant: values.codeDeclarant || '',
          dateDebut: values.startDate,
          dateFin: values.endDate,
          page: 0,
          size: this.pageSize
        };
        
        console.log('🔍 Paramètres de recherche construits:', searchParams);
        console.log('🔍 Code déclarant spécifiquement:', searchParams.codeDeclarant);
        
        this.conteneurService.updateSearchParams(searchParams);
        this.loadData();
      })
    );

    this.subscriptions.push(
      this.conteneurService.searchParams$.subscribe((params: any) => {
        this.currentPage = params.page;
        this.pageSize = params.size;
      })
    );
  }

  loadUserContext(): void {
    this.userRole = this.conteneurService.getCurrentUserRole();
    this.username = this.conteneurService.getCurrentUsername();
    this.isFilteredAccess = this.conteneurService.hasFilteredAccess();
    this.interface = this.conteneurService.getInterfaceConfig();
  }

  updateInterfaceForRole(): void {
    const codeDeclarantControl = this.searchForm.get('codeDeclarant');
    
    if (this.userRole === 'Declarant') {
      codeDeclarantControl?.disable();
      codeDeclarantControl?.setValue('');
    } else {
      codeDeclarantControl?.enable();
    }
  }

  loadData(): void {
  console.log('=== VÉRIFICATION PERMISSIONS ===');
  console.log('Utilisateur connecté:', this.conteneurService.isUserConnectedWithPermissions());
  console.log('Rôle utilisateur:', this.userRole);
  console.log('Accès filtré:', this.isFilteredAccess);
  
  if (!this.conteneurService.isUserConnectedWithPermissions()) {
    console.log('Utilisateur non autorisé - arrêt du chargement');
    return;
  }
  
  this.invalidateCache();
  this.loadConteneursData();
  this.loadStatistics();
}

  // Méthode pour forcer le rechargement des données
forceReloadData(): void {
  console.log('🔄 Rechargement forcé des données');
  this.loadData();
}

// Méthode pour forcer la recherche manuelle
onSearch(): void {
  console.log('🔍 Recherche manuelle déclenchée');
  const formValues = this.searchForm.value;
  console.log('🔍 Valeurs du formulaire:', formValues);
  
  const searchParams = {
    searchKey: formValues.keyword || '',
    codeDeclarant: formValues.codeDeclarant || '',
    dateDebut: formValues.startDate,
    dateFin: formValues.endDate,
    page: 0,
    size: this.pageSize
  };
  
  console.log('🔍 Paramètres de recherche manuelle:', searchParams);
  this.conteneurService.updateSearchParams(searchParams);
  this.loadData();
}

  loadConteneursData(): void {
  this.loading = true;
  const searchParams = this.conteneurService.getSearchParamsValue();
  
  this.subscriptions.push(
    this.conteneurService.getConteneursWithPaginationAndSearch(searchParams).subscribe({
      next: (response: PageResponse<AffectationConteneur>) => {
        console.log('📊 Données reçues:', response);
        this.declarations = response.data;
        this.totalElements = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.currentPage = response.page.pageNumber;
        
        console.log('📈 Compteurs après chargement:');
        console.log('- declarations.length:', this.declarations.length);
        console.log('- totalElements:', this.totalElements);
        console.log('- getUniqueContainers().length:', this.getUniqueContainers().length);
        console.log('- getTotalPhysicalContainers():', this.getTotalPhysicalContainers());
        
        // Précharger les détails pour avoir le vrai décompte
        this.preloadAllContainerDetails();
        
        // Forcer la mise à jour des compteurs après un délai
        setTimeout(() => {
          console.log('🔄 Mise à jour des compteurs après chargement des détails');
          console.log('- declarations.length:', this.declarations.length);
          console.log('- getUniqueContainers().length:', this.getUniqueContainers().length);
          console.log('- getTotalPhysicalContainers():', this.getTotalPhysicalContainers());
        }, 1000);
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.resetDataToEmpty();
        this.loading = false;
      }
    })
  );
}

preloadAllContainerDetails(): void {
  for (const rdv of this.declarations) {
    if (rdv.uuid && !this.detailsCache[rdv.uuid]) {
      this.loadDetailConteneurForModal(rdv.uuid);
    }
  }
}

  loadStatistics(): void {
  const searchParams = this.conteneurService.getSearchParamsValue();
  
  this.subscriptions.push(
    this.conteneurService.getStatistiquesConteneurs(searchParams).subscribe({
      next: (stats: any) => {
        this.statistics = {
          totalConteneurs: stats.totalConteneurs || 0,
          conteneursEnAttente: stats.conteneursEnAttente || 0,
          conteneursSortis: stats.conteneursSortis || 0,
          pourcentageSortie: stats.pourcentageSortie || 0
        };
        
        // NOUVELLE LOGIQUE : Utiliser les données du backend pour les types
        this.chartData.conteneursByType = [
          { name: '20 pieds', value: stats.conteneurs20Pieds || 0, color: '#007bff' },
          { name: '40 pieds', value: stats.conteneurs40Pieds || 0, color: '#28a745' },
          { name: 'Autres types', value: stats.conteneursAutresTypes || 0, color: '#ffc107' }
        ];
        
        this.chartData.conteneursByStatus = [
          { name: 'En attente', value: stats.conteneursEnAttente || 0, color: '#ffc107' },
          { name: 'Sortis', value: stats.conteneursSortis || 0, color: '#28a745' }
        ];
        
        console.log('Statistiques reçues du backend:', {
          total: stats.totalConteneurs,
          sortis: stats.conteneursSortis,
          type20: stats.conteneurs20Pieds,
          type40: stats.conteneurs40Pieds,
          autres: stats.conteneursAutresTypes
        });
      },
      error: () => {
        this.statistics = {
          totalConteneurs: 0,
          conteneursEnAttente: 0,
          conteneursSortis: 0,
          pourcentageSortie: 0
        };
        
        // Réinitialiser les graphiques en cas d'erreur
        this.chartData.conteneursByType = [
          { name: '20 pieds', value: 0, color: '#007bff' },
          { name: '40 pieds', value: 0, color: '#28a745' },
          { name: 'Autres types', value: 0, color: '#ffc107' }
        ];
        
        this.chartData.conteneursByStatus = [
          { name: 'En attente', value: 0, color: '#ffc107' },
          { name: 'Sortis', value: 0, color: '#28a745' }
        ];
      }
    })
  );
}
  


  // Navigation optimisée
  onPageChange(page: number): void {
    this.conteneurService.updateSearchParams({ page });
    this.loadConteneursData();
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.conteneurService.updateSearchParams({ size: newSize, page: 0 });
    this.loadConteneursData();
  }

  resetFilters(): void {
    const baseForm = {
      keyword: '',
      startDate: this.getDefaultStartDate(),
      endDate: new Date()
    };
    
    if (this.userRole === 'Declarant') {
      this.searchForm.reset({ ...baseForm, codeDeclarant: '' });
      this.searchForm.get('codeDeclarant')?.disable();
    } else {
      this.searchForm.reset({ ...baseForm, codeDeclarant: '' });
      this.searchForm.get('codeDeclarant')?.enable();
    }
    
    this.loadData();
  }

 
  getUniqueContainers(): any[] {
  console.log('=== DEBUG CONTENEURS UNIQUES ===');
  console.log('RDV disponibles:', this.declarations.length);
  
  if (!this.declarations?.length) {
    return [];
  }

  const rdvMap = new Map();
  
  // Traiter chaque RDV et éviter les doublons
  for (const rdv of this.declarations) {
    const key = rdv.uuid; // Utiliser l'UUID comme clé unique
    
    // Vérifier si ce RDV n'est pas déjà traité
    if (!rdvMap.has(key)) {
      rdvMap.set(key, {
        numeroConteneur: rdv.referenceDeclaration, // Référence DEC
        uuid: rdv.uuid,
        poidNet: 0,
        count: 1,
        parentData: rdv
      });
    }
  }
  
  const result = Array.from(rdvMap.values());
  console.log('RDV uniques générés:', result.length);
  
  return result;
}
  

getTotalPhysicalContainers(): number {
  // Pour l'instant, retourner le nombre de RDV comme estimation
  // Les détails seront chargés de manière asynchrone
  const totalRDV = this.declarations.length;
  
  // Si on a des détails chargés, les compter
  let totalWithDetails = 0;
  for (const rdv of this.declarations) {
    const details = this.detailsCache[rdv.uuid];
    if (details && details.length > 0) {
      totalWithDetails += details.length;
    }
  }
  
  // Retourner le total des détails si disponible, sinon le nombre de RDV
  return totalWithDetails > 0 ? totalWithDetails : totalRDV;
}
  // Méthodes pour le template (calculées à la volée - plus rapide que le cache pour ces petits calculs)
  getTotalContainerTypes(): number {
    return this.chartData.conteneursByType.reduce((total, item) => total + item.value, 0);
  }

  getTotalContainerStatus(): number {
    return this.chartData.conteneursByStatus.reduce((total, item) => total + item.value, 0);
  }

  // Méthodes utilitaires minimales
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Non défini';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isNaN(dateObj.getTime()) ? 'Date invalide' : 
        dateObj.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    } catch {
      return 'Erreur de format';
    }
  }

  getRoleDisplayName(): string {
    return this.conteneurService.getRoleDisplayName();
  }

  canModifyCodeDeclarant(): boolean {
    return this.conteneurService.canModifyCodeDeclarant();
  }

  // Modal
  openModal(content: TemplateRef<any>, parentData: any): void {
    this.title = 'Détails de l\'affectation conteneur';
    this.parentProperty = parentData;
    
    // Précharger les détails des conteneurs
    if (parentData && parentData.uuid) {
      this.loadDetailConteneurForModal(parentData.uuid);
    }
    
    this.modalService.open(content, { 
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }
getContainersForRDV(rdvUuid: string): any[] {
  console.log('=== DEBUG getContainersForRDV ===');
  console.log('UUID recherché:', rdvUuid);
  
  // Vérification stricte
  if (!rdvUuid || rdvUuid.trim() === '') {
    console.log('UUID vide ou invalide');
    return [];
  }
  
  // Vérifier si les détails sont déjà en cache
  if (this.detailsCache[rdvUuid]) {
    console.log('Détails trouvés en cache:', this.detailsCache[rdvUuid]);
    return this.detailsCache[rdvUuid];
  }
  
  // Si pas en cache, lancer le chargement
  this.loadDetailConteneurForModal(rdvUuid);
  
  // Toujours retourner un tableau vide en attendant
  return [];
}
loadDetailConteneurForModal(conteneurUuid: string): void {
  console.log('Chargement des détails pour:', conteneurUuid);
  
  this.detailConteneurService.getDetailConteneurAffectation(conteneurUuid).subscribe({
    next: (details: any) => {
      console.log('Détails reçus du service:', details);
      
      // Stocker en cache
      if (Array.isArray(details)) {
        this.detailsCache[conteneurUuid] = details;
      } else if (details && details.data && Array.isArray(details.data)) {
        this.detailsCache[conteneurUuid] = details.data;
      } else {
        console.warn('Format de réponse inattendu:', details);
        this.detailsCache[conteneurUuid] = [];
      }
      
      console.log('Détails mis en cache:', this.detailsCache[conteneurUuid]);
      
      // Mettre à jour les compteurs après chargement des détails
      this.updateCountersAfterDetailsLoaded();
    },
    error: (error: any) => {
      console.error('Erreur lors du chargement des détails:', error);
      this.detailsCache[conteneurUuid] = [];
    }
  });
}

// Méthode pour mettre à jour les compteurs après chargement des détails
private updateCountersAfterDetailsLoaded(): void {
  console.log('🔄 Mise à jour des compteurs après chargement des détails');
  console.log('- declarations.length:', this.declarations.length);
  console.log('- getUniqueContainers().length:', this.getUniqueContainers().length);
  console.log('- getTotalPhysicalContainers():', this.getTotalPhysicalContainers());
}
  // Export optimisé
  exportContainerData(): void {
    const containers = this.getUniqueContainers();
    
    if (!containers.length) return;

    const exportData = containers.map(Container => ({
      'Numéro Conteneur': Container.numeroConteneur,
      'Référence RDV': Container.parentData.reference,
      'Chauffeur': Container.parentData.nomcompletDriver,
      'Destination': Container.parentData.destination,
      'Commune': Container.parentData.commune,
      'Compagnie': Container.parentData.compagnie,
      'Poids Net': Container.poidNet
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conteneurs_sortis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  refreshData(): void {
    console.log('🔄 Actualisation manuelle des données');
    this.forceReloadData();
  }

  // TrackBy pour optimiser ngFor
  trackByName(index: number, item: any): string {
    return item?.name || index.toString();
  }

  trackByContainer(index: number, Container: any): string {
    return Container?.uuid || Container?.numeroConteneur || index.toString();
  }

  // Méthodes privées optimisées
  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  private resetDataToEmpty(): void {
    this.declarations = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.currentPage = 0;
  }

  private invalidateCache(): void {
    this.containerCache.clear();
    this.cacheTimestamp = 0;
  }
  goToPreviousPage(): void {
  if (this.currentPage > 0) {
    this.onPageChange(this.currentPage - 1);
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages - 1) {
    this.onPageChange(this.currentPage + 1);
  }
}
goToPage(page: number): void {
  if (page !== this.currentPage && page >= 0 && page < this.totalPages) {
    this.onPageChange(page);
  }
}

getVisiblePages(): number[] {
  if (this.totalPages <= 5) {
    // Afficher toutes les pages si 5 ou moins
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  
  const pages: number[] = [];
  const start = Math.max(0, this.currentPage - 2);
  const end = Math.min(this.totalPages - 1, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
}

// Méthode pour obtenir les numéros de page pour la pagination
getPageNumbers(): number[] {
  const pages: number[] = [];
  const maxVisible = 5;
  
  if (this.totalPages <= maxVisible) {
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
}

// Méthode pour exporter vers Excel
exportToExcel(): void {
  if (this.declarations.length === 0) {
    console.warn('Aucune donnée à exporter');
    return;
  }
  
  try {
    // Créer un tableau de données pour l'export
    const data = this.declarations.map(Declaration => ({
      'Référence DEC': Declaration.referenceDeclaration,
      'Numéro RDV': Declaration.numero,
      'Chauffeur': Declaration.nomcompletDriver,
      'Téléphone': Declaration.phoneDriver,
      'Permis': Declaration.permitDriver,
      'Destination': Declaration.destination,
      'Quittance': Declaration.quittance,
      'Commune': Declaration.commune,
      'Immatriculation': Declaration.immarticulation,
      'Compagnie': Declaration.compagnie,
      'Statut': Declaration.status,
      'Date Sortie': Declaration.dateSortie ? new Date(Declaration.dateSortie).toLocaleDateString() : 'N/A'
    }));
    
    // Convertir en CSV
    const csvContent = this.convertToCSV(data);
    
    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conteneurs_sortis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Export Excel réussi');
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
  }
}

// Méthode pour convertir les données en CSV
private convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Ajouter les en-têtes
  csvRows.push(headers.join(','));
  
  // Ajouter les données
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Échapper les virgules et guillemets
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

}








