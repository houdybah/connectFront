import { Component } from '@angular/core';
import {Exercice} from "../../../models/Exercice";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExerciceService} from "../../../services/exercice.service";

@Component({
  selector: 'app-exercice-list',
  templateUrl: './exercice-list.component.html',
  styleUrl: './exercice-list.component.scss'
})
export class ExerciceListComponent {

  exercices: Exercice[] = [];
  key: string ="" ;
  pageData : PagedData<Exercice> = new PagedData<Exercice>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterExercice : Exercice[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerExercice !: Exercice;
  exercice: Exercice[]=[];

  constructor(private exerciceService: ExerciceService,private modalService: NgbModal) {}



  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterExercice = this.exercice;
    this.getExercices();
  }

  getExercices(){
    console.log(this.pageSelected)
    this.exerciceService.getExercicess(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.exerciceService.getExercicess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.exerciceService.getExercicess(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.exerciceService.getExercicess(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherExercice()  {
    if(this.key.trim()===''){
      this.filterExercice=this.exercices
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.exerciceService.getExercicess(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
        this.totalPage = this.pageData.page.totalPages;
        this.tableauPage.length = this.pageData.page.totalPages;
      });
    }
  }

  openModal(content: any,exercice:any) {
    this.outerExercice=exercice;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getExercices();
    this.modalService.dismissAll();
  }

}








