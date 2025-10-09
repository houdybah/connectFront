import { Component } from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface VentilationCompte {
    compte: string;
    e_r: number;
    emissions: number;
    recouvrements: number;
}

@Component({
  selector: 'app-ventilation-compte',
  templateUrl: './ventilation-compte.component.html',
  styleUrl: './ventilation-compte.component.scss'
})
export class VentilationCompteComponent {
    budgetItems: VentilationCompte[] = [
        { compte: 'RSD', e_r: 53871767648, emissions: 53871767648, recouvrements: 48926982141 },
        // Sous-total calculé automatiquement
        { compte: 'DNT', e_r: 2293438, emissions: 2293438, recouvrements: 925000 },
        // Total budget calculé automatiquement
        { compte: 'FER', e_r: 19, emissions: 295020128, recouvrements: 335446822 },
        // Total du mois calculé automatiquement
        { compte: 'TOTAL DU JOURS', e_r: 20, emissions: 0, recouvrements: 0 },
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
            compte: 'SOUS TOTAL',
            e_r: this.budgetItems[this.sousTotalIndex].e_r,
            emissions: this.sumItems(0, this.sousTotalIndex),
            recouvrements: this.sumItems(0, this.sousTotalIndex, 'recouvrements')
        };
        this.budgetItems.splice(this.sousTotalIndex, 1, sousTotal);

        // Calcule le total budget
        const totalBudget = {
            compte: 'TOTAL BUDGET',
            e_r: this.budgetItems[this.totalBudgetIndex].e_r,
            emissions: sousTotal.emissions + this.budgetItems[this.sousTotalIndex + 1].emissions,
            recouvrements: sousTotal.recouvrements + this.budgetItems[this.sousTotalIndex + 1].recouvrements
        };
        this.budgetItems.splice(this.totalBudgetIndex, 1, totalBudget);

        // Calcule le total du mois
        const totalDuMois = {
            compte: 'TOTAL DU JOUR',
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
    updateValue(item: VentilationCompte, field: 'emissions' | 'recouvrements', event: Event): void {
        const input = event.target as HTMLInputElement;
        const newValue = Number(input.value);

        if (!isNaN(newValue)) {
            item[field] = newValue;
            this.calculateTotals();
        }
    }
}








