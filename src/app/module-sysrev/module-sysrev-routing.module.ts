import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'schedule-parc',
    loadChildren: () => import('./schedule-parc/schedule-parc.module').then(m => m.ScheduleParcModule)
  },
  {
    path: 'douane-payment',
    loadChildren: () => import('./douane-payment/douane-payment.module').then(m => m.DouanePaymentModule)
  },
  {
    path: '',
    redirectTo: 'schedule-parc',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSysrevRoutingModule { }


