import { Component, Input } from '@angular/core';
import {DetailAffectationConteneur} from "../../../../models/DetailAffectationConteneur";
import {DetailConteneurAffectationService} from "../../../../services/detail-conteneur-affectation.service";


@Component({
  selector: 'app-detail-container-appure',
  templateUrl: './detail-container-appure.component.html',
  styleUrl: './detail-container-appure.component.scss'
})
export class DetailContainerAppureComponent {
   @Input()  childProperty:string='';
  detailsConteneur:DetailAffectationConteneur[]=[];

   constructor(private detailConteneurService: DetailConteneurAffectationService) {
 
   }


   ngOnInit(): void {
    this.loadDetailConteneurAffectation();
   }


   loadDetailConteneurAffectation(): void {
    this.detailConteneurService.getDetailConteneurAffectation(this.childProperty).subscribe((res: any) => {
      this.detailsConteneur = res;
      console.log(this.detailsConteneur);
    });
   }
     
}








