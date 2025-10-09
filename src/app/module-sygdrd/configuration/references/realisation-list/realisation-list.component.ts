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
  selector: 'app-realisation-list',
  templateUrl: './realisation-list.component.html',
  styleUrl: './realisation-list.component.scss'
})
export class RealisationListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  realisations: Realisation[] | undefined = [];
  key: string ="" ;
  pageData : PagedData<Realisation> = new PagedData<Realisation>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();
  unite : Unite = new Unite();
  unites : Unite[] = [];

  // Nouvelles propriétés pour l'autocomplétition
  selectedUnite: Unite | null = null;
  uniteSearch: string = '';
  filteredUnites: Unite[] = [];
  showUniteDropdown: boolean = false;

  filterRealisation : Realisation[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerRealisation !: Realisation;
  debut: string ="";
  fin: string ="";
  periodicite: string ="";
  isData: boolean = false;

  // New properties for loading spinner and date validation
  isLoading: boolean = false;
  dateError: string | null = null;
  isPrinting: boolean = false;
  isExporting: boolean = false; // Ajout pour gérer l'état d'exportation Excel

  // New properties for AI Analysis
  isAnalysing: boolean = false;
  analysisResult: string | null = null;
  analysisError: string | null = null;
  private aiAnalysisService: AiAnalysisService; // Placeholder for AI service

  // Variable pour définir l'année de limitation minimum
  private readonly MIN_YEAR: number = 2020;

  constructor(
      private realisationService: RealisationService,
      private uniteService: UniteService,
      private printService: PrintService, // Ajout du service d'impression
      private modalService: NgbModal, // Service NgbModal pour les modales
      private actualAiAnalysisService: AiAnalysisService // Inject the actual service
  ) {
    this.aiAnalysisService = actualAiAnalysisService; // Assign the injected service
  }


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: this.selectedUnite?.nomUnite, active: true }
    ];
    this.uniteService.getAllUnite().subscribe(response => { // Changed 'unites' to 'response' to avoid conflict
      if (response && response.data) {
        this.unites = response.data;
        this.filteredUnites = [...response.data]; // Initialiser avec toutes les unités
      } else {
        this.unites = [];
        this.filteredUnites = [];
      }
    });
    this.pageSelected.pageNumber=this.pageNumber;
    this.pageSelected.size=this.size;
    this.pageData.page=this.pageSelected;
    this.pageData.data = new Array();
  }

  // Méthodes pour la gestion de l'autocomplétition des unités
  onUniteSearchChange(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.uniteSearch = searchTerm;

    if (searchTerm.trim() === '') {
      this.filteredUnites = [...this.unites]; //
      this.selectedUnite = null;
    } else {
      this.filteredUnites = this.unites.filter(unite =>
          unite.nomUnite.toLowerCase().includes(searchTerm) ||
          unite.codeUnite.toLowerCase().includes(searchTerm) ||
          unite.typeUnite.toLowerCase().includes(searchTerm)
      ); //

    }
    this.showUniteDropdown = true; //
  }

  selectUnite(unite: Unite): void {
    this.breadCrumbItems = [
      { label: unite?.nomUnite, active: true }
    ];
    this.selectedUnite = unite; //
    this.uniteSearch = unite.nomUnite; //
    this.unite = unite; // Maintenir la compatibilité avec le code existant //
    this.showUniteDropdown = false; //

    // Réinitialiser les données quand on change d'unité
    this.isData = false; //
    this.pageData.data = []; //
    this.totalPage = 0; //
  }

  onUniteBlur(): void {
    // Petit délai pour permettre la sélection d'un élément
    setTimeout(() => {
      this.showUniteDropdown = false; //

      // Si aucune unité n'est sélectionnée et que le champ est vide, réinitialiser
      if (!this.selectedUnite && this.uniteSearch.trim() === '') {
        this.filteredUnites = [...this.unites]; //
      }

      // Si le texte ne correspond à aucune unité sélectionnée, réinitialiser
      if (this.selectedUnite && this.uniteSearch !== this.selectedUnite.nomUnite) {
        this.selectedUnite = null; //
        this.unite = new Unite(); //
      }
    }, 200); //
  }

  // Nouvelle méthode pour gérer le changement de périodicité
  onPeriodiciteChange(): void {
    // Réinitialiser les dates lors du changement de périodicité
    this.debut = ""; //
    this.fin = ""; //
    this.dateError = null; //
  }

  // Méthode pour déterminer le type d'input selon la périodicité
  getInputType(): string {
    switch (this.periodicite) {
      case 'JOUR':
        return 'date'; //
      case 'MOIS':
        return 'month'; //
      case 'ANNEE':
        return 'number'; //
      default:
        return 'date'; //
    }
  }

  // Méthode pour obtenir le placeholder approprié
  getPlaceholder(type: 'debut' | 'fin'): string {
    const prefix = type === 'debut' ? 'Date de début' : 'Date de fin'; //
    switch (this.periodicite) {
      case 'JOUR':
        return `${prefix} (jour)`; //
      case 'MOIS':
        return `${prefix} (mois)`; //
      case 'ANNEE':
        return `${prefix} (année)`; //
      default:
        return prefix; //
    }
  }

  // Méthode pour obtenir la date maximum (aujourd'hui)
  getMaxDate(): string {
    const today = new Date(); //
    switch (this.periodicite) {
      case 'JOUR':
        return today.toISOString().split('T')[0]; // Format YEAR-MM-DD //
      case 'MOIS':
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // Format YEAR-MM //
      case 'ANNEE':
        return today.getFullYear().toString(); //
      default:
        return today.toISOString().split('T')[0]; //
    }
  }

  // Méthode pour obtenir la liste des années disponibles (à partir de MIN_YEAR)
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear(); //
    const years: number[] = []; //

    for (let year = this.MIN_YEAR; year <= currentYear; year++) {
      years.push(year); //
    }

    return years; //
  }

  // Méthode pour obtenir les années disponibles pour le champ fin (à partir de l'année de début ou MIN_YEAR)
  getYearOptionsForEnd(): number[] {
    const currentYear = new Date().getFullYear(); //
    const startYear = this.debut ? parseInt(this.debut) : this.MIN_YEAR; //
    const minYear = Math.max(startYear, this.MIN_YEAR); //
    const years: number[] = []; //

    for (let year = minYear; year <= currentYear; year++) {
      years.push(year); //
    }

    return years; //
  }

  // Méthode pour obtenir la date minimum (utilise MIN_YEAR)
  getMinDate(): string {
    switch (this.periodicite) {
      case 'JOUR':
        return `${this.MIN_YEAR}-01-01`; //
      case 'MOIS':
        return `${this.MIN_YEAR}-01`; //
      case 'ANNEE':
        return this.MIN_YEAR.toString(); //
      default:
        return `${this.MIN_YEAR}-01-01`; //
    }
  }

  validateDates(): boolean {
    this.dateError = null; //

    if (!this.debut || !this.fin) {
      return true; // Ne pas valider si les champs sont vides //
    }

    let startDate: Date; //
    let endDate: Date; //
    let today = new Date(); //

    switch (this.periodicite) {
      case 'JOUR':
        startDate = new Date(this.debut); //
        endDate = new Date(this.fin); //
        today.setHours(23, 59, 59, 999); // Fin de journée pour comparaison //
        break;

      case 'MOIS':
        // Pour les mois, on prend le premier jour du mois
        const [startYear, startMonth] = this.debut.split('-').map(Number); //
        const [endYear, endMonth] = this.fin.split('-').map(Number); //
        startDate = new Date(startYear, startMonth - 1, 1); //
        endDate = new Date(endYear, endMonth - 1, 1); //
        // Pour today, on prend le premier du mois courant
        today = new Date(today.getFullYear(), today.getMonth(), 1); //
        break;

      case 'ANNEE':
        const startYearNum = parseInt(this.debut); //
        const endYearNum = parseInt(this.fin); //
        const currentYear = new Date().getFullYear(); //

        // Vérifier que les années sont valides (utilise MIN_YEAR)
        if (startYearNum < this.MIN_YEAR) {
          this.dateError = `L'année de début ne peut pas être antérieure à ${this.MIN_YEAR}.`; //
          return false; //
        }

        if (endYearNum < this.MIN_YEAR) {
          this.dateError = `L'année de fin ne peut pas être antérieure à ${this.MIN_YEAR}.`; //
          return false; //
        }

        // Vérifier que la date de début n'est pas postérieure à la date de fin
        if (startYearNum > endYearNum) {
          this.dateError = "L'année de début ne peut pas être postérieure à l'année de fin."; //
          return false; //
        }

        // Vérifier que les années ne dépassent pas l'année courante
        if (endYearNum > currentYear) {
          this.dateError = "L'année de fin ne peut pas être supérieure à cette année."; //
          return false; //
        }

        if (startYearNum > currentYear) {
          this.dateError = "L'année de début ne peut pas être supérieure à cette année."; //
          return false; //
        }

        return true; // Validation réussie pour les années //

      default:
        return false; //
    }

    // Vérifier que la date de début n'est pas postérieure à la date de fin
    if (startDate > endDate) {
      this.dateError = "La date de début ne peut pas être postérieure à la date de fin."; //
      return false; //
    }

    // Vérifier que les dates ne dépassent pas aujourd'hui
    if (endDate > today) {
      let errorMessage = "La date de fin ne peut pas être supérieure à "; //
      switch (this.periodicite) {
        case 'JOUR':
          errorMessage += "aujourd'hui."; //
          break;
        case 'MOIS':
          errorMessage += "ce mois-ci."; //
          break;
      }
      this.dateError = errorMessage; //
      return false; //
    }

    if (startDate > today) {
      let errorMessage = "La date de début ne peut pas être supérieure à "; //
      switch (this.periodicite) {
        case 'JOUR':
          errorMessage += "aujourd'hui."; //
          break;
        case 'MOIS':
          errorMessage += "ce mois-ci."; //
          break;
      }
      this.dateError = errorMessage; //
      return false; //
    }

    return true; //
  }

  onDateChange(): void {
    this.validateDates(); //
  }

  getRealisations(){
    // Vérifier qu'une unité est sélectionnée
    if (!this.selectedUnite) {
      this.isData = false; //
      this.pageData.data = []; //
      this.pageData.page.totalPages = 0; //
      this.totalPage = 0; //
      return; //
    }

    if (!this.validateDates()) {
      this.isData = false; //
      this.pageData.data = []; //
      this.pageData.page.totalPages = 0; //
      this.totalPage = 0; //
      return; //
    }

    this.isLoading = true; //
    this.isData = false; //
    console.log(this.pageSelected); //
    this.realisationService.getRealisationByUnite(this.pageSelected,this.selectedUnite.uuid,this.periodicite,this.debut,this.fin ).subscribe({
      next: (pagedData: any) => {
        console.log(pagedData); //
        this.pageData = pagedData; //
        if(pagedData && pagedData.data && pagedData.data.length > 0){
          this.isData = true; //
        } else {
          this.isData = false; //
          this.pageData.data = []; //
        }
        this.pageNumber = this.pageData.page.pageNumber; //
        this.size = this.pageData.page.size; //
        this.totalPage = this.pageData.page.totalPages; //
        this.tableauPage.length = this.pageData.page.totalPages; //
        this.isLoading = false; //
      },
      error: (err: any) => {
        console.error("Error fetching realisations:", err); //
        this.isLoading = false; //
        this.isData = false; //
        this.pageData.data = []; //
        this.totalPage = 0; //
      }
    });
  }

  changeSize() {
    this.pageSelected.size = this.size; //
    this.pageSelected.pageNumber = this.pageNumber; //
    console.log(this.pageSelected); //
    this.getRealisations(); //
  }

  prochainePage() {
    if(this.pageData.page.pageNumber < this.pageData.page.totalPages - 1){
      this.pageNumber = this.pageNumber + 1; //
      this.pageSelected.pageNumber = this.pageNumber; //
      this.pageSelected.size = this.size; //
      console.log(this.pageSelected); //
      this.getRealisations(); //
    }
  }

  precedentPage(){
    if(this.pageData.page.pageNumber > 0) {
      this.pageNumber = this.pageNumber - 1; //
      this.pageSelected.pageNumber = this.pageNumber; //
      this.pageSelected.size = this.size; //
      console.log(this.pageSelected); //
      this.getRealisations(); //
    }
  }

  rechercherRealisation()  {
    console.log(this.periodicite); //
    console.log(this.debut); //
    console.log(this.fin); //
    console.log('Unité sélectionnée:', this.selectedUnite); //
    this.pageSelected.pageNumber = 0; //
    this.pageNumber = 0; //
    this.getRealisations(); //
  }

  // Nouvelle méthode print qui télécharge directement le PDF
  print()  {
    // Vérifier qu'il y a des données à imprimer et qu'une unité est sélectionnée
    if (!this.isData || !this.debut || !this.fin || !this.selectedUnite) {
      Swal.fire({ //
        icon: 'warning', //
        title: 'Attention', //
        text: 'Veuillez d\'abord sélectionner une unité et effectuer une recherche avec des dates valides.', //
        confirmButtonColor: '#3085d6' //
      });
      return; //
    }

    this.isPrinting = true; //

    this.printService.printRealisationUnite(this.selectedUnite.uuid, this.periodicite, this.debut, this.fin).subscribe({
      next: (result: any) => {
        this.isPrinting = false; //
        if (result && result.name) {
          // Créer un lien de téléchargement et le déclencher automatiquement
          const link = document.createElement('a'); //
          link.href = `assets/reports/${result.name}`; //
          link.download = result.name; //
          link.target = '_blank'; //
          document.body.appendChild(link); //
          link.click(); //
          document.body.removeChild(link); //

          Swal.fire({ //
            icon: 'success', //
            title: 'Succès', //
            text: 'Le rapport PDF a été généré avec succès.', //
            timer: 2000, //
            showConfirmButton: false //
          });
        } else {
          Swal.fire({ //
            icon: 'error', //
            title: 'Erreur', //
            text: 'Erreur lors de la génération du rapport.', //
            confirmButtonColor: '#d33' //
          });
        }
      },
      error: (err: any) => {
        this.isPrinting = false; //
        console.error("Erreur lors de l'impression:", err); //
        Swal.fire({ //
          icon: 'error', //
          title: 'Erreur', //
          text: 'Erreur lors de la génération du rapport. Veuillez réessayer.', //
          confirmButtonColor: '#d33' //
        });
      }
    });
  }

  // Nouvelle méthode pour exporter en Excel
  exportToExcel() {
    // Vérifier qu'il y a des données à exporter
    if (!this.isData || !this.pageData.data || this.pageData.data.length === 0) {
      Swal.fire({ //
        icon: 'warning', //
        title: 'Attention', //
        text: 'Aucune donnée à exporter. Veuillez d\'abord effectuer une recherche.', //
        confirmButtonColor: '#3085d6' //
      });
      return; //
    }

    this.isExporting = true; //

    try {
      // Préparer les données pour l'exportation
      const exportData = this.pageData.data.map(item => ({ //
        'Période': item.periode, //
        'Recettes sur PP': item.recettePP, //
        'Recettes sur AP': item.recetteAP, //
        'Total Encaissé': item.totalPPAP, //
        'Taxe Exportation DGD': item.tme, //
        'Taxe Extraction DGI': item.tmx, //
        'RER': item.rer, //
        'Total des recettes Douanières': item.totalPPAPTMERER //
      }));

      // Créer le workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new(); //
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData); //

      // Définir la largeur des colonnes
      const colWidths = [ //
        { wch: 15 }, // Période //
        { wch: 15 }, // Recettes sur PP //
        { wch: 15 }, // Recettes sur AP //
        { wch: 15 }, // Total Encaissé //
        { wch: 20 }, // Taxe Exportation DGD //
        { wch: 20 }, // Taxe Extraction DGI //
        { wch: 10 }, // RER //
        { wch: 25 }  // Total des recettes Douanières //
      ];
      ws['!cols'] = colWidths; //

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Réalisations'); //

      // Générer le nom du fichier avec l'unité sélectionnée
      const fileName = `Realisations_${this.selectedUnite?.codeUnite || 'Unite'}_${this.periodicite}_${this.debut}_${this.fin}.xlsx`; //

      // Sauvegarder le fichier
      XLSX.writeFile(wb, fileName); //

      this.isExporting = false; //

      Swal.fire({ //
        icon: 'success', //
        title: 'Succès', //
        text: 'Les données ont été exportées avec succès vers Excel.', //
        timer: 2000, //
        showConfirmButton: false //
      });

    } catch (error) {
      this.isExporting = false; //
      console.error('Erreur lors de l\'exportation Excel:', error); //
      Swal.fire({ //
        icon: 'error', //
        title: 'Erreur', //
        text: 'Erreur lors de l\'exportation Excel. Veuillez réessayer.', //
        confirmButtonColor: '#d33' //
      });
    }
  }


  // Nouvelle méthode pour ouvrir le modal d'analyse
  openAnalyseModal(content: any) {
    this.analysisResult = null;
    this.analysisError = null;

    if (!this.isData || !this.pageData.data || this.pageData.data.length === 0 || !this.selectedUnite) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Aucune donnée à analyser. Veuillez d\'abord effectuer une recherche avec une unité sélectionnée.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isAnalysing = true;
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });

    // Define the analysis configuration if you want to override defaults or specify keys
    const analysisConfig: AnalysisConfig = {
      provider: 'openai', // Or 'openai', 'google', 'anthropic', 'cohere', 'ollama'
      // apiKey: 'YOUR_API_KEY_HERE', // Only if not using environment variables
      // model: 'mistralai/Mistral-7B-Instruct-v0.3' // Specify model if needed
    };

    // Utiliser le service d'analyse
    this.aiAnalysisService.analyzeRealisationData( // Call the actual service method
        {
          data: this.pageData.data,
          unite: this.selectedUnite,
          periode: this.periodicite,
          debut: this.debut,
          fin: this.fin
        },
        analysisConfig // Pass the configuration
    ).subscribe({
      next: (result: any) => {
        console.log(result);
        this.analysisResult = result;
        this.isAnalysing = false;
      },
      error: (err: any) => {
        console.error("Erreur lors de l'analyse:", err);
        this.analysisError = err.message || 'Une erreur est survenue lors de la génération de l\'analyse.';
        this.isAnalysing = false;
      }
    });
  }
}







