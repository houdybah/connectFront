import { Component } from '@angular/core';
import {SituationService} from "../../../services/situation.service";
import {Provisoire} from "../../../models/Provisoire";

@Component({
  selector: 'app-search-provisoire',
  templateUrl: './search-provisoire.component.html',
  styleUrl: './search-provisoire.component.scss'
})
export class SearchProvisoireComponent {

  activeSelected=2;
  disabled = true;

  periodSelect: Boolean= false;

  recherche: Boolean= false;

  currentJustify = 'start';

  active=2;
  activev= "top";

  activeKeep=2;

  annee : string ="";

  situations : Provisoire[] = [];


  t : any
  isSI : boolean = false

  constructor(
      private situationService : SituationService,

  ){
    this.isSI = true
  }


  ngOnInit(): void {

    this.periodSelect = false
    const jour = new Date();
    this.annee=jour.getFullYear().toString()

  }

  masquer(){
    this.periodSelect = false
    this.recherche = false
  }

  selectPeriod(){
    this.recherche = true

    this.situationService.getProvisoire(this.annee).subscribe(
        (situation : Provisoire[])=>
        {
          if(situation == null)
          {
            this.situations = []
            this.periodSelect = false

          }
          else{

            this.situations = situation
            this.periodSelect = true
          }
          this.recherche = false
        }
    );

  }

}








