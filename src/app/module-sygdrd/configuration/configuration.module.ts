import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule, NgbPaginationModule,
  NgbToastModule, NgbTooltipModule, NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {ReferenceTabsComponent} from "./references/reference-tabs/reference-tabs.component";
import {UiSwitchModule} from "ngx-ui-switch";
import {FeatherModule} from "angular-feather";
import {allIcons} from "angular-feather/icons";
import {CountUpModule} from "ngx-countup";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {SimplebarAngularModule} from "simplebar-angular";
import {NgApexchartsModule} from "ng-apexcharts";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {FlatpickrModule} from "angularx-flatpickr";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CompteListComponent} from "./references/compte-list/compte-list.component";
import {CompteFormComponent} from "./references/compte-form/compte-form.component";
import {ParametreListComponent} from "./parametres/parametre-list/parametre-list.component";
import {ParametreFormComponent} from "./parametres/parametre-form/parametre-form.component";
import {RubriqueListComponent} from "./references/rubrique-list/rubrique-list.component";
import {RubriqueFormComponent} from "./references/rubrique-form/rubrique-form.component";
import {ParametresTabsComponent} from "./parametres/parametres-tabs/parametres-tabs.component";


@NgModule({
  declarations: [
    ReferenceTabsComponent,
    CompteListComponent,
    CompteFormComponent,
    ParametreListComponent,
    ParametreFormComponent,
    ParametresTabsComponent,
    RubriqueListComponent,
    RubriqueFormComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,

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
    NgbAccordionModule,
    NgbModule,
    NgbDropdownModule,
    UiSwitchModule
  ]
})
export class ConfigurationModule { }
