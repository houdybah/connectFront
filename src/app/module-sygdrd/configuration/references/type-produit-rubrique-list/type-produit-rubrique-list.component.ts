import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NatureRecette } from '../../../../../src/models/NatureRecette';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/PageData';
import { TypeProduitRubrique } from '../../../../../src/models/TypeProduitRubrique';
import { TypeProduitRubriqueService } from '../../../../../src/services/type-produit-rubrique.service';

@Component({
  selector: 'app-type-produit-rubrique-list',
  templateUrl: './type-produit-rubrique-list.component.html',
  styleUrl: './type-produit-rubrique-list.component.scss'
})
export class TypeProduitRubriqueListComponent {

   typeProduitRubriques: TypeProduitRubrique[] = [];
    key: string ="" ;
    pageData : PagedData<TypeProduitRubrique> = new PagedData<TypeProduitRubrique>();
    pageNumber : number = 0;
    size : number = 10;
    pageSelected : Page = new Page();
    @Input() natureRecette : NatureRecette | null = new NatureRecette();
  
    filterTypeProduitRubrique : TypeProduitRubrique[] | null = null;
  
    totalPage: number = 1;
    tableauPage = new Array()
    outerTypeProduitRubrique !: TypeProduitRubrique;
    typeProduitRubrique: TypeProduitRubrique[]=[];

     constructor(private typeProduitRubriqueService: TypeProduitRubriqueService,private modalService: NgbModal) {}
    

  ngOnInit(): void {
          this.pageSelected.pageNumber=this.pageNumber
          this.pageSelected.size=this.size;
          this.filterTypeProduitRubrique = this.typeProduitRubrique;
          this.getTypeProduitRubriques();
  }

   getTypeProduitRubriques(){
    console.log(this.pageSelected)
    this.typeProduitRubriqueService.getTypeProduitRubriqueByNatureRecette(this.pageSelected,this.natureRecette!.uuid).subscribe((pagedData: any) => {
     console.log("NatureRecette!.uuid :..... ",this.natureRecette!.uuid)
     
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
     this.typeProduitRubriqueService.getTypeProduitRubriqueByNatureRecette(this.pageSelected,this.natureRecette!.uuid).subscribe((pagedData: any) => {
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
    this.typeProduitRubriqueService.getTypeProduitRubriqueByNatureRecette(this.pageSelected,this.natureRecette!.uuid).subscribe((pagedData: any) => {
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
     this.typeProduitRubriqueService.getTypeProduitRubriqueByNatureRecette(this.pageSelected,this.natureRecette!.uuid).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherMensualisation()  {
    if(this.key.trim()===''){
      this.filterTypeProduitRubrique=this.typeProduitRubriques
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
       this.typeProduitRubriqueService.getTypeProduitRubriqueByNatureRecette(this.pageSelected,this.natureRecette!.uuid).subscribe((pagedData)=> {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,typeProduitRubrique:any) {
    this.outerTypeProduitRubrique=typeProduitRubrique;
    this.modalService.open(content,
        {
          size: 'l',
          centered: true
        }
    );
  }


}








