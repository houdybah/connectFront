import { Component } from '@angular/core';
import {LoisFinance} from "../../../models/LoisFinance";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LoisFinanceService} from "../../../services/lois-finance.service";

@Component({
  selector: 'app-lois-finance-list',
  templateUrl: './lois-finance-list.component.html',
  styleUrl: './lois-finance-list.component.scss'
})
export class LoisFinanceListComponent {
  loisFinances: LoisFinance[] = [];
  key: string ="" ;
  pageData : PagedData<LoisFinance> = new PagedData<LoisFinance>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterLoisFinance : LoisFinance[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerLoisFinance !: LoisFinance;
  loisFinance: LoisFinance[]=[];

  constructor(private loisFinanceService: LoisFinanceService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterLoisFinance = this.loisFinance;
    this.getLoisFinances();
  }

  getLoisFinances(){
    console.log(this.pageSelected)
    this.loisFinanceService.getLoisFinancess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.loisFinanceService.getLoisFinancess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.loisFinanceService.getLoisFinancess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.loisFinanceService.getLoisFinancess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
      this.filterLoisFinance=this.loisFinances
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.loisFinanceService.getLoisFinancess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,loisFinance:any) {
    this.outerLoisFinance=loisFinance;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }


  closeModal() {
    this.getLoisFinances();
    this.modalService.dismissAll();
  }
}








