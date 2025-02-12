import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  EmissionsEtRecouvrementsListComponent
} from "./emissionsEtRecouvrements/emissions-et-recouvrements-list/emissions-et-recouvrements-list.component";
import {
  RestesARecouvrerListComponent
} from "./restesARecouvrer/restes-arecouvrer-list/restes-arecouvrer-list.component";
import {PaiementListComponent} from "./controleGestionPaiements/paiement-list/paiement-list.component";

const routes: Routes = [
  {
    path: 'emissionsEtRecouvrements',
    component : EmissionsEtRecouvrementsListComponent
  },
  {
    path: 'resteARecouvrer',
    component : RestesARecouvrerListComponent
  },
  {
    path: 'controleGestionPaiments',
    component : PaiementListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteRoutingModule { }
