import { Component } from '@angular/core';
import {NatureRecette} from "../../../models/NatureRecette";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NatureRecetteService} from "../../../services/nature-recette.service";

@Component({
  selector: 'app-nature-recette-list',
  templateUrl: './nature-recette-list.component.html',
  styleUrl: './nature-recette-list.component.scss'
})
export class NatureRecetteListComponent {

  natureRecettes: NatureRecette[] = [];
  key: string ="" ;
  pageData : PagedData<NatureRecette> = new PagedData<NatureRecette>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterNatureRecette : NatureRecette[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerNatureRecette !: NatureRecette;
  natureRecette: NatureRecette[]=[];

  constructor(private natureRecetteService: NatureRecetteService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterNatureRecette = this.natureRecette;
    this.getNatureRecettes();
  }

  getNatureRecettes(){
    console.log(this.pageSelected)
    this.natureRecetteService.getNatureRecettess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.natureRecetteService.getNatureRecettess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.natureRecetteService.getNatureRecettess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.natureRecetteService.getNatureRecettess(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherNatureRecette()  {
    if(this.key.trim()===''){
      this.filterNatureRecette=this.natureRecettes
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.natureRecetteService.getNatureRecettess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,natureRecette:any) {
    this.outerNatureRecette=natureRecette;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getNatureRecettes();
    this.modalService.dismissAll();
  }

}








