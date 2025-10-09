import {Component, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
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

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-realisation-en-date',
  templateUrl: './realisation-en-date.component.html',
  styleUrl: './realisation-en-date.component.scss'
})

export class RealisationEnDateComponent {
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
  periodicite: string = "JOUR"; // Fixé à JOUR par défaut
  isData: boolean = false;

  // Properties for loading spinner and date validation
  isLoading: boolean = false;
  dateError: string | null = null;
  isPrinting: boolean = false;
  isExporting: boolean = false;
  isDebutReadonly: boolean = true; // Nouvelle propriété pour contrôler la lecture seule

  // Properties for AI Analysis
  isAnalysing: boolean = false;
  analysisResult: string | null = null;
  analysisError: string | null = null;
  recetteTitle: string = "";

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
    // Formater la date actuelle en yyyy-mm-dd
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format yyyy-mm-dd
    this.recetteTitle = "SITUATION DU : " + formattedDate;

    // Initialiser la date à hier (j-1) pour la périodicité JOUR
    this.initializeYesterdayDate();

    this.breadCrumbItems = [
      { label: 'Direction Generale de Douanes', active: true }
    ];

    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;
    this.pageData.page = this.pageSelected;
    this.pageData.data = new Array();
  }

  // Nouvelle méthode pour initialiser la date à hier (spécifique pour JOUR)
  private initializeYesterdayDate(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Reculer d'un jour

    // Comme la périodicité est fixée à JOUR, on utilise toujours le format date
    this.debut = yesterday.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Synchroniser fin avec debut
    this.fin = this.debut;
  }

  // Supprimer la méthode onPeriodiciteChange() car plus nécessaire

  // Méthode pour déterminer le type d'input (toujours 'date' maintenant)
  getInputType(): string {
    return 'date'; // Toujours date car periodicite est fixée à JOUR
  }

  // Méthode pour obtenir le placeholder approprié (toujours pour date)
  getPlaceholder(type: 'debut' | 'fin'): string {
    return 'Sélectionner une date';
  }

  // Méthode pour obtenir la date maximum (aujourd'hui)
  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  // Méthode pour obtenir la date minimum
  getMinDate(): string {
    return `${this.MIN_YEAR}-01-01`;
  }

  validateDates(): boolean {
    this.dateError = null;

    if (!this.debut) {
      return true; // Ne pas valider si le champ est vide
    }

    let selectedDate = new Date(this.debut);
    let today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de journée pour comparaison

    // Vérifier que la date ne dépasse pas aujourd'hui
    if (selectedDate > today) {
      this.dateError = "La date ne peut pas être supérieure à aujourd'hui.";
      return false;
    }

    // Vérifier que la date n'est pas antérieure à MIN_YEAR
    const minDate = new Date(`${this.MIN_YEAR}-01-01`);
    if (selectedDate < minDate) {
      this.dateError = `La date ne peut pas être antérieure au ${this.MIN_YEAR}.`;
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

    // Pour JOUR, ajuster la logique selon vos besoins
    // Si vous voulez garder la logique du début du mois:
    const dateDebut = new Date(this.debut);
    const debutMois = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), 1).toISOString().split('T')[0];

    this.isLoading = true;
    this.isData = false;
    console.log(this.pageSelected);

    this.realisationService.getRealisationCumul(
        this.pageSelected,
        this.periodicite, // Toujours "JOUR"
        debutMois, // Début du mois de la date sélectionnée
        this.debut // Date sélectionnée
    ).subscribe({
      next: (pagedData: any) => {
        console.log(pagedData);
        this.pageData = pagedData;
        //enDate = this.pageData.data?.at(0);
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

  // Nouvelle méthode pour permettre de modifier manuellement la date si nécessaire
  toggleDebutReadonly(): void {
    this.isDebutReadonly = !this.isDebutReadonly;
  }

  // Méthode pour réinitialiser à la date d'hier
  resetToYesterday(): void {
    this.initializeYesterdayDate();
    this.validateDates();
  }

  // Le reste des méthodes reste inchangé...
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








