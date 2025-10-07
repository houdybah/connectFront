import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../models/Transaction";
import {DetailTransaction} from "../../models/DetailTransaction";
import {ReferenceTransaction} from "../../models/ReferenceTransaction";
import {Company} from "../../models/Company";



interface Declaration {
  numeroBl: string;
  montantLiquidation: number;
  montantToBePay:number;
  references: Reference[];
}

interface Reference {
  typeReference: string;
  numeroReference: string;
  montant: number;
}
@Component({
  selector: 'app-form-transaction',
  templateUrl: './form-transaction.component.html',
  styleUrl: './form-transaction.component.scss'
})
export class FormTransactionComponent  implements OnInit {
  transactionForm!: FormGroup;
  companyData: any;
  isDisabled:boolean = true;
  constructor(private fb: FormBuilder,private TransactionService :TransactionService) {
    this.createForm();
  }

  ngOnInit() {
   //this.transactionForm.get('codeDeclarant')?.disable();
    // this.transactionForm.controls['codeNif'].disable();
  
  }

  createForm() {
    this.transactionForm = this.fb.group({
      codeDeclarant: ['', Validators.required],
      date: ['', Validators.required],
      codeNif: ['', Validators.required],
      office: ['', Validators.required],
      montantTransaction: [0, Validators.required],
      declarations: this.fb.array([])
    });

    // this.transactionForm.controls['codeDeclarant'].disable();
    // this.transactionForm.controls['codeNif'].disable();
  }



  get declarations() {
    return this.transactionForm.get('declarations') as FormArray;
  }

  addDeclaration() {
    const Declaration = this.fb.group({
      numeroBl: ['', Validators.required],
      montantLiquidation: [0, [Validators.required, Validators.min(0)]],
      montantToBePay: [0, [Validators.required, Validators.min(0)]],
      references: this.fb.array([])
    });
    this.declarations.push(Declaration);
    // Declaration.controls.montantLiquidation.disable();
    // Declaration.controls.montantToBePay.disable();
  }

  removeDeclaration(index: number) {
    this.declarations.removeAt(index);
  }

  getReferences(Declaration: any) {
    return Declaration.get('references') as FormArray;
  }

  addReference(Declaration: any) {
    const reference = this.fb.group({
      typeReference: ['', Validators.required],
      numeroReference: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
     
    });
    this.getReferences(Declaration).push(reference);
  }

  removeReference(Declaration: any, index: number) {
    this.getReferences(Declaration).removeAt(index);
  }

  getSommeReferences(Declaration: any): number {
   // console.log(Declaration)
    const references = this.getReferences(Declaration).value;
    let total = references.reduce((sum: number, ref: Reference) => sum + (ref.montant || 0), 0);
    this.refreshMontantToBePay(total,Declaration);
    return total;
    
  }

  refreshMontantToBePay(total:number,Declaration:any){
    Declaration.patchValue({
      montantToBePay:total,
    })
  }


