import { Component } from '@angular/core';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/PageData';
import { RarParCodeBudget } from '../../../../../src/models/rar-par-code-budget';
import { Unite } from '../../../../../src/models/Unite';
import { RealisationService } from '../../../../../src/services/realisation.service';
import { UniteService } from '../../../../../src/services/unite.service';

@Component({
  selector: 'app-rar-par-code-budget',
  templateUrl: './rar-par-code-budget.component.html',
  styleUrl: './rar-par-code-budget.component.scss'
})
export class RarParCodeBudgetComponent {

    rarParCodeBudget: RarParCodeBudget[] = [];
    periodSelect: Boolean = false;
    recherche: Boolean = false;
    isLoading: boolean = false;
    dateError: string | null = null;

    /**
     * Pagination back-end parametters
     */
   
    key: string ="" ;
    pageData : PagedData<RarParCodeBudget> = new PagedData<RarParCodeBudget>();
    pageNumber : number = 0;
    size : number = 10;
    pageSelected : Page = new Page();
   
    
    totalPage: number = 1;
    tableauPage = new Array()
    filterRarParCodeBudgetComponent : RarParCodeBudgetComponent[] | null = null;

  

     /**
     * Parameters entry to filtre data
     */
      selectedUnite: Unite | null = null;
      dateDebut: string = "";
      dateFin: string = "";

    /**
     * Searchable unité select combo box
     */
      uniteSearch: string = '';
      filteredUnites: Unite[] = [];
      showUniteDropdown: boolean = false;
      unites: Unite[] = [];
      unite: Unite = new Unite();

     constructor(private realisationService: RealisationService,private uniteService: UniteService) {}


     ngOnInit(): void {
        this.periodSelect = false;
        this.pageNumber = 0;
        this.size = 10;
        this.pageSelected = new Page();
        this.pageSelected.pageNumber = this.pageNumber;
        this.pageSelected.size = this.size;
        this.getUnite();
    }

  getUnite(){
    this.uniteService.getAllUnite().subscribe(response => {
            if (response && response.data) {
              this.unites = response.data;
              this.filteredUnites = [...response.data];
            } else {
              this.unites = [];
              this.filteredUnites = [];
            }
       });
  }

   getRarParCodeBudget(){
     this.recherche = true;
    console.log(this.pageSelected)
    this.realisationService.getRARparCodeBudget(this.pageSelected,this.dateDebut, this.dateFin,this.selectedUnite!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.pageNumber = this.pageData.page.pageNumber;
      this.size = this.pageData.page.size;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      this.periodSelect = true;
    });
  }

  /**
   * Select unite
   */
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
    this.selectedUnite = unite;
    this.uniteSearch = unite.nomUnite;
    this.unite = unite;
    this.showUniteDropdown = false;
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

  isSearchDisabled(): boolean {
    if (this.isLoading || this.dateError  || !this.dateDebut) {
      return true;
    }
    if (!this.selectedUnite) {
      return true;
    }
    if (!this.dateFin) {
      return true;
    }
    return false;
  }


   // Méthode pour obtenir le message de validation approprié
  getValidationMessage(): string | null {
    if (!this.selectedUnite && (this.dateDebut || this.dateFin)) {
      return 'Veuillez sélectionner une unité pour effectuer la recherche.';
    }
    if ( this.dateDebut && !this.dateFin) {
      return 'Veuillez sélectionner une date de fin pour la recherche par intervalle.';
    }
    return null;
  }

  validateDates(): boolean {
    this.dateError = null;
    if (this.dateDebut && this.dateFin) {
      const startDate = new Date(this.dateDebut);
      const endDate = new Date(this.dateFin);
      const today = new Date();if (startDate > today) {
        this.dateError = "La date de début ne peut pas être dans le futur.";
        return false;
      } else if (endDate > today) {
        this.dateError = "La date de fin ne peut pas être dans le futur.";
        return false;
      } else if (startDate > endDate) {
        this.dateError = "La date de début ne peut pas être postérieure à la date de fin.";
        return false;
      }
    }
    return true;
  }

  masquer() {
    this.periodSelect = false;
    this.recherche = false;
  }
  
  changeSize() {
    this.pageSelected.size = this.size
    this.pageSelected.pageNumber = this.pageNumber
    console.log(this.pageSelected)
    
     this.realisationService.getRARparCodeBudget(this.pageSelected,this.dateDebut, this.dateFin,this.selectedUnite!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      console.log(this.totalPage)
    });
  }


  prochainePage() {
    this.pageSelected.size = this.size;
    // Correction : ne pas dépasser la dernière page
    if (this.pageData.page.pageNumber < this.totalPage - 1) {
      this.pageNumber = this.pageData.page.pageNumber + 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.realisationService.getRARparCodeBudget(this.pageSelected, this.dateDebut, this.dateFin, this.selectedUnite!.uuid).subscribe((pagedData: any) => {
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

  precedentPage() {
    this.pageSelected.size = this.size;
    // Correction : ne pas descendre sous la première page
    if (this.pageData.page.pageNumber > 0) {
      this.pageNumber = this.pageData.page.pageNumber - 1;
      this.pageSelected.pageNumber = this.pageNumber;
      this.realisationService.getRARparCodeBudget(this.pageSelected, this.dateDebut, this.dateFin, this.selectedUnite!.uuid).subscribe((pagedData: any) => {
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

}








