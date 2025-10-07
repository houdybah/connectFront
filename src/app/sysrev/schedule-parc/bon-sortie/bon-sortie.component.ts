import { Component, Input, ViewChild } from '@angular/core';
import { InfoBonSortieComponent } from '../info-bon-sortie/info-bon-sortie.component';
import {BonSortie} from "../../models/BonSortie";
import {InfoDeclarationComponent} from "../info-declaration/info-declaration.component";
import {ScheduleService} from "../../services/schedule.service";

@Component({
  selector: 'app-bon-sortie',
  templateUrl: './bon-sortie.component.html',
  styleUrl: './bon-sortie.component.scss'
})
export class BonSortieComponent {
  @Input() childBonSortie = new BonSortie();
 
  reference:string = "";
  @ViewChild(InfoDeclarationComponent) declarationComponent!: InfoDeclarationComponent;
  @ViewChild(InfoBonSortieComponent) bonSortieComponent!: InfoBonSortieComponent;

   constructor(private ScheduleService: ScheduleService) {}

   getDeclaration(){
    //this.removeItem('reference');
    this.reference = this.declarationComponent.declarationForm.value.anneeDeclaration+"GNB0"+this.declarationComponent.declarationForm.value.codeBureau+"L"+this.declarationComponent.declarationForm.value.numeroBl
    sessionStorage.setItem('reference', JSON.stringify(this.reference)); 
    console.log(this.reference)
    let ref = sessionStorage.getItem('reference');
    console.log(ref)

    // if (ref) {
    //   const value = JSON.parse(ref);
    //   console.log(value);
    //   this.ScheduleService.getDeclaration(value).subscribe(res => {
    //     this.declarationComponent.declarationForm.patchValue({
    //       codeBureau: this.declarationComponent.declarationForm.value.codeBureau,
    //       numeroBl: this.declarationComponent.declarationForm.value.numeroBl,
    //       anneeDeclaration: this.declarationComponent.declarationForm.value.anneeDeclaration,
    //       codeDeclarant: res.codeDeclarant,
    //       codeNif: res.codeEntreprise,
    //       libelleDeclarant: res.office,
    //       bureau: res.codeOffice,
    //       reference: res.refLiquidation,
    //       montantLiquidation: res.montant,
    //       numeroQuittance: res.numeroQuittance,
    //       statusSortie: ''
    //     })
    //   }) // Affiche '12345'
    // }
     
  }


  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }


}




