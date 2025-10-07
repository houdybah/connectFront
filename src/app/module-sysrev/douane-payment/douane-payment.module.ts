import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DouanePaymentRoutingModule } from './douane-payment-routing.module';
import { IndexPayementComponent } from './index-payement/index-payement.component';
import { FormPayementComponent } from './form-payement/form-payement.component';
import { ListPayementComponent } from './list-payement/list-payement.component';
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
import { StatusPaiementComponent } from './status-paiement/status-paiement.component';
import { FormTransactionComponent } from './form-transaction/form-transaction.component';


@NgModule({
  declarations: [
   
    IndexPayementComponent,
    FormPayementComponent,
    ListPayementComponent,
    StatusPaiementComponent,
    FormTransactionComponent
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
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    DouanePaymentRoutingModule
  ]
})
export class DouanePaymentModule { }
