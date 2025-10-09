import { Component, Host, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentilationParRubrique } from '../../../../../src/models/VentilationParRubrique';
import { MensualisationService } from '../../../../../src/services/mensualisation.service';
import { QuotaAnnuelService } from '../../../../../src/services/quota-annuel.service';
import { TypeProduitRubriqueService } from '../../../../../src/services/type-produit-rubrique.service';
import { VentilationService } from '../../../../../src/services/ventilation.service';
import { MensualisationListComponent } from '../mensualisation-list/mensualisation-list.component';
import { TypeProduitRubrique } from '../../../../../src/models/TypeProduitRubrique';
import { VentillationFormComponent } from '../ventillation-form/ventillation-form.component';
import Swal from 'sweetalert2';
import { PagedData } from '../../../../../src/models/PageData';
import { Page } from '../../../../../src/models/Page';
import { Mensualisation } from '../../../../../src/models/Mensualisation';
import { QuotaAnnuel } from '../../../../../src/models/QuotaAnnuel';

@Component({
  selector: 'app-ventillation-list',
  templateUrl: './ventillation-list.component.html',
  styleUrl: './ventillation-list.component.scss'
})
export class VentillationListComponent {

  //@Input() innerMensualisation:Mensualisation = new Mensualisation();

    ventillationParRubriques: VentilationParRubrique[] = [];

    key: string ="" ;
    pageData : PagedData<VentilationParRubrique> = new PagedData<VentilationParRubrique>();
    pageNumber : number = 0;
    size : number = 10;
    pageSelected : Page = new Page();
    @Input() mensualisation : Mensualisation | null = new Mensualisation();
  
     filterVentilationParRubrique : VentilationParRubrique[] | null = null;
  
    totalPage: number = 1;
    tableauPage = new Array()
    outerVentilationParRubrique !: VentilationParRubrique;
    ventilationParRubrique: VentilationParRubrique[] = [];

     

  

     constructor(public ventilationService: VentilationService,private modalService: NgbModal){ }
 
  
    ngOnInit(): void {
     this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterVentilationParRubrique = this.ventilationParRubrique;
    this.getVentilationRubrique();
    }
  
    /*** les methodes pour liste paginer de ventilation*/

     getVentilationRubrique(){
    console.log(this.pageSelected)
    this.ventilationService.getVentilationByMensualisation(this.pageSelected,this.mensualisation!.uuid).subscribe((pagedData: any) => {

     // console.log("this.mensualisation!.uuid : .....",this.mensualisation!.uuid)
      console.log(pagedData)
      this.pageData = pagedData;
      this.pageNumber = this.pageData.page.pageNumber;
      this.size = this.pageData.page.size;
    });
  }

  changeSize() {
    this.pageSelected.size = this.size
    this.pageSelected.pageNumber = this.pageNumber
    console.log(this.pageSelected)
    this.ventilationService.getVentilationByMensualisation(this.pageSelected,this.mensualisation!.uuid).subscribe((pagedData: any) => {
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
    this.ventilationService.getVentilationByMensualisation(this.pageSelected,this.mensualisation!.uuid).subscribe((pagedData: any) => {
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
    this.ventilationService.getVentilationByMensualisation(this.pageSelected,this.mensualisation!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherVentilationRubrique()  {
    if(this.key.trim()===''){
      this.filterVentilationParRubrique=this.ventilationParRubrique
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.ventilationService.getVentilationByMensualisation(this.pageSelected,this.mensualisation!.uuid).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }


    /*** end  */

  
    openModal(content: any,ventilationParRubrique:any) {
      this.outerVentilationParRubrique=ventilationParRubrique;
      this.modalService.open(content,
          {
            size: 'l',
            centered: true
          }
      );
    }
  
    closeModal() {
      this.getVentilationRubrique();
      //this.modalService.dismissAll();
    }

}








