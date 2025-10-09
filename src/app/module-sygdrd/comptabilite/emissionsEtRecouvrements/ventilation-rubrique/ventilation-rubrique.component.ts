import { Component } from '@angular/core';

interface VentilationRubrique {
  rubrique: string;
  e_r: number;
  emissions: number;
  recouvrements: number;
}

@Component({
  selector: '' +
      'app-ventilation-rubrique',
  templateUrl: './ventilation-rubrique.component.html',
  styleUrl: './ventilation-rubrique.component.scss'
})
export class VentilationRubriqueComponent {


  budgetItems: VentilationRubrique[] = [
    { rubrique: 'TVA', e_r: 53871767648, emissions: 53871767648, recouvrements: 48926982141 },
    { rubrique: 'ACC', e_r: 2293438, emissions: 2293438, recouvrements: 925000 },
    { rubrique: 'RPA', e_r: 3, emissions: 0, recouvrements: 72100000 },
    { rubrique: 'DFI', e_r: 4, emissions: 39575251027, recouvrements: 39861350779 },
    { rubrique: 'TEN', e_r: 5, emissions: 1623732098, recouvrements: 2356689891 },
    { rubrique: 'RTL', e_r: 6, emissions: 19177882921, recouvrements: 21325552072 },
    { rubrique: 'TE', e_r: 7, emissions: 3884719081, recouvrements: 3701236808 },
    { rubrique: 'DFE', e_r: 8, emissions: 0, recouvrements: 0 },
    { rubrique: 'AC', e_r: 9, emissions: 0, recouvrements: 0 },
    { rubrique: 'TCP', e_r: 10, emissions: 0, recouvrements: 41190 },
    { rubrique: 'TRE', e_r: 11, emissions: 0, recouvrements: 1412612740 },
    // Sous-total calculé automatiquement
    { rubrique: 'SOUS TOTAL', e_r: 12, emissions: 0, recouvrements: 0 },
    { rubrique: 'CTSS', e_r: 13, emissions: 1710488175, recouvrements: 1710488175 },
    // Total budget calculé automatiquement
    { rubrique: 'TOTAL BUDGET', e_r: 14, emissions: 0, recouvrements: 0 },
    { rubrique: 'RCE', e_r: 15, emissions: 0, recouvrements: 19579552 },
    { rubrique: 'CA', e_r: 16, emissions: 1278904060, recouvrements: 1386770454 },
    { rubrique: 'PC', e_r: 17, emissions: 2549483059, recouvrements: 2744514806 },
    { rubrique: 'PF', e_r: 18, emissions: 0, recouvrements: 22717146 },
    { rubrique: 'BFU', e_r: 19, emissions: 295020128, recouvrements: 335446822 },
    // Total du mois calculé automatiquement
    { rubrique: 'TOTAL DU JOUR', e_r: 20, emissions: 0, recouvrements: 0 },
  ];

  // Totaux et calculs spéciaux
  sousTotalIndex = 11; // Index du sous-total dans le tableau
  totalBudgetIndex = 13; // Index du total budget dans le tableau
  totalDuMoisIndex = 19; // Index du total du mois dans le tableau

  // Valeurs additionnelles
  rarAnnee: number = 17230052524;
  exclo2024: number = 8195374559;

  constructor() { }

  ngOnInit(): void {
    console.log(this.budgetItems)
    this.calculateTotals();
  }

  /**
   * Calcule tous les totaux (sous-total, total budget, total du mois)
   */
  calculateTotals(): void {
    // Calcule le sous-total
    const sousTotal = {
      rubrique: 'SOUS TOTAL',
      e_r: this.budgetItems[this.sousTotalIndex].e_r,
      emissions: this.sumItems(0, this.sousTotalIndex),
      recouvrements: this.sumItems(0, this.sousTotalIndex, 'recouvrements')
    };
    this.budgetItems.splice(this.sousTotalIndex, 1, sousTotal);

    // Calcule le total budget
    const totalBudget = {
      rubrique: 'TOTAL BUDGET',
      e_r: this.budgetItems[this.totalBudgetIndex].e_r,
      emissions: sousTotal.emissions + this.budgetItems[this.sousTotalIndex + 1].emissions,
      recouvrements: sousTotal.recouvrements + this.budgetItems[this.sousTotalIndex + 1].recouvrements
    };
    this.budgetItems.splice(this.totalBudgetIndex, 1, totalBudget);

    // Calcule le total du mois
    const totalDuMois = {
      rubrique: 'TOTAL DU JOUR',
      e_r: this.budgetItems[this.totalDuMoisIndex].e_r,
      emissions: this.sumItems(this.totalBudgetIndex + 1, this.totalDuMoisIndex) + totalBudget.emissions,
      recouvrements: this.sumItems(this.totalBudgetIndex + 1, this.totalDuMoisIndex, 'recouvrements') + totalBudget.recouvrements
    };
    this.budgetItems.splice(this.totalDuMoisIndex, 1, totalDuMois);
  }

  /**
   * Calcule la somme des émissions ou recouvrements pour un intervalle d'éléments
   */
  sumItems(startIndex: number, endIndex: number, property: 'emissions' | 'recouvrements' = 'emissions'): number {
    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += this.budgetItems[i][property] || 0;
    }
    return sum;
  }

  /**
   * Gère la mise à jour d'une valeur dans le tableau
   */
  updateValue(item: VentilationRubrique, field: 'emissions' | 'recouvrements', event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);

    if (!isNaN(newValue)) {
      item[field] = newValue;
      this.calculateTotals();
    }
  }

}








