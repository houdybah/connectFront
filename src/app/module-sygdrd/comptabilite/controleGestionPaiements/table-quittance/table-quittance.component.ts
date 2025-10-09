import {Component, Input} from '@angular/core';
import {DecimalPipe, NgForOf} from "@angular/common";
import {Quittance} from "../../../models/Quittance";

@Component({
  selector: 'app-table-quittance',
  templateUrl: './table-quittance.component.html',
  styleUrl: './table-quittance.component.scss'
})
export class TableQuittanceComponent {

    @Input() situations : Quittance[] = [];


    constructor(){
    }
    ngOnInit(): void {

    }

}








