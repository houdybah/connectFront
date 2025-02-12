import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AcceuilComponent} from "../tabs-bord/acceuil/acceuil.component";
import {LoisFinanceComponent} from "./lois-finance/lois-finance.component";
import {QuotaComponent} from "./quota/quota.component";
import {AnalyseEtPrevisionComponent} from "./analyse-et-prevision/analyse-et-prevision.component";

const routes: Routes = [
  {
    path: "loisFinance",
    component: LoisFinanceComponent
  },
  {
    path: "quota",
    component: QuotaComponent
  },
  {
    path: "analyseEtPrevision",
    component: AnalyseEtPrevisionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyseSyntheseRoutingModule { }
