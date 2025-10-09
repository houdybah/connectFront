import { Component } from '@angular/core';
import {SituationService} from "../../../services/situation.service";
import {ResteARecouvrer} from "../../../models/resteARecouvrer";

@Component({
  selector: 'app-search-reste-arecouvrer',
  templateUrl: './search-reste-arecouvrer.component.html',
  styleUrl: './search-reste-arecouvrer.component.scss'
})
export class SearchResteArecouvrerComponent {

  situations: ResteARecouvrer[] = [];
    periodSelect: Boolean = false;
    recherche: Boolean = false;
    isLoading: boolean = false;
    dateError: string | null = null;
  
    dateDebut: string = "";
    dateFin: string = "";
  
 // Pagination
  cfiltreSituationRARList: ResteARecouvrer[] = [];
  cpage = 1;
  cpageSize = 10; // Valeur par défaut cohérente avec le select HTML
  totalLengthOfCollection: number = 0;
  pagedSituationList: ResteARecouvrer[] = [];

constructor(private situationService: SituationService) {}

  ngOnInit(): void {
    this.periodSelect = false;
    this.updatePagination();
  }

  masquer() {
    this.periodSelect = false;
    this.recherche = false;
  }

  selectPeriod(): boolean {
    this.recherche = true;
    this.situationService.getResteARecouvrir(this.dateDebut, this.dateFin).subscribe(
      (situation: ResteARecouvrer[]) => {
        if (!situation) {
          this.situations = [];
          this.cfiltreSituationRARList = [];
          this.periodSelect = false;
        } else {
          this.situations = situation;
          this.cfiltreSituationRARList = situation;
          this.periodSelect = true;
        }
        this.totalLengthOfCollection = this.cfiltreSituationRARList.length;
        this.cpage = 1; // Revenir à la première page après une recherche
        this.updatePagination();
        this.recherche = false;
      }
    );
    return true;
  }

  validateDates(): boolean {
    this.dateError = null;
    if (this.dateDebut && this.dateFin) {
      const startDate = new Date(this.dateDebut);
      const endDate = new Date(this.dateFin);
      const today = new Date();
      if (startDate > today) {
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

  onPageSizeChange(): void {
    this.cpage = 1;
    this.updatePagination();
  }

  onPageChange() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalLengthOfCollection = this.cfiltreSituationRARList.length;
    const start = (this.cpage - 1) * this.cpageSize;
    const end = start + this.cpageSize;
    this.pagedSituationList = this.cfiltreSituationRARList.slice(start, end);
  }

  getStartIndex() {
    return this.totalLengthOfCollection === 0 ? 0 : (this.cpage - 1) * this.cpageSize + 1;
  }

  getEndIndex() {
    const end = this.cpage * this.cpageSize;
    return end > this.totalLengthOfCollection ? this.totalLengthOfCollection : end;
  }
}








