import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
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
import {
  EmissionsEtRecouvrementsListComponent
} from "./emissionsEtRecouvrements/emissions-et-recouvrements-list/emissions-et-recouvrements-list.component";
import {
  EmissionsEtRecouvrementsFormComponent
} from "./emissionsEtRecouvrements/emissions-et-recouvrements-form/emissions-et-recouvrements-form.component";
import { JournalFormComponent } from './journal-form/journal-form.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import {UiSwitchModule} from "ngx-ui-switch";
import {
  SearchResteArecouvrerComponent
} from "./restesARecouvrer/search-reste-arecouvrer/search-reste-arecouvrer.component";
import {
  TableResteArecouvrerComponent
} from "./restesARecouvrer/table-reste-arecouvrer/table-reste-arecouvrer.component";
import {
  StateResteArecouvrerComponent
} from "./restesARecouvrer/state-reste-arecouvrer/state-reste-arecouvrer.component";
import {
  EditionResteArecouvrerComponent
} from "./restesARecouvrer/edition-reste-arecouvrer/edition-reste-arecouvrer.component";
import {SearchProvisoireComponent} from "./provisoire/search-provisoire/search-provisoire.component";
import {TableProvisoireComponent} from "./provisoire/table-provisoire/table-provisoire.component";
import {PaiementTabsComponent} from "./controleGestionPaiements/paiement-tabs/paiement-tabs.component";
import {SearchQuittanceComponent} from "./controleGestionPaiements/search-quittance/search-quittance.component";
import {TableFtComponent} from "./controleGestionPaiements/table-ft/table-ft.component";
import {SearchFtComponent} from "./controleGestionPaiements/search-ft/search-ft.component";
import {TableQuittanceComponent} from "./controleGestionPaiements/table-quittance/table-quittance.component";
import {
  VentilationRubriqueComponent
} from "./emissionsEtRecouvrements/ventilation-rubrique/ventilation-rubrique.component";
import {VentilationCompteComponent} from "./emissionsEtRecouvrements/ventilation-compte/ventilation-compte.component";
//import { TableCodeBudgetComponent } from './controleGestionPaiements/table-code-budget/table-code-budget.component';
//import { SearchCodeBudgetComponent } from './controleGestionPaiements/search-code-budget/search-code-budget.component';

import { TableCodeBudgetComponent } from './situationParCodeBudget/table-code-budget/table-code-budget.component';
import { SearchCodeBudgetComponent } from './situationParCodeBudget/search-code-budget/search-code-budget.component';


@NgModule({
  declarations: [
    EmissionsEtRecouvrementsListComponent,
    EmissionsEtRecouvrementsFormComponent,
    JournalFormComponent,
    JournalListComponent,
    SearchResteArecouvrerComponent,
    TableResteArecouvrerComponent,
    StateResteArecouvrerComponent,
    EditionResteArecouvrerComponent,
    SearchProvisoireComponent,
    TableProvisoireComponent,
    PaiementTabsComponent,
    SearchQuittanceComponent,
    TableFtComponent,
    SearchFtComponent,
    TableQuittanceComponent,
    VentilationRubriqueComponent,
    VentilationCompteComponent,
    TableCodeBudgetComponent,
    SearchCodeBudgetComponent
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
    NgbAccordionModule,
    NgbModule,
    NgbDropdownModule,
    UiSwitchModule
  ]
})
export class ComptabiliteModule { }









