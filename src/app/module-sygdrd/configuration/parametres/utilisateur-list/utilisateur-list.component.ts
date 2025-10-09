import { Component } from '@angular/core';
import {Utilisateur} from "../../../models/Utilisateur";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrl: './utilisateur-list.component.scss'
})
export class UtilisateurListComponent {

  utilisateurs: Utilisateur[] = [];
  key: string ="" ;
  pageData : PagedData<Utilisateur> = new PagedData<Utilisateur>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterUtilisateur : Utilisateur[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerUtilisateur !: Utilisateur;
  utilisateur: Utilisateur[]=[];
  searchTerm: string ="";

  constructor(private utilisateurService: UtilisateurService,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterUtilisateur = this.utilisateur;
    this.getUtilisateurs();
  }

  getUtilisateurs(){
    console.log(this.pageSelected)
    this.utilisateurService.getUtilisateurss(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.utilisateurService.getUtilisateurss(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.utilisateurService.getUtilisateurss(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.utilisateurService.getUtilisateurss(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherUtilisateur()  {
    if(this.key.trim()===''){
      this.filterUtilisateur=this.utilisateurs
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.utilisateurService.getUtilisateurss(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,utilisateur:any) {
    this.outerUtilisateur=utilisateur;
    this.modalService.open(content,
        {
          size: 'lg',
          centered: true
        }
    );
  }


  closeModal() {
    this.getUtilisateurs();
    this.modalService.dismissAll();
  }
  
}








