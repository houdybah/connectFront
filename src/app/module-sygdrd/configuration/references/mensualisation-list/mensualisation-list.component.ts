import {Component, Input} from '@angular/core';
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {Unite} from "../../../models/Unite";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Mensualisation} from "../../../models/Mensualisation";
import {MensualisationService} from "../../../services/mensualisation.service";

@Component({
  selector: 'app-mensualisation-list',
  templateUrl: './mensualisation-list.component.html',
  styleUrl: './mensualisation-list.component.scss'
})
export class MensualisationListComponent {
  mensualisations: Mensualisation[] = [];
  key: string ="" ;
  pageData : PagedData<Mensualisation> = new PagedData<Mensualisation>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();
  @Input() unite : Unite | null = new Unite();

  filterMensualisation : Mensualisation[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerMensualisation !: Mensualisation;
  mensualisation: Mensualisation[]=[];

  constructor(private mensualisationService: MensualisationService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterMensualisation = this.mensualisation;
    this.getMensualisations();
  }

  getMensualisations(){
    console.log(this.pageSelected)
    this.mensualisationService.getMensualisationsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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
    this.mensualisationService.getMensualisationsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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
    this.mensualisationService.getMensualisationsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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

    if(this.pageData.page.pageNumber > 0)
    {
      this.pageNumber = this.pageNumber-1
      this.pageSelected.pageNumber = this.pageNumber
    }

    console.log(this.pageSelected)
    this.mensualisationService.getMensualisationsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherMensualisation()  {
    if(this.key.trim()===''){
      this.filterMensualisation=this.mensualisations
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.mensualisationService.getMensualisationsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,mensualisation:any) {
    this.outerMensualisation=mensualisation;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }

  openModalImp(content: any,mensualisation:any) {
    this.outerMensualisation=mensualisation;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getMensualisations();
    this.modalService.dismissAll();
  }
}








