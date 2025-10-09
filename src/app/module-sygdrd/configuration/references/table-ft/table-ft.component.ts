import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { retry, takeUntil } from 'rxjs';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/PageData';
import { TransactionFt } from '../../../../../src/models/transactionFt';
import { SituationService } from '../../../../../src/services/situation.service';

@Component({
  selector: 'app-table-ft',
  templateUrl: './table-ft.component.html',
  styleUrl: './table-ft.component.scss'
})
export class TableFtComponent {

   @Input() situations : TransactionFt[] = [];






   

}







