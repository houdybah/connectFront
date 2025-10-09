import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AcceuilComponent} from "./acceuil/acceuil.component";
import {StatistiquesComponent} from "./statistiques/statistiques/statistiques.component";
import {EtatComponent} from "./etatEtRapports/etat/etat.component";

const routes: Routes = [
      {
        path: "acceuil",
        component: AcceuilComponent
      },
      {
        path: "statistiques",
        component: StatistiquesComponent
      },
      {
        path: "etat",
        component: EtatComponent
      }
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsBordRoutingModule { }









