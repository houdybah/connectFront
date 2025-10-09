import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReferenceTabsComponent} from "./references/reference-tabs/reference-tabs.component";
import {ParametresTabsComponent} from "./parametres/parametres-tabs/parametres-tabs.component";
import {FormsModule} from "@angular/forms";
import {UniteOrganigrammeComponent} from "./references/unite-organigramme/unite-organigramme.component";
import {OrganigrammeComponent} from "./references/organigramme/organigramme.component";
import {RealisationListComponent} from "./references/realisation-list/realisation-list.component";
import {RecetteDouaneComponent} from "./references/recette-douane/recette-douane.component";
import {RealisationCumulComponent} from "./references/realisation-cumul/realisation-cumul.component";
import {RealisationEnDateComponent} from "./references/realisation-en-date/realisation-en-date.component";
import {SituationEnUnComponent} from "./references/situation-en-un/situation-en-un.component";
import {CreditComptantComponent} from "./references/credit-comptant/credit-comptant.component";
import {RarParCodeBudgetComponent} from "./references/rar-par-code-budget/rar-par-code-budget.component";

const routes: Routes = [
  {
    path: 'references',
    component: ReferenceTabsComponent,
  },
  {
    path: 'realisation_unite',
    component: RealisationListComponent,
  },
  {
    path: 'recette',
    component: RecetteDouaneComponent,
  },
  {
    path: 'situation',
    component: RealisationCumulComponent,
  },
  {
    path: 'situationJournaliere',
    component: SituationEnUnComponent,
  },
  {
    path: 'organigramme',
    component: OrganigrammeComponent,
  },
  {
    path: 'parametres',
    component: ParametresTabsComponent,
  },
  {
    path: 'creditComptant',
    component: CreditComptantComponent,
  },
  {
    path: 'rarCodeBudget',
    component: RarParCodeBudgetComponent,
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }









