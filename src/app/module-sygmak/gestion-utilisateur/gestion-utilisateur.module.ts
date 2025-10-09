import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuUtilisateurComponent } from './menu-utilisateur/menu-utilisateur.component';
import { ListUtilisateurComponent } from './list-utilisateur/list-utilisateur.component';
import { NifListComponent } from './nif-list/nif-list.component';
import { FormUtilisateurComponent } from './form-utilisateur/form-utilisateur.component';
import { NifFormComponent } from './nif-form/nif-form.component';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CountUpModule } from 'ngx-countup';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionUtilisateurRoutingModule } from './gestion-utilisateur-routing-module';
import { ReferenceAbonnementListComponent } from './reference-abonnement-list/reference-abonnement-list.component';
import { ReferenceAbonnementFormComponent } from './reference-abonnement-form/reference-abonnement-form.component';
import { EntrepriseFormComponent } from './entreprise-form/entreprise-form.component';
import { EntrepriseListComponent } from './entreprise-list/entreprise-list.component';
import { RechargementListComponent } from './rechargement-list/rechargement-list.component';
import { RechargementFormComponent } from './rechargement-form/rechargement-form.component';



@NgModule({
  declarations: [
    MenuUtilisateurComponent,
    ListUtilisateurComponent,
    NifListComponent,
    FormUtilisateurComponent,
    NifFormComponent,
    ReferenceAbonnementListComponent,
    ReferenceAbonnementFormComponent,
    EntrepriseFormComponent,
    EntrepriseListComponent,
      
    RechargementListComponent,
    RechargementFormComponent
  ],
  imports: [
    CommonModule,
     NgbToastModule,
       FeatherModule.pick(allIcons),
       CountUpModule,
       LeafletModule,
       NgbDropdownModule,
       NgbNavModule,
       SimplebarAngularModule,
       NgApexchartsModule,
       SlickCarouselModule,
       FlatpickrModule.forRoot(),
       SharedModule,
       NgbPaginationModule,
       NgbTypeaheadModule,
       FormsModule,  // Importer FormsModule pour que ngModel fonctionne
       ReactiveFormsModule,
       NgbTooltipModule,
       GestionUtilisateurRoutingModule,
    //    MatFormFieldModule,
    //    MatAutocompleteModule,
    // MatInputModule,

  ]
})
export class GestionUtilisateurModule { }





