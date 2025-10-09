import {Component, Input} from '@angular/core';
import {ResteARecouvrer} from "../../../models/resteARecouvrer";
import {Provisoire} from "../../../models/Provisoire";

@Component({
  selector: 'app-table-provisoire',
  templateUrl: './table-provisoire.component.html',
  styleUrl: './table-provisoire.component.scss'
})
export class TableProvisoireComponent {
  @Input() situations : Provisoire[] = [];



  constructor()
  {

  }
  ngOnInit(): void {

  }
}








