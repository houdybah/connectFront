import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Transaction} from "../../models/Transaction";
import {TransactionService} from "../../services/transaction.service";
import {UtilisateurService} from "../../services/utilisateur.service";
import {DetailTransaction} from "../../models/DetailTransaction";

@Component({
  selector: 'app-list-payement',
  templateUrl: './list-payement.component.html',
  styleUrl: './list-payement.component.scss'
})
export class ListPayementComponent {
  transactions: any[] = [];
  totalItems: number = 0;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  role ={ isDouane: false, isGuceg: false, isDeclarant: false} 
  parentProperty: any;
  title: string = "Statut de validation du paiement";
  transaction = new Transaction();
  constructor(private TransactionService: TransactionService,private utilisateurService:UtilisateurService,private modalService: NgbModal) {}

  filters = { startDate: '', endDate: '', status: '' };

  ngOnInit(): void {
    this.getTransaction();

   // this.getRole()
    
  }

  getRole(){  
   this.utilisateurService.currentLogin().subscribe(res => {
      switch (res.roles[0]) {
        case 'DOUANE':
          this.role.isDouane = true
          break;
        case 'GUCEG':
          this.role.isGuceg = true
          break;
        case 'Declarant':
          this.role.isDeclarant = true
          break;  
        default:
          break;
      }
   })
  }

  getDate(){
    const currentDate = new Date();
    const dateString3 = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    return dateString3;
  }

  getTransaction(): void {
    this.getRole()
    this.TransactionService.getTransactions().subscribe((data) => {
      console.log(data)

      if(this.role.isDeclarant){
        data.data.map((res: any) =>{
          if(res.avisDouane === "VALID" && res.avisGuceg === "VALID"){
            this.transactions.push(res) 
          }
        })
      }else if(this.role.isGuceg){
        data.data.map((res: any) =>{
          if(res.avisDouane === "VALID"){
            this.transactions.push(res) 
          }
        })
      } else{
        this.transactions = data.data;
      }

    
      this.totalItems = data.page.totalPages;
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.getTransaction();
  }

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  //   this.getTransaction();
  // }

  onSearch(): void {
    this.currentPage = 0;
    this.getTransaction();
  }

  // get filteredDeclarations() {
  //   return this.declarations.filter(Declaration => {
  //     const matchesDate = (!this.filters.startDate || new Date(Declaration.date) >= new Date(this.filters.startDate)) &&
  //                         (!this.filters.endDate || new Date(Declaration.date) <= new Date(this.filters.endDate));
  //     const matchesStatus = !this.filters.status || Declaration.status === this.filters.status;
  //     return matchesDate && matchesStatus;
  //   });
  // }

  toggleAllSelection(event: any) {
    const isChecked = event.target.checked;
    this.transactions.forEach(Declaration => Declaration.selected = isChecked);
  }

  validateSelected() {
    const selectedDeclarations = this.transactions.filter(d => d.selected);
    if (selectedDeclarations.length === 0) {
      alert('Aucune déclaration sélectionnée.');
      return;
    }
    selectedDeclarations.forEach(d => d.status = 'Validée');
  //  alert(`${selectedDeclarations.length} déclaration(s) validée(s).`);

    console.log(selectedDeclarations);

    this.TransactionService.createTransactionGucegAndDeclarant(selectedDeclarations).subscribe(res => {
      console.log(res)
      if (res.status === "200") {
        Swal.fire({
          title: "Validation approuvée!",
          text: `${res.description}`,
          icon: "success"
        }).then((result: { isConfirmed: any; }) => {
          if (res.status === "200") {
        
      }})}
    })
  }

  downloadPDF(Declaration: any) {
  //  this.pdfService.generatePDF(Declaration);
  }

  exportToExcel() {
  //  this.excelService.exportAsExcelFile(this.filteredDeclarations, 'Declarations');
  }

  onValideGuceg(detail:DetailTransaction,status:any){
    this.TransactionService.getTransaction(detail.uuid).subscribe(res => {
      detail.avisGuceg = status
      this.transaction.detailTransactionDtos.map((d: DetailTransaction) => {
        if(d.uuid === detail.uuid){
          d = detail;
        }
      }) 
      // this.TransactionService.createTransaction(this.transaction).subscribe(res => {
      //   console.log(res)
      //   if (res.status == 200) {
      //     Swal.fire({
      //       title: "Validation approuvée!",
      //       text: `${res.description}`,
      //       icon: "success"
      //     }).then((result: { isConfirmed: any; }) => {
      //       if (res.status == 200) {
      //         this.getTransaction()
      //       }
      //     })
      //   }
      // })
    })
   
  }

  onValideDeclarant(detail:DetailTransaction,status:any){
    // detail.avisDeclarant = status
    // console.log(detail)
    // this.transaction.detailTransactionDtos.push(detail);
    // this.TransactionService.createTransaction(this.transaction).subscribe(res => {
    //   console.log(res)
    //   if (res.status == 200) {
    //     Swal.fire({
    //       title: "Validation paiemnent effectue!",
    //       text: `${res.description}`,
    //       icon: "success"
    //     }).then((result: { isConfirmed: any; }) => {
    //       if (res.status == 200) {
    //         this.getTransaction()
    //       }
    //     })
    //   }
    // })

    this.TransactionService.getTransaction(detail.uuid).subscribe(res => {
      detail.avisDeclarant = status
      this.transaction.detailTransactionDtos.map((d: DetailTransaction) => {
        if(d.uuid === detail.uuid){
          d = detail;
        }
      }) 
      // this.TransactionService.createTransaction(this.transaction).subscribe(res => {
      //   console.log(res)
      //   if (res.status == 200) {
      //     Swal.fire({
      //       title: "Validation approuvée!",
      //       text: `${res.description}`,
      //       icon: "success"
      //     }).then((result: { isConfirmed: any; }) => {
      //       if (res.status == 200) {
      //         this.getTransaction()
      //       }
      //     })
      //   }
      // })
    })
  }

  openModal(content: any,statut:any) {
   this.title = "Statut de validation du paiement"
  
    this.modalService.open(content, { size: 'lg', centered: true });
    this.parentProperty = statut;
  }

  toggleCheck(row: any) {
    row.checked = !row.checked;
  }

   // Vérifie si au moins un élément est sélectionné
   get isAnySelected(): boolean {
    return this.transactions.some(item => item.selected);
  }


  

}




