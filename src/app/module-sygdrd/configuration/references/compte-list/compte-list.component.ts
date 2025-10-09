import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CompteService} from "../../../services/compte.service";
import {Compte} from "../../../models/Compte";
import {PagedData} from "../../../models/PageData";
import { Page } from '../../../../../src/models/Page';

@Component({
  selector: 'app-compte-list',
  templateUrl: './compte-list.component.html',
  styleUrl: './compte-list.component.scss'
})
export class CompteListComponent {

  comptes: Compte[] = [];
  key: string ="" ;
  pageData : PagedData<Compte> = new PagedData<Compte>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterCompte : Compte[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerCompte !: Compte;
  compte: Compte[]=[];

  constructor(private compteService: CompteService,private modalService: NgbModal) {}
  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterCompte = this.compte;
    this.getComptes();
  }

  getComptes(){
    console.log(this.pageSelected)
    this.compteService.getComptess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.compteService.getComptess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.compteService.getComptess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.compteService.getComptess(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherCompte()  {
    if(this.key.trim()===''){
      this.filterCompte=this.comptes
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.compteService.getComptess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
        this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

  openModal(content: any,compte:any) {
    this.outerCompte=compte;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getComptes();
    this.modalService.dismissAll();
  }

}








