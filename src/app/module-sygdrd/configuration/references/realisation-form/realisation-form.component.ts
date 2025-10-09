import {Component, Host, Input} from '@angular/core';
import {Realisation} from "../../../models/Realisation";
import {Unite} from "../../../models/Unite";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RealisationListComponent} from "../realisation-list/realisation-list.component";
import {QuotaAnnuel} from "../../../models/QuotaAnnuel";
import {RealisationService} from "../../../services/realisation.service";
import {QuotaAnnuelService} from "../../../services/quota-annuel.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-realisation-form',
  templateUrl: './realisation-form.component.html',
  styleUrl: './realisation-form.component.scss'
})
export class RealisationFormComponent {

  @Input() innerRealisation:Realisation | null | undefined;
  @Input() unite!:Unite|null;

  realisationForm: FormGroup = Object.create(null);
  realisationList!: RealisationListComponent;
  realisation!: Realisation;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  quotaAnnuels: QuotaAnnuel[] = [];

  constructor(public realisationService: RealisationService,
              public quotaAnnuelService: QuotaAnnuelService,
              private fb: FormBuilder,
              @Host() realisationList: RealisationListComponent){
    this.realisationList= realisationList;
  }

  ngOnInit(): void
  {

    this.getCombos()
    this.realisationForm = this.fb.group({
      periode:["", Validators.required],
      recettePP:[0, Validators.required],
      recetteAP:[0, Validators.required],
      totalPPAP:[0, Validators.required],
      tme:[0, Validators.required],
      tmx:[0, Validators.required],
      rer:[0, Validators.required],
      totalPPAPTMERER:[0, Validators.required],
    });


    if(this.innerRealisation!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.realisationForm.disable();
      this.realisation=this.innerRealisation
      this.display(this.realisation);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.realisationForm.enable();
      this.realisation=new Realisation();
      this.display(this.realisation);
    }


  }

  getCombos() {

    this.quotaAnnuelService.getAllQuotaAnnuel().subscribe((data:any) => {
      console.log(data)
      this.quotaAnnuels = data.data;
    });

  }

  myValue: string = '';

  myValue2: string = '';
  onInputChange() {
    this.myValue = this.myValue.toUpperCase();
  }

  onInputChanges() {
    this.myValue2 = this.myValue2.toUpperCase();
  }

  clearError() {
    const descriptionControl = this.realisationForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.realisationForm.enable();
  }

  display(realisationDisplay: Realisation): void {
    this.realisation = realisationDisplay;
    this.realisationForm.patchValue({
      periode: this.realisation.periode,
      recettePP:this.realisation.recettePP,
      recetteAP:this.realisation.recetteAP,
      totalPPAP:this.realisation.totalPPAP,
      tme:this.realisation.tme,
      tmx:this.realisation.tmx,
      rer:this.realisation.rer,
      totalPPAPTMERER:this.realisation.totalPPAPTMERER
    });
  }

  Onsave(){
    
  }

  delete(realisation :Realisation){
    
  }
  
}