  onSubmit() {
    if (this.transactionForm.valid) {

      let transaction = new Transaction();
      transaction.codeDeclarant = this.transactionForm.value.codeDeclarant;
      transaction.dateTransaction = this.transactionForm.value.date;
      transaction.codeEntreprise = this.transactionForm.value.codeNif;
      transaction.office = this.transactionForm.value.office;
      transaction.montantTransaction = this.transactionForm.value.montantTransaction
      transaction.nombreDeclaration = this.transactionForm.value.declarations.length;

      let declarations = this.transactionForm.value.declarations;

      for (let index = 0; index < declarations.length; index++) {
        const element = declarations[index];

        let Declaration = new DetailTransaction();
        const dateObject = new Date(transaction.dateTransaction);
        Declaration.montantLiquidation = element.montantToBePay;
        Declaration.numeroBl = element.numeroBl
        Declaration.montantToBePay = element.montantToBePay
        Declaration.referenceBl = dateObject.getFullYear()+""+transaction.office+"L"+Declaration.numeroBl;

        let references = element.references;

        for (let index = 0; index < references.length; index++) {
          const ref = references[index];
          let reference = new ReferenceTransaction();
          reference.enumTypePaiement = ref.typeReference;
          reference.montant = ref.montant;
          reference.reference = ref.numeroReference;

          Declaration.referenceTransactionDtos.push(reference);
          
        }
        transaction.detailTransactionDtos.push(Declaration);
        if(this.onCompareTransactionBillToAllDeclaration()){
          this.TransactionService.createTransaction(transaction).subscribe(res => {
            console.log(res)
            if(res.status === "200"){
              Swal.fire({
                title: "Enregistrement effectué!",
                text: `Transaction enregistrer avec success`,
                icon: "success"
              }).then((result: { isConfirmed: any; }) => {
                this.transactionForm.reset();
                for (let index = 0; index < declarations.length; index++) {
                  this.removeDeclaration(index)
                }
              })
            }
          })
    
         
        }else{
          if(this.transactionForm.value.declarations.length > 1){
            Swal.fire({
              title: "Transaction echoue!",
              text: `Le montant de la transaction ne correspond pas au montant des declarations`,
              icon: "error"
            }).then((result: { isConfirmed: any; }) => {
             // this.transactionForm.reset();
            })
          }else{
            Swal.fire({
              title: "Transaction echoue!",
              text: `Le montant de la transaction ne correspond pas au montant de la Declaration`,
              icon: "error"
            }).then((result: { isConfirmed: any; }) => {
            //  this.transactionForm.reset();
            })
          }
        }

       
        
      }



      // // transaction.detailTransactionDtos = this.transactionForm.value.declarations;
      // transaction.montantTransaction = this.transactionForm.value.montantTransaction;
      // //console.log(transaction);
      
      // var somme = 0;
      // for (let i = 0; i < this.transactionForm.value.declarations.length; i++) {
      //   somme += this.transactionForm.value.declarations[i].montantLiquidation;
      // }
      // console.log(somme);
      // console.log(this.transactionForm.value.montantTransaction);

      // if(this.transactionForm.get('montantTransaction')?.value === somme){
      //   console.log('Transaction enregistrée:', this.transactionForm.value);


      // }

     
    }
  }



    getCompany(Declaration:any) {
      const dateObject = new Date(this.transactionForm.get('date')?.value);
      const reference = dateObject.getFullYear()+""+this.transactionForm.get('office')?.value+"L"+Declaration.get('numeroBl')?.value
      console.log(reference)
      
      if(this.transactionForm.get('office')?.valid && Declaration.get('numeroBl')?.valid && this.transactionForm.get('date')?.valid){
        return this.TransactionService.getcompany(reference).subscribe(res =>{
          this.companyData =res; 
          console.log(res.montant)
          // this.displayInfoPaiement(this.companyData)
          // Declaration.setValue({
          //   montantLiquidation: this.companyData.montant
          // })
          this.displayInfoPaiement(this.companyData,Declaration)
          console.log(Declaration)
        })
      }
  
      return this.TransactionService.getcompany(reference).subscribe(res =>{
        this.companyData =res; 
        // Declaration.setValue({
        //   montantLiquidation: this.companyData.montant
        // })

        this.displayInfoPaiement(this.companyData,Declaration)
       console.log(res)
      })
    }
  
    // display(){
  
    // }
  
    displayInfoPaiement(res:Company,Declaration:any){
      Declaration.patchValue({
        montantLiquidation: res.montant,
      })
  
      this.transactionForm.patchValue({
        codeDeclarant:res.codeDeclarant,
        codeNif:res.codeEntreprise
      })
  
      // this.transactionForm.get('declarantCode')?.disable();
      // this.transactionForm.get('nifCode')?.disable();
      // this.transactionForm.get('declarationAmount')?.disable();
    }

    onCompareTransactionBillToAllDeclaration():boolean{
        let isCheck = false;

         let montantTransaction = this.transactionForm.value.montantTransaction
         let declarations =    this.transactionForm.value.declarations;
         let sommeDeclaration = 0;

         for (let index = 0; index < declarations.length; index++) {
          const element = declarations[index];
          sommeDeclaration +=element.montantToBePay;
         }

         if(montantTransaction === sommeDeclaration){
          isCheck = true;
         }

        return isCheck;
    }
}






