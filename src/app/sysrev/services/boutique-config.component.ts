import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Domain } from '../models/saran-app/Domain';

import { DomainBoutique } from '../models/saran-app/DomainBoutique';
import { ConfigurationService } from '../services/saran-app/configuration.service';
import { DomainBoutiqueService } from '../services/saran-app/domain-boutique.service';
import { UploadService } from '../services/saran-app/upload.service';
import { ShopServiceService } from '../services/version/shop-service.service';

@Component({
  selector: 'app-boutique-config',
  templateUrl: './boutique-config.component.html',
  styleUrl: './boutique-config.component.scss'
})
export class BoutiqueConfigComponent implements OnInit {
  userForm: FormGroup;
  shopForm: FormGroup;
  userImage: string = 'assets/default-user.png';
  shopLogo: string = 'assets/default-logo.png';
  domains: Domain[] = [];
  domainsSelected: Domain[] = [];
  categories = ['Vêtements', 'Accessoires', 'Gadgets', 'Meubles'];
  fileToUpload: any;
  fileObject: any;
  FileLogoId: any;
  FileProfileId: any;

  constructor(private fb: FormBuilder,private shopService:ShopServiceService,private configurationService:ConfigurationService,private fileUploadService:UploadService,private router: Router) {
    this.userForm = this.fb.group({
      firstName: ['John'],
      lastName: ['Doe'],
      address: ['123 Rue Ex'],
      contact: ['+123456789'],
      password: ['password123'],
    });
    
    this.shopForm = this.fb.group({
      shopName: ['Ma Boutique'],
      address: ['456 Avenue'],
      contact: ['+987654321'],
      country: ['France'],
      domains: [[]],
      categories: [[]],
    });
  }
  ngOnInit(): void {
    this.getRegistration();
  }

  onImageUpload(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (type === 'user') {
          this.uploadFileProfil(event);
          this.userImage = e.target.result;
        } else {
          this.uploadFileLogo(event);
          this.shopLogo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }


 

  uploadFileLogo(event:any){
    if(event.target.files && event.target.files[0]){
      this.fileToUpload = event.target.files[0];
      var reader = new FileReader();
      this.fileUploadService.SaveFile(this.fileToUpload).subscribe((data:any) => {
          this.FileLogoId = data["uuid"];
          console.log(this.FileLogoId)
      })
    }
  }

  uploadFileProfil(event:any){
    if(event.target.files && event.target.files[0]){
      this.fileToUpload = event.target.files[0];
      var reader = new FileReader();
      this.fileUploadService.SaveFile(this.fileToUpload).subscribe((data:any) => {
          this.FileProfileId = data["uuid"];
          console.log(this.FileProfileId)
      })
    }
  }

  getRegistration(){
    this.shopService.getRegistration().subscribe(res =>{
      console.log(res)
      this.userForm = this.fb.group({
        firstName: [res.customer.prenom],
        lastName: [res.customer.nom],
        address: [res.customer.customerAdress],
        contact: [res.customer.customerPhone],
        password: [res.customer.password],
      })

      this.shopForm = this.fb.group({
        shopName: [res.boutique.boutiqueName],
        address: [res.boutique.boutiqueAdress],
        contact: [res.boutique.boutiqueContact],
        country: [res.boutique.countryCode],
        
      })
    })

    this.configurationService.getDomains().subscribe(res => {
      console.log(res)
      this.domains = res;
    })
  }

  onSubmit() {
    console.log(this.FileLogoId,this.FileProfileId)
  this.shopService.createRegistrationConfig(this.FileProfileId,this.FileLogoId,this.domainsSelected).subscribe(res => {
    
    if(res.boutique.uuidStoredFile !== null && res.customer.uuidStoredFile !== null){
      this.router.navigate(['/tableau-de-bord']);
    }
  })
    console.log(this.domainsSelected);

  }


}





