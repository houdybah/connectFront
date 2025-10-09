import { Component } from '@angular/core';
import {Journal} from "../../../models/Journal";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {JournalService} from "../../../services/journal.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrl: './journal-list.component.scss'
})
export class JournalListComponent {
  journals: Journal[] = [];
  key: string ="" ;
  pageData : PagedData<Journal> = new PagedData<Journal>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterJournal : Journal[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerJournal !: Journal;
  journal: Journal[]=[];

  constructor(private journalService: JournalService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterJournal = this.journal;
    this.getJournals();
  }

  getJournals(){
    console.log(this.pageSelected)
    this.journalService.getJournalss(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.journalService.getJournalss(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.journalService.getJournalss(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.journalService.getJournalss(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherJournal()  {
    if(this.key.trim()===''){
      this.filterJournal=this.journals
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.journalService.getJournalss(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,journal:any) {
    this.outerJournal=journal;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }


  closeModal() {
    this.getJournals();
    this.modalService.dismissAll();
  }
}








