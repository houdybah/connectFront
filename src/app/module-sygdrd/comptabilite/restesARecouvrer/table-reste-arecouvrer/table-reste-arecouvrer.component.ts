import {Component, Input} from '@angular/core';
import {ResteARecouvrer} from "../../../models/resteARecouvrer";

@Component({
  selector: 'app-table-reste-arecouvrer',
  templateUrl: './table-reste-arecouvrer.component.html',
  styleUrl: './table-reste-arecouvrer.component.scss'
})
export class TableResteArecouvrerComponent {
  @Input() situations : ResteARecouvrer[] = [];



  constructor()
  {

  }
  ngOnInit(): void {

  }

}








