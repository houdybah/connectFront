import { Component } from '@angular/core';
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {Unite} from "../../../models/Unite";
import {UniteService} from "../../../services/unite.service";
import {PrintService} from "../../../services/print.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AiAnalysisService, AnalysisConfig} from "../../../services/ai-analysis.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {ComptantCredit} from "../../../models/comptant-credit";
import {RealisationService} from "../../../services/realisation.service";

@Component({
  selector: 'app-credit-comptant',
  templateUrl: './credit-comptant.component.html',
  styleUrl: './credit-comptant.component.scss'
})
export class CreditComptantComponent {
  comptantCredits: ComptantCredit[] | undefined = [];
  key: string = "";
  pageData: PagedData<ComptantCredit> = new PagedData<ComptantCredit>();
  pageNumber: number = 0;
  size: number = 10;
  pageSelected: Page = new Page();
  unite: Unite = new Unite();
  unites: Unite[] = [];
  uniteSelected: string = "";

  breadCrumbItems!: Array<{}>;

  totalPage: number = 1;
  tableauPage = new Array();
  outerComptantCredit!: ComptantCredit;

  // Nouveaux champs de recherche
  dateDebut: string = "";
  dateFin: string = "";
  type: string = "";
  isQuittanced: string = "";

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
      private comptantCreditService:RealisationService ,
      private uniteService: UniteService,
      private printService: PrintService,
      private modalService: NgbModal,
      private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Situation Crédit/Comptant', active: true }
    ];
    this.initializePage();
    this.loadUnites();
  }

  // Initialiser la pagination
  private initializePage(): void {
    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;
    this.pageData.page = this.pageSelected;
    this.pageData.data = new Array();
  }

  // Charger la liste des unités
  loadUnites(): void {
    this.uniteService.getAllUnite().subscribe(response => {
      this.unites = response.data;
    });
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

    if (!this.dateDebut || !this.dateFin) {
      return true; // Ne pas valider si les champs sont vides
    }

    const startDate = new Date(this.dateDebut);
    const endDate = new Date(this.dateFin);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de journée pour comparaison

    // Vérifier que la date de début n'est pas postérieure à la date de fin
    if (startDate > endDate) {
      this.dateError = "La date de début ne peut pas être postérieure à la date de fin.";
      return false;
    }

    // Vérifier que les dates ne dépassent pas aujourd'hui
    if (endDate > today) {
      this.dateError = "La date de fin ne peut pas être supérieure à aujourd'hui.";
      return false;
    }

    if (startDate > today) {
      this.dateError = "La date de début ne peut pas être supérieure à aujourd'hui.";
      return false;
    }

    return true;
  }

  onDateChange(): void {
    this.validateDates();
  }

  getComptantCredits() {
    if (!this.validateDates()) {
      this.resetPaginationData();
      return;
    }

    this.isLoading = true;
    this.isData = false;

    // S'assurer que pageSelected est correctement initialisé
    if (!this.pageSelected) {
      this.pageSelected = new Page();
    }

    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;

    console.log('Page demandée:', this.pageSelected);

    this.comptantCreditService.getComptantCredit(
        this.pageSelected,
        this.type,
        this.isQuittanced,
        this.uniteSelected,
        this.dateDebut,
        this.dateFin
    ).subscribe({
      next: (pagedData: any) => {
        console.log('Données reçues:', pagedData);
        this.handleSuccessResponse(pagedData);
      },
      error: (err: any) => {
        console.error("Error fetching comptant credits:", err);
        this.handleErrorResponse();
      }
    });
  }

  // Gérer la réponse de succès
  private handleSuccessResponse(pagedData: any): void {
    this.pageData = pagedData;

    if (pagedData && pagedData.data && pagedData.data.length > 0) {
      this.isData = true;
    } else {
      this.isData = false;
      this.pageData.data = [];
    }

    // Mettre à jour les variables de pagination
    this.updatePaginationVariables();
    this.isLoading = false;
  }

  // Gérer la réponse d'erreur
  private handleErrorResponse(): void {
    this.isLoading = false;
    this.resetPaginationData();
  }

  // Réinitialiser les données de pagination
  private resetPaginationData(): void {
    this.isData = false;
    this.pageData.data = [];
    this.pageData.page = new Page();
    this.pageData.page.totalPages = 0;
    this.totalPage = 0;
  }

  // Mettre à jour les variables de pagination - CORRIGÉ
  private updatePaginationVariables(): void {
    if (this.pageData.page) {
      // Ne pas modifier pageNumber ici, il est déjà défini avant l'appel
      this.totalPage = this.pageData.page.totalPages || 1;

      // S'assurer que pageNumber est dans les limites valides
      if (this.pageNumber >= this.totalPage) {
        this.pageNumber = Math.max(0, this.totalPage - 1);
        this.pageSelected.pageNumber = this.pageNumber;
      }

      console.log(`Page actuelle: ${this.pageNumber + 1}/${this.totalPage}`);
    }
  }

  changeSize() {
    console.log('Changement de taille:', this.size);

    // Réinitialiser à la première page lors du changement de taille
    this.pageNumber = 0;
    this.pageSelected.size = parseInt(this.size.toString());
    this.pageSelected.pageNumber = this.pageNumber;

    console.log('Nouveau paramètre de page:', this.pageSelected);
    this.getComptantCredits();
  }

  // CORRIGÉ - Navigation vers la page suivante
  prochainePage() {
    console.log('Tentative page suivante - Page actuelle:', this.pageNumber, 'Total pages:', this.totalPage);

    if (this.canGoToNextPage()) {
      this.pageNumber++;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;

      console.log('Navigation vers page suivante:', this.pageSelected);
      this.getComptantCredits();
    } else {
      console.log('Navigation impossible: déjà à la dernière page');
    }
  }

  // CORRIGÉ - Navigation vers la page précédente
  precedentPage() {
    console.log('Tentative page précédente - Page actuelle:', this.pageNumber);

    if (this.canGoToPreviousPage()) {
      this.pageNumber--;
      this.pageSelected.pageNumber = this.pageNumber;
      this.pageSelected.size = this.size;

      console.log('Navigation vers page précédente:', this.pageSelected);
      this.getComptantCredits();
    } else {
      console.log('Navigation impossible: déjà à la première page');
    }
  }

  // CORRIGÉ - Vérifier si on peut aller à la page suivante
  private canGoToNextPage(): boolean {
    return !this.isLoading &&
        this.pageData.page &&
        this.pageNumber < (this.totalPage - 1) &&
        this.totalPage > 1;
  }

  // CORRIGÉ - Vérifier si on peut aller à la page précédente
  private canGoToPreviousPage(): boolean {
    return !this.isLoading &&
        this.pageData.page &&
        this.pageNumber > 0;
  }

  rechercherComptantCredit() {
    console.log("Recherche avec paramètres:");
    console.log("Date début:", this.dateDebut);
    console.log("Date fin:", this.dateFin);
    console.log("Type:", this.type);
    console.log("Is Quittanced:", this.isQuittanced);
    console.log("Unité sélectionnée:", this.uniteSelected);

    // Réinitialiser à la première page lors d'une nouvelle recherche
    this.pageNumber = 0;
    this.pageSelected.pageNumber = this.pageNumber;
    this.pageSelected.size = this.size;

    this.getComptantCredits();
  }

  // Méthode print qui télécharge directement le PDF
  print() {
    // Vérifier qu'il y a des données à imprimer
    if (!this.isData || !this.dateDebut || !this.dateFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez d\'abord effectuer une recherche avec des dates valides.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isPrinting = true;

    this.printService.printComptantCredit(
        this.dateDebut,
        this.dateFin,
        this.type || null,
        this.isQuittanced || null,
        this.uniteSelected || null
    ).subscribe({
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
      let pageAll: Page = new Page();
      pageAll.pageNumber = 0;
      pageAll.size = 2000000;
      this.comptantCreditService.getComptantCredit(
          pageAll,
          this.type,
          this.isQuittanced,
          this.uniteSelected,
          this.dateDebut,
          this.dateFin
      ).subscribe({
        next: (pagedData: any) => {
          console.log('Données pour Excel reçues:', pagedData);
          this.handleSuccessResponse(pagedData);
          // Préparer les données pour l'exportation
          const exportData = pagedData.data.map((item:any) => ({
            'Code Bureau': item.codeBureau,
            'Libellé Bureau': item.libBureau,
            'Code Déclarant': item.codeDeclarant,
            'Libellé Déclarant': item.libDeclarant,
            'NIF Entreprise': item.nifEntreprise,
            'Libellé Entreprise': item.libEntreprise,
            'Ref. Liquidation': item.refLiq,
            'Date Liquidation': item.datLiq,
            'Ref. Quittance': item.refQuit || 'Non quittancé',
            'Date Quittance': item.dateQuittance || '-',
            'Type Quittance': item.typeQuittance || '-',
            'Total Taxes': item.totalTaxes,
            'Échéance': item.echeance,
            'Tél. Déclarant': item.decTel || '-',
            'Fax Déclarant': item.decFax || '-',
            'Tél. Entreprise': item.cmpTel || '-',
            'Fax Entreprise': item.cmpFax || '-'
          }));

          // Créer le workbook
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

          // Définir la largeur des colonnes
          const colWidths = [
            { wch: 12 }, // Code Bureau
            { wch: 20 }, // Libellé Bureau
            { wch: 15 }, // Code Déclarant
            { wch: 25 }, // Libellé Déclarant
            { wch: 15 }, // NIF Entreprise
            { wch: 25 }, // Libellé Entreprise
            { wch: 15 }, // Ref. Liquidation
            { wch: 15 }, // Date Liquidation
            { wch: 15 }, // Ref. Quittance
            { wch: 15 }, // Date Quittance
            { wch: 15 }, // Type Quittance
            { wch: 15 }, // Total Taxes
            { wch: 10 }, // Échéance
            { wch: 15 }, // Tél. Déclarant
            { wch: 15 }, // Fax Déclarant
            { wch: 15 }, // Tél. Entreprise
            { wch: 15 }  // Fax Entreprise
          ];
          ws['!cols'] = colWidths;

          // Ajouter la feuille au workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Situation Crédit Comptant');

          // Générer le nom du fichier
          const fileName = `Situation_Credit_Comptant_${this.dateDebut}_${this.dateFin}.xlsx`;

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
        },
        error: (err: any) => {
          console.error("Error fetching comptant credits for excel :", err);
          this.handleErrorResponse();
        }
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

    // Utiliser le service d'analyse
  }
}







