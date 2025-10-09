import {Component, Input} from '@angular/core';
import {TransactionFt} from "../../../models/transactionFt";
import {SituationService} from "../../../services/situation.service";

@Component({
  selector: 'app-table-ft',
  templateUrl: './table-ft.component.html',
  styleUrl: './table-ft.component.scss'
})
export class TableFtComponent {

  @Input() situations : TransactionFt[] = [];

  constructor(
  ){
  }
  ngOnInit(): void {

  }
  
}








