import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Prevision } from '../../models/Prevision';
import {PagedData} from "../../models/PageData";
import { Page } from '../../models/Page';
import {SituationService} from "../../services/situation.service";
import {PrevisionService} from "../../services/prevision.service";



@Component({
  selector: 'app-analyse-et-prevision',
  templateUrl: './analyse-et-prevision.component.html',
  styleUrl: './analyse-et-prevision.component.scss'
})
export class AnalyseEtPrevisionComponent {

    previsions: Prevision[] = [];
    key: string ="" ;
    pageData : PagedData<Prevision> = new PagedData<Prevision>();
    pageNumber : number = 0;
    size : number = 10;
    pageSelected : Page = new Page();
  
    filterPrevision : Prevision[] | null = null;
  
    totalPage: number = 1;
    tableauPage = new Array()
    outerPrevision !: Prevision;
    prevision: Prevision[]=[];

/**
 * Variables pour la gestion des fichiers
 */
    selectedFile: File | null = null;
    message: string = '';
    isError: boolean = false;

    constructor(private fileUploadService: SituationService,private previsionService: PrevisionService,private modalService: NgbModal) {}



    ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterPrevision = this.prevision
    this.getPrevision();
  }



    getPrevision(){
    console.log(this.pageSelected)
    this.previsionService.getPrevision(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.previsionService.getPrevision(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.previsionService.getPrevision(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.previsionService.getPrevision(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }


   rechercherLoisFinance()  {
    if(this.key.trim()===''){
      this.filterPrevision=this.previsions
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.previsionService.getPrevision(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
        this.totalPage = this.pageData.page.totalPages;
       this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

  openModal(content: any,prevision:any) {
    this.outerPrevision=prevision;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }

  onFileChange2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
      this.isError = false;
    }
  }

  /**
   * 
   * @returns Methodes pour la gestion des fichiers
   */

  onUpload(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file first';
      this.isError = true;
      return;
    }

    if (!this.selectedFile.name.endsWith('.xlsx')) {
      this.message = 'Please upload a valid .xlsx file';
      this.isError = true;
      return;
    }

    this.fileUploadService.uploadExcelFile(this.selectedFile).subscribe({
      next: (response: any) => {

        Swal.fire("success","CHARGEMENT DU FICHIER EFFETUÉ AVEC SUCCES", "success").then(() => {
                    // Ouvrir le modal avec la réponse
                  //const modalRef = this.modalService.open(ParametreFormComponent);
                  //modalRef.componentInstance.data = response; // Pass response to modal
                  })
        /*this.message = response;
        this.isError = false;*/
        this.selectedFile = null;
        // Réinitialiser l'input file
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input) input.value = '';
      },
      error: (error) => {
        this.message = error.message;
        this.isError = true;
      }
    });
  }

  closeModal() {
    this.getPrevision();
    this.modalService.dismissAll();
  }

}








