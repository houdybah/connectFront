import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JournalListComponent} from "./journal-list/journal-list.component";
import {
  SearchResteArecouvrerComponent
} from "./restesARecouvrer/search-reste-arecouvrer/search-reste-arecouvrer.component";
import {SearchProvisoireComponent} from "./provisoire/search-provisoire/search-provisoire.component";
import {PaiementTabsComponent} from "./controleGestionPaiements/paiement-tabs/paiement-tabs.component";
import { RealisationListComponent } from '../configuration/references/realisation-list/realisation-list.component';
import { SearchQuittanceComponent } from './controleGestionPaiements/search-quittance/search-quittance.component';
import { SearchCodeBudgetComponent } from './situationParCodeBudget/search-code-budget/search-code-budget.component';


const routes: Routes = [
  {
    path: 'emissionsEtRecouvrements',
    component : JournalListComponent
  },
  {
    path: 'resteARecouvrer',
    component : SearchResteArecouvrerComponent
  },
  {
    path: 'controleGestionPaiments',
    component : SearchQuittanceComponent
  },
  {
    path: 'situationParCodeBudget',
    component : SearchCodeBudgetComponent
  },
  {
    path: 'provisoires',
    component : SearchProvisoireComponent
  },
  {
    path: 'journal',
    component : JournalListComponent
  }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ComptabiliteRoutingModule { }









