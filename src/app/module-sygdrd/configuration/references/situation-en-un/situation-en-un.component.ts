import {Component, Input, OnInit, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {Realisation} from "../../../models/Realisation";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {Unite} from "../../../models/Unite";
import {RealisationService} from "../../../services/realisation.service";
import {PrintService} from "../../../services/print.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {UniteService} from "../../../services/unite.service";
import { DomSanitizer } from '@angular/platform-browser';
import { AiAnalysisService, AnalysisConfig } from '../../../services/ai-analysis.service';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-situation-en-un',
  templateUrl: './situation-en-un.component.html',
  styleUrl: './situation-en-un.component.scss'
})
export class SituationEnUnComponent implements OnInit {

  breadcrumbItems!: Array<{}>;
  realisations: Realisation[] | undefined = [];
  key: string = "";
  pageData: PagedData<Realisation> = new PagedData<Realisation>();
  pageNumber: number = 0;
  size: number = 10;
  pageSelected: Page = new Page();
  unite: Unite = new Unite();
  unites: Unite[] = [];

  // Propriétés pour l'autocomplétition
  selectedUnite: Unite | null = null;
  uniteSearch: string = '';
  filteredUnites: Unite[] = [];
  showUniteDropdown: boolean = false;

  // Propriétés pour les sélecteurs
  typeSituation: string = '';  // 'INTERVALLE' ou 'MOMENT'
  scope: string = '';          // 'UNITE' ou 'DOUANE'

  filterRealisation: Realisation[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array();
  outerRealisation!: Realisation;
  debut: string = "";
  fin: string = "";
  periodicite: string = "";
  isData: boolean = false;

  // Propriétés pour le spinner et la validation des dates
  isLoading: boolean = false;
  dateError: string | null = null;
  isPrinting: boolean = false;
  isExporting: boolean = false;

  // Propriétés pour l'analyse IA
  isAnalysing: boolean = false;
  analysisResult: string | null = null;
  analysisError: string | null = null;

  // Propriété pour suivre si une recherche a été effectuée
  hasSearched: boolean = false;

  // Année de limitation minimum
  private readonly MIN_YEAR: number = 2020;

  constructor(
      private realisationService: RealisationService,
      private uniteService: UniteService,
      private printService: PrintService,
      private modalService: NgbModal,
      private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Direction Generale des Douanes', active: true }
    ];

   this.uniteService.getAllUnite().subscribe((response: any) => {
      if (response && response.data) {
          this.unites = response.data;
          this.filteredUnites = [...response.data];
      } else {
        this.unites = [];
        this.filteredUnites = [];
      }
    });

    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;
    this.pageData.page = this.pageSelected;
    this.pageData.data = new Array();
  }

  // Méthodes pour gérer les sélecteurs
  onTypeSituationChange(): void {
    if (this.typeSituation === 'MOMENT') {
      this.fin = '';
    }
    this.dateError = null;
    this.resetData();
  }

  onScopeChange(): void {
    if (this.scope === 'DOUANE') {
      this.selectedUnite = null;
      this.uniteSearch = '';
      this.unite = new Unite();
    }
    this.resetData();
  }

  // Méthode utilitaire pour réinitialiser les données
  private resetData(): void {
    this.isData = false;
    this.pageData.data = [];
    this.totalPage = 0;
    this.hasSearched = false;
  }

  // Méthodes pour la gestion de l'autocomplétition des unités
  onUniteSearchChange(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.uniteSearch = searchTerm;

    if (searchTerm.trim() === '') {
      this.filteredUnites = [...this.unites];
      this.selectedUnite = null;
    } else {
      this.filteredUnites = this.unites.filter(unite =>
          unite.nomUnite.toLowerCase().includes(searchTerm) ||
          unite.codeUnite.toLowerCase().includes(searchTerm) ||
          unite.typeUnite.toLowerCase().includes(searchTerm)
      );
    }
    this.showUniteDropdown = true;
  }

  selectUnite(unite: Unite): void {
    this.breadcrumbItems = [
      { label: unite?.nomUnite || 'Réalisation Unité', active: true }
    ];
    this.selectedUnite = unite;
    this.uniteSearch = unite.nomUnite;
    this.unite = unite;
    this.showUniteDropdown = false;
    this.resetData();
  }

  onUniteBlur(): void {
    setTimeout(() => {
      this.showUniteDropdown = false;

      if (!this.selectedUnite && this.uniteSearch.trim() === '') {
        this.filteredUnites = [...this.unites];
      }

      if (this.selectedUnite && this.uniteSearch !== this.selectedUnite.nomUnite) {
        this.selectedUnite = null;
        this.unite = new Unite();
      }
    }, 200);
  }

  // Méthode pour gérer le changement de périodicité
  onPeriodiciteChange(): void {
    this.debut = "";
    this.fin = "";
    this.dateError = null;
    this.resetData();
  }

  // Méthode pour déterminer le type d'input selon la périodicité
  getInputType(): string {
    switch (this.periodicite) {
      case 'JOUR':
        return 'date';
      case 'MOIS':
        return 'month';
      case 'ANNEE':
        return 'number';
      default:
        return 'date';
    }
  }

  // Méthode pour obtenir le placeholder approprié
  getPlaceholder(type: 'debut' | 'fin'): string {
    let prefix = '';
    if (this.typeSituation === 'MOMENT') {
      prefix = 'Date de la situation';
    } else {
      prefix = type === 'debut' ? 'Date de début' : 'Date de fin';
    }

    switch (this.periodicite) {
      case 'JOUR':
        return `${prefix} (jour)`;
      case 'MOIS':
        return `${prefix} (mois)`;
      case 'ANNEE':
        return `${prefix} (année)`;
      default:
        return prefix;
    }
  }

  // Méthode pour obtenir le label du champ début
  getDebutLabel(): string {
    if (this.typeSituation === 'MOMENT') {
      return 'Année de la situation';
    }
    return 'Année de début';
  }

  // Méthode pour obtenir le label du total selon le type de situation et la périodicité
  getTotalLabel(): string {
    if (this.typeSituation === 'MOMENT') {
      switch (this.periodicite) {
        case 'JOUR':
          return 'Total Mois';
        case 'MOIS':
        case 'ANNEE':
          return 'Total Année';
        default:
          return 'Total';
      }
    }
    return 'Total Intervalle';
  }

  // Méthode pour obtenir la date maximum (aujourd'hui)
  getMaxDate(): string {
    const today = new Date();
    switch (this.periodicite) {
      case 'JOUR':
        return today.toISOString().split('T')[0];
      case 'MOIS':
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      case 'ANNEE':
        return today.getFullYear().toString();
      default:
        return today.toISOString().split('T')[0];
    }
  }

