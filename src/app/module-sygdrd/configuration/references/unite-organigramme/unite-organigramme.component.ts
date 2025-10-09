import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Unite} from "../../../models/Unite";
import {UniteService} from "../../../services/unite.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Page} from "../../../models/Page";
import {PagedData} from "../../../models/PageData";

@Component({
  selector: 'app-unite-organigramme',
  templateUrl: './unite-organigramme.component.html',
  styleUrl: './unite-organigramme.component.scss'
})
export class UniteOrganigrammeComponent {

  breadCrumbItems!: Array<{}>;
  outerUnite: any;
  key: string ="" ;
  pageData : PagedData<Unite> = new PagedData<Unite>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterUnite : Unite[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  unite: Unite[]=[];



  constructor(private uniteService: UniteService,private modalService: NgbModal) {}


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion Unité', active: true }
    ];
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterUnite = this.unite;
    this.loadData();
  }

  loadData(): void {
    console.log(this.pageSelected)
    this.uniteService.getUnitess(this.pageSelected, "").subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.pageNumber = this.pageData.page.pageNumber;
      this.size = this.pageData.page.size;
      this.pageSelected.pageNumber=this.pageNumber
      this.pageSelected.size=this.size;
      this.totalPage=pagedData.page.totalPages;
    });
  }

  recherche(): void {
    this.pageSelected.pageNumber=0
    this.pageSelected.size=this.size;
    this.uniteService.getUnitess(this.pageSelected, this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.pageNumber = this.pageData.page.pageNumber;
      this.size = this.pageData.page.size;
      this.pageSelected.pageNumber=this.pageNumber
      this.pageSelected.size=this.size;
      this.totalPage=pagedData.page.totalPages;
    });
  }

  changeSize() {
    this.pageSelected.size = this.size
    this.pageSelected.pageNumber = this.pageNumber
    console.log(this.pageSelected)
    this.uniteService.getUnitess(this.pageSelected, "").subscribe((pagedData: any) => {
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
    this.uniteService.getUnitess(this.pageSelected, "").subscribe((pagedData: any) => {
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
    this.uniteService.getUnitess(this.pageSelected, "").subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  // Calculer le nombre d'enfants pour chaque nœud (enfants directs + sous-enfants)
  calculateChildCounts(node: Unite | null): number {
    if (!node || !node.children || node.children.length === 0) {
      return 0;
    }
    let count = node.children.length;

    node.children.forEach((child: any) => {
      count += this.calculateChildCounts(child);
    });

    node.childCount = count;
    return count;
  }



  openModal(content: any,unite:any) {
    this.outerUnite=unite;
    this.modalService.open(content,
        {
          size: 'xl',
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


  closeModal(saved: boolean = false) {
    this.loadData();
    this.modalService.dismissAll();
  }


}








