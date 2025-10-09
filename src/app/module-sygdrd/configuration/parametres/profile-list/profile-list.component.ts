import { Component } from '@angular/core';
import {Profile} from "../../../models/Profile";
import {PagedData} from "../../../models/PageData";
import {Page} from "../../../models/Page";
import {ProfileService} from "../../../services/profile.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss'
})
export class ProfileListComponent {

  profiles: Profile[] = [];
  key: string ="" ;
  pageData : PagedData<Profile> = new PagedData<Profile>();
  pageNumber : number = 0;
  size : number = 10;
  pageSelected : Page = new Page();

  filterProfile : Profile[] | null = null;

  totalPage: number = 1;
  tableauPage = new Array()
  outerProfile !: Profile;
  profile: Profile[]=[];
  searchTerm: string ="";

  constructor(private profileService: ProfileService,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.pageSelected.pageNumber=this.pageNumber
    this.pageSelected.size=this.size;
    this.filterProfile = this.profile;
    this.getProfiles();
  }

  getProfiles(){
    console.log(this.pageSelected)
    this.profileService.getProfiless(this.pageSelected,"").subscribe((pagedData: any) => {
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
    this.profileService.getProfiless(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.profileService.getProfiless(this.pageSelected,this.key).subscribe((pagedData: any) => {
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
    this.profileService.getProfiless(this.pageSelected,this.key).subscribe((pagedData: any) => {
      console.log(pagedData)
      this.pageData = pagedData;
      this.totalPage = this.pageData.page.totalPages;
      this.tableauPage.length = this.pageData.page.totalPages;
      // this.pageSelected.pageNumber = this.pageNumber
      console.log(this.totalPage)

    });
  }

  rechercherProfile()  {
    if(this.key.trim()===''){
      this.filterProfile=this.profiles
    }
    else {
      this.pageSelected.size = this.size
      this.pageSelected.pageNumber = 0
      this.pageNumber = 0
      this.profileService.getProfiless(this.pageSelected,this.key).subscribe((pagedData: any) => {
        console.log(pagedData)
        this.pageData = pagedData;
        this.pageNumber = this.pageData.page.pageNumber;
        this.size = this.pageData.page.size;
      });
    }
  }

  openModal(content: any,profile:any) {
    this.outerProfile=profile;
    this.modalService.open(content,
        {
          size: 'xl',
          centered: true
        }
    );
  }


  closeModal() {
    this.getProfiles();
    this.modalService.dismissAll();
  }
  
}








