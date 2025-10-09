import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/PageData';
import { TransactionFt } from '../../../../../src/models/transactionFt';
import { ApiResponse, SituationService } from '../../../../../src/services/situation.service';
import Swal from 'sweetalert2';
import { ParametreFormComponent } from '../../parametres/parametre-form/parametre-form.component';

@Component({
  selector: 'app-transaction-ft',
  templateUrl: './transaction-ft.component.html',
  styleUrl: './transaction-ft.component.scss'
})
export class TransactionFtComponent {

    transactionFts: TransactionFt[] = [];
    dateDebut: string ="";
    dateFin: string ="" ;
    pageData : PagedData<TransactionFt> = new PagedData<TransactionFt>();
    pageNumber : number = 0;
    size : number = 10;
    pageSelected : Page = new Page();
    filterTransactionFt : TransactionFt[] | null = null;
  
    totalPage: number = 1;
    tableauPage = new Array()
    outeTransactionFt !: TransactionFt;
    transactionFt: TransactionFt[]=[];

    // New properties for loading spinner and date validation
    isLoading: boolean = false;
    dateError: string | null = null;

    /** Uploding file FT variable */
     selectedFile: File | null = null;
     message: string = '';
     isError: boolean = false;
     isData: boolean = false;
     /** end */
  
    constructor(private situationService: SituationService,private modalService: NgbModal) {}
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  upload(): void {
    if (!this.selectedFile) {
      Swal.fire("ERROR"," VEUILLEZ SELECTIONNER UN FICHIER ", "error")
      return;
    } 
    if (this.selectedFile) {
      this.situationService.uploadFileF(this.selectedFile).subscribe({
        next: (response: ApiResponse) => {
          Swal.fire("success","CHARGEMENT DU FICHIER EFFETUÉ AVEC SUCCES", "success").then(() => {
            // Ouvrir le modal avec la réponse
          const modalRef = this.modalService.open(ParametreFormComponent);
          modalRef.componentInstance.data = response; // Pass response to modal
          this.getFtBCRG();
          })
          
        },
        error: (error) => {
          console.error('Error:', error);
          // Ouvrir le modal d'erreur
          //const modalRef = this.modalService.open(ParametreFormComponent);
          //modalRef.componentInstance.data = { message: "ERREUR DE CHARGEMENT DU FICHIER : Veuillez selectionner un fichier CSV", error };
          Swal.fire("ERROR","CHARGEMENT DU FICHIER : Veuillez selectionner un fichier CSV", "error")
        }
      });
      
    }
  }
  
    ngOnInit(): void {
      this.pageSelected.pageNumber=this.pageNumber
      this.pageSelected.size=this.size;
      this.filterTransactionFt = this.transactionFt;
      this.getFtBCRG();
    }

     validateDates(): boolean {
    this.dateError = null; // Reset error
    if (this.dateDebut && this.dateFin) {
      const startDate = new Date(this.dateDebut);
      const endDate = new Date(this.dateFin);
      if (startDate > endDate) {
        this.dateError = "La date de début ne peut pas être postérieure à la date de fin.";
        return false;
      }
    }
    return true;
  }

  onDateChange(): void {
    this.validateDates();
  }
  
    getFtBCRG(){
      console.log(this.pageSelected)
      this.situationService.getFt(this.pageSelected,"","").subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  
    changeSize() {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = this.pageNumber
      console.log(this.pageSelected)
       this.situationService.getFt(this.pageSelected,this.dateDebut,this.dateFin).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
        console.log(this.totalPage)
      });
    }
  
    prochainePage() {
      this.pageSelected.size = this.size
      if(this.pageData.page.pageNumber<this.pageData.page.totalPages-1){
        this.pageNumber = this.pageNumber+1
        this.pageSelected.pageNumber = this.pageNumber
      }
  
      console.log(this.pageSelected)
       this.situationService.getFt(this.pageSelected,this.dateDebut,this.dateFin).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
        // this.pageSelected.pageNumber = this.pageNumber
        console.log(this.totalPage)
      });
  
    }
  
    precedentPage(){
      this.pageSelected.size = this.size
  
      if(this.pageData.page.pageNumber > 0){
        this.pageNumber = this.pageNumber-1
        this.pageSelected.pageNumber = this.pageNumber
      }
  
      console.log(this.pageSelected)
        this.situationService.getFt(this.pageSelected,this.dateDebut,this.dateFin).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
        // this.pageSelected.pageNumber = this.pageNumber
        console.log(this.totalPage)
  
      });
    }
  
    rechercherFtBCRG()  {
      if(this.dateDebut.trim()==='' && this.dateFin.trim()===''){
        this.filterTransactionFt=this.transactionFts
      }
      else {
        this.pageSelected.size = this.size
        this.pageSelected.pageNumber = 0
        this.pageNumber = 0
         this.situationService.getFt(this.pageSelected,this.dateDebut,this.dateFin).subscribe((pagedData: any) => {
          console.log(pagedData)
          this.pageData = pagedData;
          this.pageNumber = this.pageData.page.pageNumber;
          this.size = this.pageData.page.size;
          this.totalPage = this.pageData.page.totalPages;
          this.tableauPage.length = this.pageData.page.totalPages;
        });
      }
    }
  
    openModal(content: any,transactionft:any) {
      this.outeTransactionFt=transactionft;
      this.modalService.open(content,
          {
            size: 'lg',
            centered: true
          }
      );
    }
  
  
    closeModal() {
      this.getFtBCRG;
      this.modalService.dismissAll();
    }

}








