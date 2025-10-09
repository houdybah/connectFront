import { NgModule } from "@angular/core";
import { AbonnementFormComponent } from "./abonnement-form/abonnement-form.component";
import { AbonnementListComponent } from "./abonnement-list/abonnement-list.component";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FeatherModule } from "angular-feather";
import { CountUpModule } from "ngx-countup";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { SimplebarAngularModule } from "simplebar-angular";
import { NgApexchartsModule } from "ng-apexcharts";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { FlatpickrModule } from "angularx-flatpickr";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GestionAbonnementRoutingModule } from "./gestion-abonnement-routing-module";
import { allIcons } from "angular-feather/icons";



@NgModule({
  declarations: [
   AbonnementFormComponent,
   AbonnementListComponent
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
       GestionAbonnementRoutingModule,
       NgbPaginationModule,
       ReactiveFormsModule
    //    MatFormFieldModule,
    //    MatAutocompleteModule,
    // MatInputModule,

  ]
})


export class GestionAbonnementModule {
}





