import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Company} from "../../models/Company";
import {Transaction} from "../../models/Transaction";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-form-payement',
  templateUrl: './form-payement.component.html',
  styleUrl: './form-payement.component.scss'
})
export class FormPayementComponent implements OnInit {
  // transactionForm: FormGroup;
  // companyData: any;
  transaction = new Transaction();

  paymentForm: FormGroup;
  payments: Array<{ enumTypePaiement: string; reference: string; montant: number }> =
    [];
  companyData!: Company;
  concatenatedReferences: string = "";
  totalMontantDecralaration: number = 0;

  // constructor(private fb: FormBuilder,private transactionSevice: TransactionService) {
  //   this.transactionForm = this.fb.group({
  //     // Section 1: Date, Bureau, Numéro BL
  //     date: ['', Validators.required],
  //     bureau: ['', Validators.required],
  //     numeroBl: ['', Validators.required],
      
  //     // Section 2: Code Déclarant, Code NIF, Montant à payer
  //     codeDeclarant: ['', Validators.required],
  //     codeNif: ['', Validators.required],
  //     montantAPayer: ['', [Validators.required, Validators.min(0)]],
      
  //     // Section 3: Type de paiement, Référence, Montant payé
  //     typePaiement: ['', Validators.required],
  //     reference: ['', Validators.required],
  //     montantPaye: ['', [Validators.required, Validators.min(0)]]
  //   });
  // }


  constructor(private fb: FormBuilder,private TransactionService :TransactionService) {
    this.paymentForm = this.fb.group({
      declarationDate: [''],
      bureau: [''],
      numeroBl: [''],
      declarantCode: [''],
      nifCode: [''],
      declarationAmount: [0],
    });
  }

  ngOnInit(): void {

  }

  getCompany() {
    const dateObject = new Date(this.paymentForm.get('declarationDate')?.value);
    const reference = dateObject.getFullYear()+""+this.paymentForm.get('bureau')?.value+"L"+this.paymentForm.get('numeroBl')?.value
    console.log(reference)
    
    if(this.paymentForm.get('bureau')?.valid && this.paymentForm.get('numeroBl')?.valid && this.paymentForm.get('date')?.valid){
      return this.TransactionService.getcompany(reference).subscribe(res =>{
        this.companyData =res; 
        this.displayInfoPaiement(this.companyData)
        console.log(res)
      })
    }

    return this.TransactionService.getcompany(reference).subscribe(res =>{
      this.companyData =res; 
      this.displayInfoPaiement(this.companyData)
      console.log(res)
    })
  }

  // display(){

  // }

  displayInfoPaiement(res:Company){
    this.paymentForm.patchValue({
      declarantCode: res.codeDeclarant,
      nifCode: res.codeEntreprise,
      declarationAmount: res.montant
    })

    

    this.paymentForm.get('declarantCode')?.disable();
    this.paymentForm.get('nifCode')?.disable();
    this.paymentForm.get('declarationAmount')?.disable();
  }

  // onSubmit() {
  //   if (this.transactionForm.valid) {
      // console.log('Transaction enregistrée:', this.transactionForm.value);
      // const dateObject = new Date(this.transactionForm.get('date')?.value);
      // const reference = dateObject.getFullYear()+""+this.transactionForm.get('bureau')?.value+"L"+this.transactionForm.get('numeroBl')?.value
      // this.transaction.date = this.transactionForm.get('date')?.value;
      // this.transaction.office = this.transactionForm.get('bureau')?.value;
      // this.transaction.numeroBl = this.transactionForm.get('numeroBl')?.value;
      // this.transaction.referenceBl = reference;
      // this.transaction.codeDeclarant = this.transactionForm.get('codeDeclarant')?.value;
      // this.transaction.codeEntreprise = this.transactionForm.get('codeNif')?.value;
      // this.transaction.enumTypePaiement = this.transactionForm.get('typePaiement')?.value;
  //     this.transaction.reference = this.transactionForm.get('reference')?.value;
  //     this.transaction.montant = this.transactionForm.get('montantAPayer')?.value;
      

