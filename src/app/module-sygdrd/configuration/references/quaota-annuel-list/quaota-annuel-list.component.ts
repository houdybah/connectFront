import {Component, Input} from '@angular/core';
import {QuotaAnnuel} from "../../../models/QuotaAnnuel";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Unite} from "../../../models/Unite";
import {QuotaAnnuelService} from "../../../services/quota-annuel.service";

@Component({
  selector: 'app-quaota-annuel-list',
  templateUrl: './quaota-annuel-list.component.html',
  styleUrl: './quaota-annuel-list.component.scss'
})
export class QuaotaAnnuelListComponent {
  quotaAnnuels: QuotaAnnuel[] = [];
  key: string ="" ;
  pageData : PagedData<QuotaAnnuel> = new PagedData<QuotaAnnuel>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();
  @Input() unite : Unite | null = new Unite();

  filterQuotaAnnuel : QuotaAnnuel[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerQuotaAnnuel !: QuotaAnnuel;
  quotaAnnuel: QuotaAnnuel[]=[];

  constructor(private quotaAnnuelService: QuotaAnnuelService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterQuotaAnnuel = this.quotaAnnuel;
    this.getQuotaAnnuels();
  }

  getQuotaAnnuels(){
    console.log(this.pageSelected)
    this.quotaAnnuelService.getQuotaAnnuelsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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
    this.quotaAnnuelService.getQuotaAnnuelsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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
    this.quotaAnnuelService.getQuotaAnnuelsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
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
    this.quotaAnnuelService.getQuotaAnnuelsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherQuotaAnnuel()  {
    if(this.key.trim()===''){
      this.filterQuotaAnnuel=this.quotaAnnuels
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.quotaAnnuelService.getQuotaAnnuelsByUnite(this.pageSelected,this.unite!.uuid).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,quotaAnnuel:any) {
    this.outerQuotaAnnuel=quotaAnnuel;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }

  openModalImp(content: any,quotaAnnuel:any) {
    this.outerQuotaAnnuel=quotaAnnuel;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getQuotaAnnuels();
    this.modalService.dismissAll();
  }
}








