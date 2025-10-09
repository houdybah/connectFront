import { Component, Input } from '@angular/core';
import { SituationCodeBudget } from '../../../../../src/models/SituationCodeBudget';

@Component({
  selector: 'app-table-code-budget',
  templateUrl: './table-code-budget.component.html',
  styleUrl: './table-code-budget.component.scss'
})
export class TableCodeBudgetComponent {

  @Input() situationCodeBudget : SituationCodeBudget[] = [];
    
    
        constructor(){
        }
        ngOnInit(): void {
    
        }

}








