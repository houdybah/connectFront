import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Assurez-vous que FormsModule est importé ici

import { SituationDeclarationComponent } from './situation-declaration/situation-declaration.component';
import { StatMarketeurRoutingModule } from './stat-marketeur-routing-module';
import { SituationDecadaireComponent } from './situation-decadaire/situation-decadaire.component';
import { MenuDeclarationComponent } from './menu-declaration/menu-declaration.component';
import { SituationDelarationParBureauComponent } from './situation-delaration-par-bureau/situation-delaration-par-bureau.component';
import { SituationDelarationParCodeDecComponent } from './situation-delaration-par-code-dec/situation-delaration-par-code-dec.component';

import { SituationQuitanceComponent } from './situation-quitance/situation-quitance.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignatureComponent } from './signature/signature.component';

@NgModule({
  declarations: [
   SituationDeclarationComponent,
   SituationDecadaireComponent,
   MenuDeclarationComponent,
   SituationDelarationParBureauComponent,
   SituationDelarationParCodeDecComponent,
   SituationQuitanceComponent,
   SignatureComponent,

  ],
  imports: [
       MatProgressSpinnerModule,
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
    StatMarketeurRoutingModule,
    
  ]
  ,
  providers: [DatePipe], 
})
export class StatMarketeurModule { }





