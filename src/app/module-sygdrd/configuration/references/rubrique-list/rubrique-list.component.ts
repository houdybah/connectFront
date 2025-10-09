import { Component } from '@angular/core';
import {Rubrique} from "../../../models/Rubrique";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {RubriqueService} from "../../../services/rubrique.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-rubrique-list',
  templateUrl: './rubrique-list.component.html',
  styleUrl: './rubrique-list.component.scss'
})
export class RubriqueListComponent {

  rubriques: Rubrique[] = [];
  key: string ="" ;
  pageData : PagedData<Rubrique> = new PagedData<Rubrique>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterRubrique : Rubrique[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerRubrique !: Rubrique;
  rubrique: Rubrique[]=[];

  constructor(private rubriqueService: RubriqueService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterRubrique = this.rubrique;
    this.getRubriques();
  }

  getRubriques(){
    console.log(this.pageSelected)
    this.rubriqueService.getRubriquess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.rubriqueService.getRubriquess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.rubriqueService.getRubriquess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.rubriqueService.getRubriquess(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherRubrique()  {
    if(this.key.trim()===''){
      this.filterRubrique=this.rubriques
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.rubriqueService.getRubriquess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
         this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
        
      });
    }
  }

  openModal(content: any,rubrique:any) {
    this.outerRubrique=rubrique;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getRubriques();
    this.modalService.dismissAll();
  }

}








