import {Component, Pipe, PipeTransform} from '@angular/core';
import {Realisation} from "../../../models/Realisation";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {Unite} from "../../../models/Unite";
import {AiAnalysisService, AnalysisConfig} from "../../../services/ai-analysis.service";
import {RealisationService} from "../../../services/realisation.service";
import {UniteService} from "../../../services/unite.service";
import {PrintService} from "../../../services/print.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-realisation-cumul',
  templateUrl: './realisation-cumul.component.html',
  styleUrl: './realisation-cumul.component.scss'
})
export class RealisationCumulComponent {
  realisations: Realisation[] | undefined = [];
  key: string = "";
  pageData: PagedData<Realisation> = new PagedData<Realisation>();
  pageNumber: number = 0;
  size: number = 10;
  pageSelected: Page = new Page();
  unite: Unite = new Unite();
  unites: Unite[] = [];

  breadCrumbItems!: Array<{}>;

  totalPage: number = 1;
  tableauPage = new Array();
  outerRealisation!: Realisation;
  debut: string = "";
  fin: string = ""; // Maintenu mais toujours égal à debut
  periodicite: string = "JOUR";
  isData: boolean = false;

  // Properties for loading spinner and date validation
  isLoading: boolean = false;
  dateError: string | null = null;
  isPrinting: boolean = false;
  isExporting: boolean = false;

  // Properties for AI Analysis
  isAnalysing: boolean = false;
  analysisResult: string | null = null;
  analysisError: string | null = null;

  // Variable pour définir l'année de limitation minimum
  private readonly MIN_YEAR: number = 2020;

