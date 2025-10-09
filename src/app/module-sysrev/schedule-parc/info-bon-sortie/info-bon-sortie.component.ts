import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ScheduleService} from "../../services/schedule.service";
import {BonSortieComponent} from "../bon-sortie/bon-sortie.component";
import {DetailBonSortie} from "../../models/DetailBonSortie";

@Component({
  selector: 'app-info-bon-sortie',
  templateUrl: './info-bon-sortie.component.html',
  styleUrl: './info-bon-sortie.component.scss'
})
export class InfoBonSortieComponent implements OnInit {
  bonSortieForm: FormGroup;
  @Input() childProperty = "";

  
  conteneurs = [
    { numero: 'C001', Declaration: 'D12345', liquidation: 10000, type: '40FT', colis: 50, poidsBrut: 1200, numeroBl: 'BL9876' },
    { numero: 'C002', Declaration: 'D67890', liquidation: 8000, type: '20FT', colis: 30, poidsBrut: 800, numeroBl: 'BL5432' }
  ];
  detailBonSortie:DetailBonSortie[] = [];

  constructor(private fb: FormBuilder,private ScheduleService: ScheduleService,@Optional() private parent: BonSortieComponent) {
    this.bonSortieForm = this.fb.group({
      numeroBonSortie: [{ value: 'BS2024001', disabled: true }],
      dateEmission: [{ value: '2025-02-05', disabled: true }],
      agentAffecte: [{ value: 'Jean Dupont', disabled: true }]
    });

   
  }
  ngOnInit(): void {
    console.log(this.childProperty)

    this.getBonSortie()
   // this.getDetailBonsortie()
    
  }


  getBonSortie(){
    let value = sessionStorage.getItem('reference');
    console.log(typeof value)
    this.ScheduleService.getBonSortie(value).subscribe(res => {
     // this. = res;
      // this.bonSortieForm.patchValue({
      //   numeroBonSortie: res.numeroBonSortie,
      //   dateEmission:   res.dateSortie
      // })
    })
  }

  getDetailBonsortie(){
    let ref = sessionStorage.getItem('reference');

    // if (ref) {
    //   const value = JSON.parse(ref);
    //   console.log(typeof value)
    //   this.ScheduleService.getDetailBonSortie(value).subscribe(res => {
    //     this.SysrevDetailBonSortie = res;
    //     console.log(res)
    //   })
    // }
  }


}




