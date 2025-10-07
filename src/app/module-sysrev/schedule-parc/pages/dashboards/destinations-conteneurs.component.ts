// destinations-conteneurs.component.ts - Version complète corrigée
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {ConteneurService} from "../../../services/conteneur.service";

interface StatistiqueDestination {
  destination: string;
  total: number;
  sortis: number;
  enCours: number;
  enAttente: number; // Ajouté
  pourcentage: number;
  tauxSortie: number; // Ajouté
  couleur?: string;
}

@Component({
  selector: 'app-destinations-conteneurs',
  templateUrl: './destinations-conteneurs.component.html',
  styleUrls: ['./destinations-conteneurs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationsConteneursComponent implements OnInit, OnDestroy {
   Math = Math;
  private destroy$ = new Subject<void>();
  
  // PROPRIÉTÉS LOCALES (plus d'@Input nécessaires)
  showSection = false;
  selectedCodeDeclarant = '';
  selectedDateDebut: Date | null = null;
  selectedDateFin: Date | null = null;
  selectedDateDebutStr = '';
  selectedDateFinStr = '';
  
  // Données destinations
  statistiquesDestinations: StatistiqueDestination[] = [];
  statistiquesCompletesParDestination: any[] = [];
  evolutionParDestination: any[] = [];
  
  // États
  isLoading = false;
  errorMessage = '';
  
  // Pagination
  destinationsCurrentPage = 0;
  destinationsPageSize = 10;
  destinationsTotalPages = 0;
  destinationsTotalElements = 0;
  destinationsItemsPerPage = 10; // Ajouté pour le select
  
  // Total global
  totalGlobalConteneursSortis = 0;
  
  // Cache et performance
  private cache = new Map<string, any>();
  private lastUpdateTime = 0;
  private readonly CACHE_DURATION = 30000; // 30 secondes
  
  // Couleurs pour les graphiques
  private colors = [
    'rgba(54, 162, 235, 0.8)',   // Bleu
    'rgba(255, 99, 132, 0.8)',   // Rouge
    'rgba(255, 206, 86, 0.8)',   // Jaune
    'rgba(75, 192, 192, 0.8)',   // Vert
    'rgba(153, 102, 255, 0.8)',  // Violet
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(199, 199, 199, 0.8)',  // Gris
    'rgba(83, 102, 255, 0.8)'    // Indigo
  ];
  
  constructor(
    public conteneurService: ConteneurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est DG
    this.showSection = this.conteneurService.isDG() || this.conteneurService.isDGA()  || this.conteneurService.isChefparc() || this.conteneurService.isDIS();
    
    if (this.showSection) {
      this.loadDestinationsFromBackend();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // FILTRES - Méthodes pour gérer les changements
  onCodeDeclarantChange(value: string) {
    this.selectedCodeDeclarant = value;
    this.onFiltersChange();
  }

  onDateDebutChange() {
    this.selectedDateDebut = this.selectedDateDebutStr ? new Date(this.selectedDateDebutStr) : null;
    this.onFiltersChange();
  }

  onDateFinChange() {
    this.selectedDateFin = this.selectedDateFinStr ? new Date(this.selectedDateFinStr) : null;
    this.onFiltersChange();
  }

  onFiltersChange() {
    this.destinationsCurrentPage = 0; // Reset à la première page
    this.loadDestinationsFromBackend();
  }

  // CHARGEMENT DES DONNÉES BACKEND
  loadDestinationsFromBackend() {
    if (!this.conteneurService.isDG() && !this.conteneurService.isDGA() && !this.conteneurService.isChefparc() && !this.conteneurService.isDIS()) {
      this.showSection = false;
      this.cdr.detectChanges();
      return;
    }

    // Vérification cache
    const cacheKey = this.getCacheKey();
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && (now - this.lastUpdateTime) < this.CACHE_DURATION) {
      const cachedData = this.cache.get(cacheKey);
      this.applyBackendResponse(cachedData);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const params = {
      codeDeclarant: this.selectedCodeDeclarant || undefined,
      startDate: this.selectedDateDebut?.toISOString().split('T')[0] || undefined,
      endDate: this.selectedDateFin?.toISOString().split('T')[0] || undefined,
      page: this.destinationsCurrentPage,
      size: this.destinationsPageSize
    };

    console.log('🔄 Chargement destinations avec params:', params);

    this.conteneurService.getStatistiquesDestinations(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Réponse backend destinations:', response);
          
          // Mise en cache
          this.cache.set(cacheKey, response);
          this.lastUpdateTime = now;
          
          this.applyBackendResponse(response);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Erreur chargement destinations:', error);
          this.handleError(error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private applyBackendResponse(response: any) {
    // Adapter selon votre structure de réponse backend
    if (response && response.data) {
      // Format PageDataDto<StatistiquesDestinationDto>
      this.statistiquesDestinations = this.transformBackendData(response.data);
      this.destinationsCurrentPage = response.page?.pageNumber || 0;
      this.destinationsTotalPages = response.page?.totalPages || 0;
      this.destinationsTotalElements = response.page?.totalElements || 0;
      this.destinationsPageSize = response.page?.size || 10;
      
      // Récupérer le total global de conteneurs sortis
      this.totalGlobalConteneursSortis = response.totalGlobalConteneursSortis || response.totalSortis || 0;
    } else if (response && response.destinations) {
      // Format personnalisé avec wrapper
      this.statistiquesDestinations = response.destinations;
      this.statistiquesCompletesParDestination = response.statistiquesCompletes || [];
      this.evolutionParDestination = response.evolution || [];
      this.destinationsCurrentPage = response.pagination?.currentPage || 0;
      this.destinationsTotalPages = response.pagination?.totalPages || 0;
      this.destinationsTotalElements = response.pagination?.totalElements || 0;
      
      // Récupérer le total global de conteneurs sortis
      this.totalGlobalConteneursSortis = response.totalGlobalConteneursSortis || response.totalSortis || 0;
    }
  }

  private transformBackendData(backendData: any[]): StatistiqueDestination[] {
    return backendData.map((item, index) => {
      const total = item.nombreConteneurs || item.total || 0;
      const sortis = item.sortis || 0;
      const enCours = item.enCours || (total - sortis) || 0;
      const enAttente = item.enAttente || enCours;
      const tauxSortie = total > 0 ? Math.round((sortis / total) * 100) : 0;
      
      return {
        destination: item.destination || `Destination ${index + 1}`,
        total: total,
        sortis: sortis,
        enCours: enCours,
        enAttente: enAttente,
        pourcentage: item.pourcentage || (total > 0 ? Math.round((total / this.getTotalDestinations()) * 100) : 0),
        tauxSortie: tauxSortie,
        couleur: this.getColorForIndex(index)
      };
    });
  }

  // PAGINATION
  onPageChange(newPage: number) {
    if (newPage >= 0 && newPage < this.destinationsTotalPages) {
      this.destinationsCurrentPage = newPage;
      this.loadDestinationsFromBackend();
    }
  }

  goToPreviousPage() {
    if (this.canGoPrevious) {
      this.onPageChange(this.destinationsCurrentPage - 1);
    }
  }

  goToNextPage() {
    if (this.canGoNext) {
      this.onPageChange(this.destinationsCurrentPage + 1);
    }
  }

  // MÉTHODES DE PAGINATION MANQUANTES
  goToDestinationsPage(pageNum: number) {
    this.onPageChange(pageNum - 1); // pageNum est base 1, currentPage est base 0
  }

  nextDestinationsPage() {
    this.goToNextPage();
  }

  previousDestinationsPage() {
    this.goToPreviousPage();
  }

  getDestinationsPageNumbers(): number[] {
    return this.displayPages;
  }

  onDestinationsPageSizeChange(newSize: number) {
    this.destinationsPageSize = newSize;
    this.destinationsItemsPerPage = newSize;
    this.destinationsCurrentPage = 0;
    this.loadDestinationsFromBackend();
  }

  // PROPRIÉTÉS CALCULÉES
  get canGoPrevious(): boolean {
    return this.destinationsCurrentPage > 0;
  }

  get canGoNext(): boolean {
    return this.destinationsCurrentPage < this.destinationsTotalPages - 1;
  }

  get displayCurrentPage(): number {
    return this.destinationsCurrentPage + 1;
  }

  get displayPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(0, this.destinationsCurrentPage - 2);
    const endPage = Math.min(this.destinationsTotalPages - 1, this.destinationsCurrentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  // MÉTHODES CALCULÉES MANQUANTES
  getTotalDestinations(): number {
    return this.destinationsTotalElements;
  }

  getTotalConteneursDestinations(): number {
    return this.statistiquesDestinations.reduce((total, dest) => total + dest.total, 0);
  }
  
  getTotalSortisDestinations(): number {
    return this.statistiquesDestinations.reduce((total, dest) => total + dest.sortis, 0);
  }

  getTotalEnAttenteDestinations(): number {
    return this.statistiquesDestinations.reduce((total, dest) => total + dest.enAttente, 0);
  }

  getTauxSortieGlobalDestinations(): number {
    const totalConteneurs = this.getTotalConteneursDestinations();
    const totalSortis = this.getTotalSortisDestinations();
    return totalConteneurs > 0 ? Math.round((totalSortis / totalConteneurs) * 100) : 0;
  }

  getMeilleureDestination(): StatistiqueDestination | null {
    if (this.statistiquesDestinations.length === 0) return null;
    return this.statistiquesDestinations.reduce((meilleure, dest) => 
      dest.tauxSortie > meilleure.tauxSortie ? dest : meilleure
    );
  }

  getDestinationMaxAttente(): StatistiqueDestination | null {
    if (this.statistiquesDestinations.length === 0) return null;
    return this.statistiquesDestinations.reduce((maxAttente, dest) => 
      dest.enAttente > maxAttente.enAttente ? dest : maxAttente
    );
  }

  getDestinationColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getDestinationPercentage(total: number): number {
    const globalTotal = this.getTotalConteneursDestinations();
    return globalTotal > 0 ? Math.round((total / globalTotal) * 100) : 0;
  }

  getTauxSortieClass(tauxSortie: number): string {
    if (tauxSortie >= 80) return 'bg-success text-white';
    if (tauxSortie >= 50) return 'bg-warning text-dark';
    return 'bg-danger text-white';
  }

  getPerformanceLabel(tauxSortie: number): string {
    if (tauxSortie >= 80) return 'Excellent';
    if (tauxSortie >= 60) return 'Bon';
    if (tauxSortie >= 40) return 'Moyen';
    return 'Faible';
  }

  getDonutChartData(): any[] {
    return this.statistiquesDestinations.slice(0, 8).map((dest, index) => {
      const angle = (dest.pourcentage / 100) * 360;
      return {
        ...dest,
        angle: angle,
        color: this.getColorForIndex(index)
      };
    });
  }

  // UTILITAIRES
  private getCacheKey(): string {
    return `destinations_${this.selectedCodeDeclarant}_${this.selectedDateDebut?.toISOString()}_${this.selectedDateFin?.toISOString()}_${this.destinationsCurrentPage}_${this.destinationsPageSize}`;
  }

  private handleError(error: any) {
    if (error.status === 403) {
      this.errorMessage = 'Accès non autorisé. Cette fonctionnalité est réservée au DG.';
      this.showSection = false;
    } else if (error.status === 0) {
      this.errorMessage = 'Erreur de connexion au serveur.';
    } else {
      this.errorMessage = 'Erreur lors du chargement des destinations.';
    }
  }

  private getColorForIndex(index: number): string {
    return this.colors[index % this.colors.length];
  }

  trackByDestination(index: number, item: StatistiqueDestination): string {
    return item.destination;
  }

  refreshData() {
    this.cache.clear();
    this.loadDestinationsFromBackend();
  }
getMaxElementsShown(): number {
  return Math.min((this.destinationsCurrentPage + 1) * this.destinationsPageSize, this.destinationsTotalElements);
}
// Ajoutez cette méthode dans votre composant TypeScript
calculateSectorPath(dest: StatistiqueDestination, index: number): string {
  const total = this.getTotalConteneursDestinations();
  if (total === 0) return '';
  
  const percentage = (dest.total / total) * 100;
  const angle = (percentage / 100) * 360;
  
  // Calculer l'angle de début (somme des angles précédents)
  let startAngle = 0;
  for (let i = 0; i < index; i++) {
    const prevPercentage = (this.statistiquesDestinations[i].total / total) * 100;
    startAngle += (prevPercentage / 100) * 360;
  }
  
  const endAngle = startAngle + angle;
  
  // Convertir en radians
  const startAngleRad = (startAngle - 90) * (Math.PI / 180);
  const endAngleRad = (endAngle - 90) * (Math.PI / 180);
  
  // Points sur le cercle extérieur (rayon 80)
  const x1 = 150 + 80 * Math.cos(startAngleRad);
  const y1 = 150 + 80 * Math.sin(startAngleRad);
  const x2 = 150 + 80 * Math.cos(endAngleRad);
  const y2 = 150 + 80 * Math.sin(endAngleRad);
  
  // Points sur le cercle intérieur (rayon 50)
  const x3 = 150 + 50 * Math.cos(endAngleRad);
  const y3 = 150 + 50 * Math.sin(endAngleRad);
  const x4 = 150 + 50 * Math.cos(startAngleRad);
  const y4 = 150 + 50 * Math.sin(startAngleRad);
  
  // Déterminer si l'arc est large (> 180°)
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  // Construire le chemin SVG
  return [
    `M ${x1} ${y1}`,                    // Aller au point de début
    `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc extérieur
    `L ${x3} ${y3}`,                    // Ligne vers l'intérieur
    `A 50 50 0 ${largeArcFlag} 0 ${x4} ${y4}`, // Arc intérieur
    'Z'                                 // Fermer le chemin
  ].join(' ');
}
}







