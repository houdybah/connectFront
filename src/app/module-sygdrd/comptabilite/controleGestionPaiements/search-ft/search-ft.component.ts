import { Component } from '@angular/core';
import {SituationService} from "../../../services/situation.service";
import {TransactionFt} from "../../../models/transactionFt";

@Component({
  selector: 'app-search-ft',
  templateUrl: './search-ft.component.html',
  styleUrl: './search-ft.component.scss'
})
export class SearchFtComponent {
  activeSelected=2;
  disabled = true;

  periodSelect: Boolean= false;

  recherche: Boolean= false;

  currentJustify = 'start';

  active=2;
  activev= "top";

  activeKeep=2;

  dateDebut : string ="";
  dateFin : string="";

  situations : TransactionFt[] = [];


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
    console.log(jour.getMonth().valueOf())
    if(jour.getMonth().valueOf()<=9)
    {
      if(jour.getDate().valueOf() < 10)
      {
        this.dateFin=jour.getFullYear()+'-0'+(jour.getMonth().valueOf()+1)+'-0'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-0'+(jour.getMonth().valueOf()+1)+'-01';
      }
      else
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
    }
    else
    {
      if(jour.getDate().valueOf() < 10)
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-0'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
      else
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
    }


  }

  masquer(){
    this.periodSelect = false
    this.recherche = false
  }

  selectPeriod(){
    this.recherche = true

    if(this.dateDebut.valueOf() > this.dateFin.valueOf())
    {
      let tmp = this.dateDebut;
      this.dateDebut = this.dateFin;
      this.dateFin = tmp;
    }
    this.situationService.getFtBCRG(this.dateDebut,this.dateFin).subscribe(
        (situation : TransactionFt[])=>
        {
          console.log(situation)
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