  // Méthode pour obtenir la liste des années disponibles
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];

    for (let year = this.MIN_YEAR; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  }

  // Méthode pour obtenir les années disponibles pour le champ fin
  getYearOptionsForEnd(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = this.debut ? parseInt(this.debut) : this.MIN_YEAR;
    const minYear = Math.max(startYear, this.MIN_YEAR);
    const years: number[] = [];

    for (let year = minYear; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  }

  // Méthode pour obtenir la date minimum
  getMinDate(): string {
    switch (this.periodicite) {
      case 'JOUR':
        return `${this.MIN_YEAR}-01-01`;
      case 'MOIS':
        return `${this.MIN_YEAR}-01`;
      case 'ANNEE':
        return this.MIN_YEAR.toString();
      default:
        return `${this.MIN_YEAR}-01-01`;
    }
  }

  // Méthode pour valider les champs obligatoires
  isSearchDisabled(): boolean {
    if (this.isLoading || this.dateError || !this.typeSituation || !this.scope || !this.periodicite || !this.debut) {
      return true;
    }

    if (this.scope === 'UNITE' && !this.selectedUnite) {
      return true;
    }

    if (this.typeSituation === 'INTERVALLE' && !this.fin) {
      return true;
    }

    return false;
  }

  // Méthode pour obtenir le message de validation approprié
  getValidationMessage(): string | null {
    if (!this.typeSituation || !this.scope || !this.periodicite) {
      return null;
    }

    if (this.scope === 'UNITE' && !this.selectedUnite && (this.debut || this.fin)) {
      return 'Veuillez sélectionner une unité pour effectuer la recherche.';
    }

    if (this.typeSituation === 'INTERVALLE' && this.debut && !this.fin) {
      return 'Veuillez sélectionner une date de fin pour la recherche par intervalle.';
    }

    return null;
  }

  // Méthode pour vérifier si une recherche complète a été effectuée
  isSearchComplete(): boolean {
    const hasRequiredFields = this.typeSituation && this.scope && this.periodicite && this.debut;
    const hasUniteIfRequired = this.scope === 'DOUANE' || (this.scope === 'UNITE' && this.selectedUnite);
    const hasFinIfRequired = this.typeSituation === 'MOMENT' || (this.typeSituation === 'INTERVALLE' && this.fin);

    return !!(hasRequiredFields && hasUniteIfRequired && hasFinIfRequired && !this.dateError);
  }

  // Méthode pour valider une date unique (pour le type MOMENT)
  validateSingleDate(): boolean {
    this.dateError = null;

    if (!this.debut) {
      return true;
    }

    let today = new Date();
    let dateToValidate: Date;

    switch (this.periodicite) {
      case 'JOUR':
        dateToValidate = new Date(this.debut);
        today.setHours(23, 59, 59, 999);
        break;

      case 'MOIS':
        const [year, month] = this.debut.split('-').map(Number);
        dateToValidate = new Date(year, month - 1, 1);
        today = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      case 'ANNEE':
        const yearNum = parseInt(this.debut);
        const currentYear = new Date().getFullYear();

        if (yearNum < this.MIN_YEAR) {
          this.dateError = `L'année ne peut pas être antérieure à ${this.MIN_YEAR}.`;
          return false;
        }

        if (yearNum > currentYear) {
          this.dateError = "L'année ne peut pas être supérieure à cette année.";
          return false;
        }

        return true;

      default:
        return false;
    }

    if (dateToValidate > today) {
      let errorMessage = "La date ne peut pas être supérieure à ";
      switch (this.periodicite) {
        case 'JOUR':
          errorMessage += "aujourd'hui.";
          break;
        case 'MOIS':
          errorMessage += "ce mois-ci.";
          break;
      }
      this.dateError = errorMessage;
      return false;
    }

    return true;
  }

  validateDates(): boolean {
    this.dateError = null;

    if (!this.debut) {
      return true;
    }

    // Pour le type MOMENT, valider seulement la date unique
    if (this.typeSituation === 'MOMENT') {
      return this.validateSingleDate();
    }

    // Pour le type INTERVALLE, valider les deux dates
    if (!this.fin) {
      return true;
    }

    let startDate: Date;
    let endDate: Date;
    let today = new Date();

    switch (this.periodicite) {
      case 'JOUR':
        startDate = new Date(this.debut);
        endDate = new Date(this.fin);
        today.setHours(23, 59, 59, 999);
        break;

      case 'MOIS':
        const [startYear, startMonth] = this.debut.split('-').map(Number);
        const [endYear, endMonth] = this.fin.split('-').map(Number);
        startDate = new Date(startYear, startMonth - 1, 1);
        endDate = new Date(endYear, endMonth - 1, 1);
        today = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

      case 'ANNEE':
        const startYearNum = parseInt(this.debut);
        const endYearNum = parseInt(this.fin);
        const currentYear = new Date().getFullYear();

        if (startYearNum < this.MIN_YEAR) {
          this.dateError = `L'année de début ne peut pas être antérieure à ${this.MIN_YEAR}.`;
          return false;
        }

        if (endYearNum < this.MIN_YEAR) {
          this.dateError = `L'année de fin ne peut pas être antérieure à ${this.MIN_YEAR}.`;
          return false;
        }

        if (startYearNum > endYearNum) {
          this.dateError = "L'année de début ne peut pas être postérieure à l'année de fin.";
          return false;
        }

        if (endYearNum > currentYear) {
          this.dateError = "L'année de fin ne peut pas être supérieure à cette année.";
          return false;
        }

        if (startYearNum > currentYear) {
          this.dateError = "L'année de début ne peut pas être supérieure à cette année.";
          return false;
        }

        return true;

      default:
        return false;
    }

    if (startDate > endDate) {
      this.dateError = "La date de début ne peut pas être postérieure à la date de fin.";
      return false;
    }

    if (endDate > today) {
      let errorMessage = "La date de fin ne peut pas être supérieure à ";
      switch (this.periodicite) {
        case 'JOUR':
          errorMessage += "aujourd'hui.";
          break;
        case 'MOIS':
          errorMessage += "ce mois-ci.";
          break;
      }
      this.dateError = errorMessage;
      return false;
    }

    if (startDate > today) {
      let errorMessage = "La date de début ne peut pas être supérieure à ";
      switch (this.periodicite) {
        case 'JOUR':
          errorMessage += "aujourd'hui.";
          break;
        case 'MOIS':
          errorMessage += "ce mois-ci.";
          break;
      }
      this.dateError = errorMessage;
      return false;
    }

    return true;
  }

  onDateChange(): void {
    this.validateDates();
  }

  getRealisations() {
    // Logique différente selon le scope
    if (this.scope === 'UNITE') {
      this.getRealisationsByUnite();
    } else if (this.scope === 'DOUANE') {
      this.getRealisationsByDouane();
    }
  }

  getRealisationsByUnite() {
    if (!this.selectedUnite) {
      this.isData = false;
      this.pageData.data = [];
      this.pageData.page.totalPages = 0;
      this.totalPage = 0;
      return;
    }

    if (!this.validateDates()) {
      this.isData = false;
      this.pageData.data = [];
      this.pageData.page.totalPages = 0;
      this.totalPage = 0;
      return;
    }

    this.isLoading = true;
    this.isData = false;

    if(this.typeSituation==='MOMENT') {
      this.fin=this.debut;
    }

    this.realisationService.getRealisationByUnite(
        this.pageSelected,
        this.selectedUnite.uuid,
        this.periodicite,
        this.debut,
        this.fin
    ).subscribe({
      next: (pagedData:any) => {
        this.handleRealisationResponse(pagedData);
      },
      error: (err:any) => {
        this.handleRealisationError(err);
      }
    });
  }

  getRealisationsByDouane() {
    if (!this.validateDates()) {
      this.isData = false;
      this.pageData.data = [];
      this.pageData.page.totalPages = 0;
      this.totalPage = 0;
      return;
    }

    this.isLoading = true;
    this.isData = false;

    if(this.typeSituation==='MOMENT') {
      this.fin=this.debut;
    }

    // Appel pour toutes les recettes de la douane
    this.realisationService.getRealisationAll(
        this.pageSelected,
        this.periodicite,
        this.debut,
        this.fin
    ).subscribe({
      next: (pagedData:any) => {
        this.handleRealisationResponse(pagedData);
      },
      error: (err:any) => {
        this.handleRealisationError(err);
      }
    });
  }

  private handleRealisationResponse(pagedData: PagedData<Realisation>) {
    console.log(pagedData);
    this.pageData = pagedData;
    this.hasSearched = true; // Marquer qu'une recherche a été effectuée

    if (pagedData && pagedData.data && pagedData.data.length > 0) {
      this.isData = true;
    } else {
      this.isData = false;
      this.pageData.data = [];
    }
    this.pageNumber = this.pageData.page.pageNumber;
    this.size = this.pageData.page.size;
    this.totalPage = this.pageData.page.totalPages;
    this.tableauPage.length = this.pageData.page.totalPages;
    this.isLoading = false;
  }

  private handleRealisationError(err: any) {
    console.error("Error fetching realisations:", err);
    this.isLoading = false;
    this.isData = false;
    this.pageData.data = [];
    this.totalPage = 0;
    this.hasSearched = true; // Marquer qu'une recherche a été effectuée même en cas d'erreur
  }

  changeSize() {
    this.pageSelected.size = this.size;
    this.pageSelected.pageNumber = this.pageNumber;
    this.getRealisations();
  }

  prochainePage() {
    if (this.pageData.page.pageNumber < this.pageData.page.totalPages - 1) {
      this.pageNumber = this.pageNumber + 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;
      this.getRealisations();
    }
  }

  precedentPage() {
    if (this.pageData.page.pageNumber > 0) {
      this.pageNumber = this.pageNumber - 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;
      this.getRealisations();
    }
  }

  rechercherRealisation() {
    console.log('Type situation:', this.typeSituation);
    console.log('Scope:', this.scope);
    console.log('Périodicité:', this.periodicite);
    console.log('Début:', this.debut);
    console.log('Fin:', this.fin);
    console.log('Unité sélectionnée:', this.selectedUnite);

    this.pageSelected.pageNumber = 0;
    this.pageNumber = 0;
    this.getRealisations();
  }

  // Méthode pour filtrer les données sans les totaux
  getDataWithoutTotals(): Realisation[] {
    if (!this.pageData.data) {
      return [];
    }
    if (this.typeSituation === 'MOMENT') {
      // Exclure les deux derniers éléments (Total Mois et Total Année)
      return this.pageData.data.slice(0, -2);
    } else if (this.typeSituation === 'INTERVALLE') {
      // Exclure le dernier élément (Total Intervalle)
      return this.pageData.data.slice(0, -1);
    }
    return this.pageData.data;
  }

  print() {
    // Vérifier les conditions selon le scope
    const hasValidData = this.isData && this.debut && this.periodicite;
    const hasValidScope = (this.scope === 'DOUANE') || (this.scope === 'UNITE' && this.selectedUnite);
    const hasValidDates = (this.typeSituation === 'MOMENT') || (this.typeSituation === 'INTERVALLE' && this.fin);

    if (!hasValidData || !hasValidScope || !hasValidDates) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez d\'abord effectuer une recherche avec des paramètres valides.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isPrinting = true;

    if(this.scope === 'UNITE')
    {
      const printObservable = this.printService.printRealisationUnite(this.selectedUnite!.uuid, this.periodicite, this.debut, this.fin);
      printObservable.subscribe({
        next: (result:any) => {
          this.isPrinting = false;
          if (result && result.name) {
            const link = document.createElement('a');
            link.href = `assets/reports/${result.name}`;
            link.download = result.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Le rapport PDF a été généré avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la génération du rapport.',
              confirmButtonColor: '#d33'
            });
          }
        },
        error: (err:any) => {
          this.isPrinting = false;
          console.error("Erreur lors de l'impression:", err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la génération du rapport. Veuillez réessayer.',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
    else {
      if(this.typeSituation === 'MOMENT' && this.periodicite === 'JOUR')
      {
        let debutMois :string;
        debutMois = this.obtenirDebutMois(this.debut)
        const printObservable = this.printService.printSituationAuJour(debutMois, this.fin);
        printObservable.subscribe({
          next: (result:any) => {
            this.isPrinting = false;
            if (result && result.name) {
              const link = document.createElement('a');
              link.href = `assets/reports/${result.name}`;
              link.download = result.name;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Le rapport PDF a été généré avec succès.',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la génération du rapport.',
                confirmButtonColor: '#d33'
              });
            }
          },
          error: (err:any) => {
            this.isPrinting = false;
            console.error("Erreur lors de l'impression:", err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la génération du rapport. Veuillez réessayer.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
      else {
        const printObservable = this.printService.printRealisation(this.periodicite, this.debut, this.fin);
        printObservable.subscribe({
          next: (result:any) => {
            this.isPrinting = false;
            if (result && result.name) {
              const link = document.createElement('a');
              link.href = `assets/reports/${result.name}`;
              link.download = result.name;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Le rapport PDF a été généré avec succès.',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la génération du rapport.',
                confirmButtonColor: '#d33'
              });
            }
          },
          error: (err:any) => {
            this.isPrinting = false;
            console.error("Erreur lors de l'impression:", err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la génération du rapport. Veuillez réessayer.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    }

  }

  obtenirDebutMois(dateString: string): string {
    const [annee, mois] = dateString.split('-');
    return `${annee}-${mois}-01`;
  }

  exportToExcel() {
    if (!this.isData || !this.pageData.data || this.pageData.data.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Aucune donnée à exporter. Veuillez d\'abord effectuer une recherche.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isExporting = true;

    try {
      let exportData: any[] = [];

      // Filtrer les données à exporter selon typeSituation
      let dataToExport = this.pageData.data;
      if (this.typeSituation === 'MOMENT') {
        // Exclure les deux derniers éléments (Total Mois et Total Année)
        dataToExport = this.pageData.data.slice(0, -2);
      } else if (this.typeSituation === 'INTERVALLE') {
        // Exclure le dernier élément (Total Intervalle)
        dataToExport = this.pageData.data.slice(0, -1);
      }

      if (this.scope === 'UNITE') {
        exportData = dataToExport.map((item: any) => ({
          'Période': item.periode,
          'Produits Pétroliers': item.recettePP,
          'Produits Miniers': item.tme,
          'Autres Produits': item.recetteAP,
          'Total Réalisation': item.totalPPAPTMERER
        }));

        // Ajouter les totaux si présents
        if (this.typeSituation === 'MOMENT' && this.pageData.data.length >= 2) {
          exportData.push({
            'Période': 'Total Mois',
            'Produits Pétroliers': this.pageData.data[this.pageData.data.length - 2].recettePP,
            'Produits Miniers': this.pageData.data[this.pageData.data.length - 2].tme,
            'Autres Produits': this.pageData.data[this.pageData.data.length - 2].recetteAP,
            'Total Réalisation': this.pageData.data[this.pageData.data.length - 2].totalPPAPTMERER
          });
          exportData.push({
            'Période': 'Total Année',
            'Produits Pétroliers': this.pageData.data[this.pageData.data.length - 1].recettePP,
            'Produits Miniers': this.pageData.data[this.pageData.data.length - 1].tme,
            'Autres Produits': this.pageData.data[this.pageData.data.length - 1].recetteAP,
            'Total Réalisation': this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER
          });
        } else if (this.typeSituation === 'INTERVALLE' && this.pageData.data.length >= 1) {
          exportData.push({
            'Période': 'Total Intervalle',
            'Produits Pétroliers': this.pageData.data[this.pageData.data.length - 1].recettePP,
            'Produits Miniers': this.pageData.data[this.pageData.data.length - 1].tme,
            'Autres Produits': this.pageData.data[this.pageData.data.length - 1].recetteAP,
            'Total Réalisation': this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER
          });
        }
      } else if (this.scope === 'DOUANE') {
        exportData = dataToExport.map((item: any) => ({
          'Période': item.periode,
          'Recettes sur PP': item.recettePP,
          'Recettes sur AP': item.recetteAP,
          'Total Encaissé': item.totalPPAP,
          'Taxe Exportation DGD': item.tme,
          'Taxe Extraction DGI': item.tmx,
          'RER': item.rer,
          'Total des recettes Douanières': item.totalPPAPTMERER
        }));

        // Ajouter les totaux si présents
        if (this.typeSituation === 'MOMENT repartition' && this.pageData.data.length >= 2) {
          exportData.push({
            'Période': 'Total Mois',
            'Recettes sur PP': this.pageData.data[this.pageData.data.length - 2].recettePP,
            'Recettes sur AP': this.pageData.data[this.pageData.data.length - 2].recetteAP,
            'Total Encaissé': this.pageData.data[this.pageData.data.length - 2].totalPPAP,
            'Taxe Exportation DGD': this.pageData.data[this.pageData.data.length - 2].tme,
            'Taxe Extraction DGI': this.pageData.data[this.pageData.data.length - 2].tmx,
            'RER': this.pageData.data[this.pageData.data.length - 2].rer,
            'Total des recettes Douanières': this.pageData.data[this.pageData.data.length - 2].totalPPAPTMERER
          });
          exportData.push({
            'Période': 'Total Année',
            'Recettes sur PP': this.pageData.data[this.pageData.data.length - 1].recettePP,
            'Recettes sur AP': this.pageData.data[this.pageData.data.length - 1].recetteAP,
            'Total Encaissé': this.pageData.data[this.pageData.data.length - 1].totalPPAP,
            'Taxe Exportation DGD': this.pageData.data[this.pageData.data.length - 1].tme,
            'Taxe Extraction DGI': this.pageData.data[this.pageData.data.length - 1].tmx,
            'RER': this.pageData.data[this.pageData.data.length - 1].rer,
            'Total des recettes Douanières': this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER
          });
        } else if (this.typeSituation === 'INTERVALLE' && this.pageData.data.length >= 1) {
          exportData.push({
            'Période': 'Total Intervalle',
            'Recettes sur PP': this.pageData.data[this.pageData.data.length - 1].recettePP,
            'Recettes sur AP': this.pageData.data[this.pageData.data.length - 1].recetteAP,
            'Total Encaissé': this.pageData.data[this.pageData.data.length - 1].totalPPAP,
            'Taxe Exportation DGD': this.pageData.data[this.pageData.data.length - 1].tme,
            'Taxe Extraction DGI': this.pageData.data[this.pageData.data.length - 1].tmx,
            'RER': this.pageData.data[this.pageData.data.length - 1].rer,
            'Total des recettes Douanières': this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER
          });
        }
      }

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      // Ajuster les largeurs de colonnes selon le scope
      let colWidths: any[] = [];
      if (this.scope === 'UNITE') {
        colWidths = [
          { wch: 15 }, // Période
          { wch: 20 }, // Produits Pétroliers
          { wch: 18 }, // Produits Miniers
          { wch: 18 }, // Autres Produits
          { wch: 20 }  // Total Réalisation
        ];
      } else if (this.scope === 'DOUANE') {
        colWidths = [
          { wch: 15 }, // Période
          { wch: 18 }, // Recettes sur PP
          { wch: 18 }, // Recettes sur AP
          { wch: 18 }, // Total Encaissé
          { wch: 20 }, // Taxe Exportation DGD
          { wch: 20 }, // Taxe Extraction DGI
          { wch: 15 }, // RER
          { wch: 25 }  // Total des recettes Douanières
        ];
      }

      ws['!cols'] = colWidths;

      // Ajouter la feuille au classeur
      const sheetName = this.scope === 'UNITE' ? 'Réalisation Unité' : 'Recettes Douane';
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Générer le nom du fichier
      const fileName = this.generateExcelFileName();

      // Sauvegarder le fichier
      XLSX.writeFile(wb, fileName);

      this.isExporting = false;

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les données ont été exportées avec succès.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      this.isExporting = false;
      console.error('Erreur lors de l\'export Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'export Excel. Veuillez réessayer.',
        confirmButtonColor: '#d33'
      });
    }
  }

  private generateExcelFileName(): string {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');

    let fileName = '';
    if (this.scope === 'UNITE') {
      const uniteNom = this.selectedUnite?.nomUnite || 'Unite';
      fileName = `Realisation_${uniteNom}_${timestamp}.xlsx`;
    } else {
      fileName = `Recettes_Douane_${timestamp}.xlsx`;
    }

    return fileName;
  }

  // Méthode pour ouvrir le modal d'analyse
  async openAnalyseModal(content: any) {
    if (!this.isData || !this.pageData.data || this.pageData.data.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Aucune donnée à analyser. Veuillez d\'abord effectuer une recherche.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Réinitialiser l'état de l'analyse
    this.analysisResult = null;
    this.analysisError = null;
    this.isAnalysing = false;

    // Ouvrir le modal
    const modalRef = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Démarrer l'analyse après ouverture du modal
    setTimeout(() => {
      this.performAnalysis();
    }, 500);
  }

  private async performAnalysis() {
    if (!this.pageData.data || this.pageData.data.length === 0) {
      this.analysisError = 'Aucune donnée disponible pour l\'analyse.';
      return;
    }

    this.isAnalysing = true;
    this.analysisError = null;

    try {
      // Préparer les données pour l'analyse
      const analysisData = this.prepareAnalysisData();

    /**
      // Configuration de l'analyse
      const config: AnalysisConfig = {
        dataType: this.scope === 'UNITE' ? 'REALISATION_UNITE' : 'RECETTES_DOUANE',
        period: this.periodicite,
        dateStart: this.debut,
        dateEnd: this.fin || this.debut,
        situationType: this.typeSituation,
        uniteName: this.selectedUnite?.nomUnite || undefined
      };
     **/

      // Appeler le service d'analyse IA
      //const result = await this.aiAnalysisService.analyzeData(analysisData, config);
      //this.analysisResult = result;

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      this.analysisError = 'Erreur lors de l\'analyse des données. Veuillez réessayer.';
    } finally {
      this.isAnalysing = false;
    }
  }

  private prepareAnalysisData(): any[] {
    if (!this.pageData.data) return [];

    return this.pageData.data.map((item: any) => ({
      periode: item.periode,
      recettePP: item.recettePP || 0,
      recetteAP: item.recetteAP || 0,
      tme: item.tme || 0,
      tmx: item.tmx || 0,
      rer: item.rer || 0,
      totalPPAP: item.totalPPAP || 0,
      totalPPAPTMERER: item.totalPPAPTMERER || 0
    }));
  }

  // Méthode pour déterminer si on doit afficher le message d'invitation
  shouldShowWelcomeMessage(): boolean {
    return !this.isLoading && !this.isData && !this.hasSearched;
  }

  // Méthode pour déterminer si on doit afficher le message "Aucune réalisation trouvée"
  shouldShowNoDataMessage(): boolean {
    return !this.isLoading && !this.isData && this.isSearchComplete() && this.hasSearched;
  }

  // Méthode pour obtenir le message d'accueil personnalisé
  getWelcomeMessage(): string {
    return 'Veuillez sélectionner les critères de filtre et valider pour afficher les données.';
  }

  // Méthode pour obtenir le message "Aucune donnée"
  getNoDataMessage(): string {
    return 'Aucune réalisation trouvée pour la période et les filtres sélectionnés.';
  }

  // Méthode pour déterminer si on doit afficher la ligne de total
  shouldShowTotalRow(): boolean {
    return (this.isData && this.pageData.data && this.pageData.data.length > 0) ? true : false;
  }

  // Méthode pour obtenir les classes CSS de la ligne de total
  getTotalRowClasses(): string {
    return 'table-warning fw-bold';
  }

  // Méthodes pour calculer les totaux spécifiques au scope DOUANE
  getTotalEncaisse(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].totalPPAP || 0 : 0;
  }

  getTotalTaxeExportation(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].tme || 0 : 0;
  }

  getTotalTaxeExtraction(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].tmx || 0 : 0;
  }

  getTotalRecettesDouanieres(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER || 0 : 0;
  }

  // Méthodes pour calculer les totaux spécifiques au scope UNITE
  getTotalProduitsMiniers(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].tme || 0 : 0;
  }

  getTotalAutresProduits(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].recetteAP || 0 : 0;
  }

  getTotalRealisationUnite(): number {
    return this.pageData.data?.length ? this.pageData.data[this.pageData.data.length - 1].totalPPAPTMERER || 0 : 0;
  }

  // Méthode pour déterminer si on affiche le tableau UNITE
  isUniteScope(): boolean {
    return this.scope === 'UNITE';
  }

  // Méthode pour déterminer si on affiche le tableau DOUANE
  isDouaneScope(): boolean {
    return this.scope === 'DOUANE';
  }

  // Méthode pour formater les nombres avec séparateurs
  formatNumber(value: number): string {
    if (value === null || value === undefined) {
      return '0.00';
    }
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Méthode pour obtenir le titre du tableau selon le scope
  getTableTitle(): string {
    if (this.scope === 'UNITE') {
      return this.selectedUnite ? `Réalisation de l'unité : ${this.selectedUnite.nomUnite}` : 'Réalisation Unité';
    } else if (this.scope === 'DOUANE') {
      return 'Recettes de toute la Douane';
    }
    return 'Réalisations';
  }

  // Méthode pour obtenir les en-têtes du tableau selon le scope
  getTableHeaders(): string[] {
    if (this.scope === 'UNITE') {
      return [
        'Période',
        'Produits Pétroliers',
        'Produits Miniers',
        'Autres Produits',
        'Total Réalisation'
      ];
    } else if (this.scope === 'DOUANE') {
      return [
        'Période',
        'Recettes sur PP',
        'Recettes sur AP',
        'Total Encaissé',
        'Taxe Exportation DGD',
        'Taxe Extraction DGI',
        'RER',
        'Total des recettes Douanières'
      ];
    }
    return [];
  }

  // Méthode pour déterminer si les données sont valides pour l'affichage
  hasValidDataForDisplay(): boolean {
    return (this.pageData && this.pageData.data && this.pageData.data.length > 0) ? true : false;
  }

  // Méthode pour obtenir le nombre total d'éléments
  getTotalElements(): number {
    return this.pageData?.page?.totalElements || 0;
  }

  // Méthode pour déterminer si la pagination doit être affichée
  shouldShowPagination(): boolean {
    return this.hasValidDataForDisplay() && this.totalPage > 1;
  }

  // Méthode pour déterminer si les boutons d'action doivent être activés
  areActionButtonsEnabled(): boolean {
    return this.hasValidDataForDisplay() && !this.isLoading;
  }

  // Méthode pour obtenir le statut de la recherche
  getSearchStatus(): string {
    if (this.isLoading) {
      return 'Chargement en cours...';
    }
    if (this.hasSearched && !this.isData) {
      return 'Aucun résultat trouvé';
    }
    if (this.isData) {
      return `${this.getTotalElements()} résultat(s) trouvé(s)`;
    }
    return 'Prêt pour la recherche';
  }

  // Méthode pour valider l'état général du composant
  isComponentReady(): boolean {
    return !this.isLoading && this.unites.length > 0;
  }

  // Méthode pour réinitialiser complètement le composant
  resetComponent(): void {
    this.typeSituation = '';
    this.scope = '';
    this.periodicite = '';
    this.debut = '';
    this.fin = '';
    this.selectedUnite = null;
    this.uniteSearch = '';
    this.dateError = null;
    this.resetData();
    this.pageNumber = 0;
    this.pageSelected.pageNumber = 0;
  }

  // Méthode pour obtenir un résumé des filtres appliqués
  getFilterSummary(): string {
    if (!this.hasSearched) {
      return '';
    }

    const parts: string[] = [];

    if (this.typeSituation) {
      parts.push(`Type: ${this.typeSituation === 'MOMENT' ? 'À un moment donné' : 'Entre deux dates'}`);
    }

    if (this.scope) {
      parts.push(`Scope: ${this.scope === 'UNITE' ? 'Réalisation d\'une unité' : 'Recettes de toute la Douane'}`);
    }

    if (this.periodicite) {
      const periodiciteLabels = {
        'JOUR': 'Par jour',
        'MOIS': 'Par mois',
        'ANNEE': 'Par année'
      };
      parts.push(`Période: ${periodiciteLabels[this.periodicite as keyof typeof periodiciteLabels]}`);
    }

    if (this.selectedUnite && this.scope === 'UNITE') {
      parts.push(`Unité: ${this.selectedUnite.nomUnite}`);
    }

    if (this.debut) {
      parts.push(`Du: ${this.debut}`);
    }

    if (this.fin && this.typeSituation === 'INTERVALLE') {
      parts.push(`Au: ${this.fin}`);
    }

    return parts.join(' | ');
  }
}







