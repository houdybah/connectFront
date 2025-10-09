import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyseSyntheseRoutingModule } from './analyse-synthese-routing.module';

import {
  NgbAccordionModule,
  NgbDropdownModule, NgbModule,
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
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UiSwitchModule} from "ngx-ui-switch";
import { LoisFinanceListComponent } from './lois-finance-list/lois-finance-list.component';
import { LoisFinanceFormComponent } from './lois-finance-form/lois-finance-form.component';
import { QuotaListComponent } from './quota-list/quota-list.component';
import { QuotaFormComponent } from './quota-form/quota-form.component';


@NgModule({
    declarations: [
        LoisFinanceListComponent,
        LoisFinanceFormComponent,
        QuotaListComponent,
        QuotaFormComponent
    ],
    exports: [
        LoisFinanceListComponent
    ],
    imports: [
        CommonModule,
        AnalyseSyntheseRoutingModule,

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
export class AnalyseSyntheseModule { }