    //     this.transactionSevice.createTransaction(this.transaction).subscribe(
    //       res => {
    //         Swal.fire({
    //           title: "Enregistrement effectué!",
    //           text: `${res.description}`,
    //           icon: "success"
    //         }).then((result: { isConfirmed: any; }) => {
    //           if (res.status == 200) {
    //             this.transactionForm.reset();
    //           }
    //         })
           
    //       },
    //       error => {
    //         alert('Une erreur s\'est produite lors de l\'enregistrement de la transaction.');
    //       }
    //     )
    // } else {
    //   alert('Veuillez remplir tous les champs obligatoires!');
    // }
  // }


  // checkAmount(){
  //   const dateObject = new Date(this.transactionForm.get('date')?.value);
  //   const reference = dateObject.getFullYear()+""+this.transactionForm.get('bureau')?.value+"L"+this.transactionForm.get('numeroBl')?.value

  //   this.transactionSevice.checkTransactionAmount(reference, this.transactionForm.get('montantPaye')?.value).subscribe(res => {
  //     if(res){
  //       this.onSubmit()
  //     }else{
  //       alert('Le montant payé ne correspond pas au montant à payer')
  //     }
  //   })
  // }



  totalAmount: number = 0;



  addPayment() {
    this.payments.push({ enumTypePaiement: '', reference: '', montant: 0 });
  }

  removePayment(index: number) {
    this.payments.splice(index, 1);
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    this.totalAmount = this.payments.reduce((sum, payment) => {
      return sum + (payment.montant || 0);
    }, 0);
  }

  onSubmit() {
    if (this.paymentForm.valid) {


      
      console.log('Transaction enregistrée:', this.paymentForm.value);
      const dateObject = new Date(this.paymentForm.get('declarationDate')?.value);
      const reference = dateObject.getFullYear()+""+this.paymentForm.get('bureau')?.value+"L"+this.paymentForm.get('numeroBl')?.value
      // this.transaction.date = this.paymentForm.get('declarationDate')?.value;
      // this.transaction.office = this.paymentForm.get('bureau')?.value;
      // this.transaction.numeroBl = this.paymentForm.get('numeroBl')?.value;
      // this.transaction.referenceBl = reference;
      // this.transaction.codeDeclarant = this.paymentForm.get('codeDeclarant')?.value;
      // this.transaction.codeEntreprise = this.paymentForm.get('codeNif')?.value;
      // this.calculateResults()     
      // this.transaction.reference = this.concatenatedReferences.replace(/\s+/g, '');
      // this.transaction.montant = this.totalMontantDecralaration;
    
      // this.transaction.referenceTransactionDtos = this.payments;

      // if(this.payments.length >=2){
      //   this.transaction.enumTypePaiement = "FT"
      // }else{
      //     this.transaction.reference = this.payments[0].enumTypePaiement;
      // }


         console.log(this.transaction)
      this.TransactionService.createTransaction(this.transaction).subscribe(
        // res => {
        //   Swal.fire({
        //     title: "Enregistrement effectué!",
        //     text: `${res.description}`,
        //     icon: "success"
        //   }).then((result: { isConfirmed: any; }) => {
        //     if (res.status == 200) {
        //       this.paymentForm.reset();
        //     }
        //   })
         
        // },
        // error => {
        //   alert('Une erreur s\'est produite lors de l\'enregistrement de la transaction.');
        // }
      )
      const formData = {
        ...this.paymentForm.value,
        payments: this.payments,
        totalAmount: this.totalAmount,
      };
      
      }

      
     // console.log('Form Data:', formData);
      // Envoyer les données au backend ou les traiter
    }



  calculateResults() {
    // Concaténer les références
    this.concatenatedReferences = this.payments
      .map((transaction: { reference: any; }) => transaction.reference)
      .join(' - ');


    // Calculer la somme des montants
    this.totalMontantDecralaration = this.payments.reduce(
      (sum: any, transaction: { montant: any; }) => sum + transaction.montant,
      0
    );

   
  }
  }










