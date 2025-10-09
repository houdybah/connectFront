import { Component } from '@angular/core';
import {Quota} from "../../../models/Quota";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {QuotaService} from "../../../services/quota.service";

@Component({
  selector: 'app-quota-list',
  templateUrl: './quota-list.component.html',
  styleUrl: './quota-list.component.scss'
})
export class QuotaListComponent {

  quotas: Quota[] = [];
  key: string ="" ;
  pageData : PagedData<Quota> = new PagedData<Quota>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterQuota : Quota[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerQuota !: Quota;
  quota: Quota[]=[];

  constructor(private quotaService: QuotaService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterQuota = this.quota;
    this.getQuotas();
  }

  getQuotas(){
    console.log(this.pageSelected)
    this.quotaService.getQuotass(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.quotaService.getQuotass(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.quotaService.getQuotass(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.quotaService.getQuotass(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherQuota()  {
    if(this.key.trim()===''){
      this.filterQuota=this.quotas
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.quotaService.getQuotass(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,quota:any) {
    this.outerQuota=quota;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }


  closeModal() {
    this.getQuotas();
    this.modalService.dismissAll();
  }

}








