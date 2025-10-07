import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BonSortie} from "../../models/BonSortie";
import {ScheduleService} from "../../services/schedule.service";

@Component({
  selector: 'app-info-Declaration',
  templateUrl: './info-Declaration.component.html',
  styleUrl: './info-Declaration.component.scss'
})
export class InfoDeclarationComponent implements OnInit {
 BonSortie = new BonSortie();
  declarationForm: FormGroup;

  options = [
    { value: '', label: '' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
  value:any;

  constructor(private fb: FormBuilder,private ScheduleService: ScheduleService) {
    this.declarationForm = this.fb.group({
      codeDeclarant: [{value: '', disabled: true}, Validators.required],
      codeNif: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      libelleDeclarant: [{value: '', disabled: true}, Validators.required],
      anneeDeclaration: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      codeBureau: ['', Validators.required],
      numeroBl: ['', Validators.required],
      bureau: [{value: '', disabled: true}, Validators.required],
      reference: [{value: '', disabled: true}, Validators.required],
      montantLiquidation: [{value: '', disabled: true}, [Validators.required, Validators.min(0)]],
      numeroQuittance: [{value: '', disabled: true}, Validators.required,],
      statusSortie: [{value: '', disabled: true}, Validators.required]
    });

    // this.ScheduleService.getBonSortie(reference).subscribe(res => {
    //   this.BonSortie = res
    // })
  }
  ngOnInit(): void {
    this.getDeclarationEnMemory();
  }

  onSubmit() {
    if (this.declarationForm.valid) {
      console.log('Formulaire soumis :', this.declarationForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }


  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false; // Bloque les caractères non numériques
    }
    return true; // Autorise les caractères numériques
  }


  getDeclaration(){
   this.removeItem('reference');
  let reference = this.declarationForm.value.anneeDeclaration+"GNB0"+this.declarationForm.value.codeBureau+"L"+this.declarationForm.value.numeroBl
  sessionStorage.setItem('reference', JSON.stringify(reference)); 
  sessionStorage.setItem('anneeDeclaration', JSON.stringify(this.declarationForm.value.anneeDeclaration)); 
  sessionStorage.setItem('codeBureau', JSON.stringify(this.declarationForm.value.codeBureau)); 
  sessionStorage.setItem('numeroBl', JSON.stringify(this.declarationForm.value.numeroBl)); 
   let ref = sessionStorage.getItem('reference');
   console.log(ref)

   if (ref) {
     const value = JSON.parse(ref);
     console.log(value);
      this.ScheduleService.getDeclaration(value).subscribe(res => {
      console.log(res)
      this.declarationForm.patchValue({
        codeDeclarant: res.codeDeclarant,
        codeNif: res.codeEntreprise,
        libelleDeclarant: res.office,
        bureau: res.codeOffice,
        reference: res.refLiquidation,
        montantLiquidation: res.montant,
        numeroQuittance: res.numeroQuittance,
        statusSortie: ''
      })
     })
   }
    
  }


  getDeclarationEnMemory(){
    let ref = sessionStorage.getItem('reference');
   console.log(ref)

   if (ref) {
     const value = JSON.parse(ref);
     console.log(value);
      this.ScheduleService.getDeclaration(value).subscribe(res => {
      console.log(res)
      this.declarationForm.patchValue({
        codeDeclarant: res.codeDeclarant,
        codeNif: res.codeEntreprise,
        libelleDeclarant: res.office,
        bureau: res.codeOffice,
        reference: res.refLiquidation,
        montantLiquidation: res.montant,
        numeroQuittance: res.numeroQuittance,
        statusSortie: ''
      })
     })
   }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

}




