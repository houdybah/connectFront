import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbToastModule, NgbTooltipModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FeatherModule} from "angular-feather";
import {allIcons} from "angular-feather/icons";
import {CountUpModule} from "ngx-countup";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {SimplebarAngularModule} from "simplebar-angular";
import {NgApexchartsModule} from "ng-apexcharts";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {FlatpickrModule} from "angularx-flatpickr";
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaiementListComponent} from "./controleGestionPaiements/paiement-list/paiement-list.component";


@NgModule({
  declarations: [
    PaiementListComponent,
  ],
  imports: [
    CommonModule,
    ComptabiliteRoutingModule,
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
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
  ]
})
export class ComptabiliteModule { }