  constructor(
      private realisationService: RealisationService,
      private uniteService: UniteService,
      private printService: PrintService,
      private modalService: NgbModal,
      private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Direction Generale de Douanes', active: true }
    ];
    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;
    this.pageData.page = this.pageSelected;
    this.pageData.data = new Array();
  }

  // Méthode pour gérer le changement de périodicité
  onPeriodiciteChange(): void {
    this.debut = "";
    this.fin = "";
    this.dateError = null;
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
    switch (this.periodicite) {
      case 'JOUR':
        return 'Sélectionner une date';
      case 'MOIS':
        return 'Sélectionner un mois';
      case 'ANNEE':
        return 'Sélectionner une année';
      default:
        return 'Sélectionner une date';
    }
  }

  // Méthode pour obtenir la date maximum (aujourd'hui)
  getMaxDate(): string {
    const today = new Date();
    switch (this.periodicite) {
      case 'JOUR':
        return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      case 'MOIS':
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // Format YYYY-MM
      case 'ANNEE':
        return today.getFullYear().toString();
      default:
        return today.toISOString().split('T')[0];
    }
  }

  // Méthode pour obtenir la liste des années disponibles (à partir de MIN_YEAR)
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];

    for (let year = this.MIN_YEAR; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  }

  // Méthode pour obtenir les années disponibles pour le champ fin (maintenue pour compatibilité)
  getYearOptionsForEnd(): number[] {
    return this.getYearOptions();
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

  validateDates(): boolean {
    this.dateError = null;

    if (!this.debut) {
      return true; // Ne pas valider si le champ est vide
    }

    let selectedDate: Date;
    let today = new Date();

    switch (this.periodicite) {
      case 'JOUR':
        selectedDate = new Date(this.debut);
        today.setHours(23, 59, 59, 999); // Fin de journée pour comparaison

        // Vérifier que la date ne dépasse pas aujourd'hui
        if (selectedDate > today) {
          this.dateError = "La date ne peut pas être supérieure à aujourd'hui.";
          return false;
        }
        break;

      case 'MOIS':
        // Pour les mois, on prend le premier jour du mois
        const [selectedYear, selectedMonth] = this.debut.split('-').map(Number);
        selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
        // Pour today, on prend le premier du mois courant
        today = new Date(today.getFullYear(), today.getMonth(), 1);

        if (selectedDate > today) {
          this.dateError = "Le mois ne peut pas être supérieur à ce mois-ci.";
          return false;
        }
        break;

      case 'ANNEE':
        const selectedYearNum = parseInt(this.debut);
        const currentYear = new Date().getFullYear();

        // Vérifier que l'année est valide
        if (selectedYearNum < this.MIN_YEAR) {
          this.dateError = `L'année ne peut pas être antérieure à ${this.MIN_YEAR}.`;
          return false;
        }

        // Vérifier que l'année ne dépasse pas l'année courante
        if (selectedYearNum > currentYear) {
          this.dateError = "L'année ne peut pas être supérieure à cette année.";
          return false;
        }
        break;

      default:
        return false;
    }

    return true;
  }

  onDateChange(): void {
    // Synchroniser fin avec debut
    this.fin = this.debut;
    this.validateDates();
  }

  getRealisations() {
    if (!this.validateDates()) {
      this.isData = false;
      this.pageData.data = [];
      this.pageData.page.totalPages = 0;
      this.totalPage = 0;
      return;
    }

    if(this.periodicite == "JOUR") {
      this.fin = this.debut;
      const dateDebut = new Date(this.debut);
      this.debut = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), 1).toISOString().split('T')[0];
    }
    else if(this.periodicite == "MOIS") {
      this.fin = this.debut;
      const dateDebut = new Date(this.debut);
      this.debut = new Date(dateDebut.getFullYear(), 0, 1).toISOString().split('T')[0].substring(0, 7);
    }
    else if(this.periodicite == "ANNEE") {
      this.fin = this.debut;
    }

    this.isLoading = true;
    this.isData = false;
    console.log(this.pageSelected);

    this.realisationService.getRealisationCumul(
        this.pageSelected,
        this.periodicite,
        this.debut,
        this.fin
    ).subscribe({
      next: (pagedData: any) => {
        console.log(pagedData);
        this.pageData = pagedData;
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
      },
      error: (err: any) => {
        console.error("Error fetching realisations:", err);
        this.isLoading = false;
        this.isData = false;
        this.pageData.data = [];
        this.totalPage = 0;
      }
    });
  }

  changeSize() {
    this.pageSelected.size = this.size;
    this.pageSelected.pageNumber = this.pageNumber;
    console.log(this.pageSelected);
    this.getRealisations();
  }

  prochainePage() {
    if (this.pageData.page.pageNumber < this.pageData.page.totalPages - 1) {
      this.pageNumber = this.pageNumber + 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;
      console.log(this.pageSelected);
      this.getRealisations();
    }
  }

  precedentPage() {
    if (this.pageData.page.pageNumber > 0) {
      this.pageNumber = this.pageNumber - 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;
      console.log(this.pageSelected);
      this.getRealisations();
    }
  }

  rechercherRealisation() {
    console.log(this.periodicite);
    console.log(this.debut);
    console.log(this.fin);

    // S'assurer que fin est égal à debut
    this.fin = this.debut;

    this.pageSelected.pageNumber = 0;
    this.pageNumber = 0;
    this.getRealisations();
  }

  // Méthode print qui télécharge directement le PDF
  print() {
    // Vérifier qu'il y a des données à imprimer
    if (!this.isData || !this.debut) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez d\'abord effectuer une recherche avec une date valide.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isPrinting = true;

    // S'assurer que fin est égal à debut
    this.fin = this.debut;

    this.printService.printRealisation(this.periodicite, this.debut, this.fin).subscribe({
      next: (result: any) => {
        this.isPrinting = false;
        if (result && result.name) {
          // Créer un lien de téléchargement et le déclencher automatiquement
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
      error: (err: any) => {
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

  // Méthode pour exporter en Excel
  exportToExcel() {
    // Vérifier qu'il y a des données à exporter
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
      // Préparer les données pour l'exportation
      const exportData = this.pageData.data.map(item => ({
        'Période': item.periode,
        'Recettes sur PP': item.recettePP,
        'Recettes sur AP': item.recetteAP,
        'Total Encaissé': item.totalPPAP,
        'Taxe Exportation DGD': item.tme,
        'Taxe Extraction DGI': item.tmx,
        'RER': item.rer,
        'Total des recettes Douanières': item.totalPPAPTMERER
      }));

      // Créer le workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      // Définir la largeur des colonnes
      const colWidths = [
        { wch: 15 }, // Période
        { wch: 15 }, // Recettes sur PP
        { wch: 15 }, // Recettes sur AP
        { wch: 15 }, // Total Encaissé
        { wch: 20 }, // Taxe Exportation DGD
        { wch: 20 }, // Taxe Extraction DGI
        { wch: 10 }, // RER
        { wch: 25 }  // Total des recettes Douanières
      ];
      ws['!cols'] = colWidths;

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Réalisations');

      // Générer le nom du fichier
      const fileName = `DGD_${this.periodicite}_${this.debut}.xlsx`;

      // Sauvegarder le fichier
      XLSX.writeFile(wb, fileName);

      this.isExporting = false;

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les données ont été exportées avec succès vers Excel.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      this.isExporting = false;
      console.error('Erreur lors de l\'exportation Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'exportation Excel. Veuillez réessayer.',
        confirmButtonColor: '#d33'
      });
    }
  }

  // Méthode pour ouvrir le modal d'analyse
  openAnalyseModal(content: any) {
    this.analysisResult = null;
    this.analysisError = null;

    if (!this.isData || !this.pageData.data || this.pageData.data.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Aucune donnée à analyser. Veuillez d\'abord effectuer une recherche.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isAnalysing = true;
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });

    // Configuration pour l'analyse
    const analysisConfig: AnalysisConfig = {
      provider: 'openai', // Ou 'openai', 'google', 'anthropic', 'cohere', 'ollama'
      // apiKey: 'YOUR_API_KEY_HERE', // Seulement si vous n'utilisez pas les variables d'environnement
      // model: 'mistralai/Mistral-7B-Instruct-v0.3' // Spécifier le modèle si nécessaire
    };

    // S'assurer que fin est égal à debut
    this.fin = this.debut;

    // Utiliser le service d'analyse
    this.aiAnalysisService.analyzeRealisationData(
        {
          data: this.pageData.data,
          unite: new Unite(),
          periode: this.periodicite,
          debut: this.debut,
          fin: this.fin
        },
        analysisConfig
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







