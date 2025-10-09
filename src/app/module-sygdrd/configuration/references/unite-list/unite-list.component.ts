import { Component } from '@angular/core';
import {Unite} from "../../../models/Unite";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {UniteService} from "../../../services/unite.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-unite-list',
  templateUrl: './unite-list.component.html',
  styleUrl: './unite-list.component.scss'
})
export class UniteListComponent {

  unites: Unite[] = [];
  key: string ="" ;
  pageData : PagedData<Unite> = new PagedData<Unite>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterUnite : Unite[] | null = null;

  // New properties for loading spinner and date validation
  isLoading: boolean = false;

  totalPage: number = 1;
  tableauPage = new Array()
  outerUnite !: Unite;
  unite: Unite[]=[];

  constructor(private uniteService: UniteService,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterUnite = this.unite;
    this.getUnites();
  }

  getUnites(){
    console.log(this.pageSelected)
    this.uniteService.getUnitess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.uniteService.getUnitess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.uniteService.getUnitess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.uniteService.getUnitess(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      console.log(this.totalPage)

    });
  }

  rechercherUnite()  {
    if(this.key.trim()===''){
      this.filterUnite=this.unites
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.uniteService.getUnitess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

  openModal(content: any,unite:any) {
    this.outerUnite=unite;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }

  openModalOrg(content: any,unite:any) {
    this.outerUnite=unite;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }


  closeModal() {
    this.getUnites();
    this.modalService.dismissAll();
  }

}








