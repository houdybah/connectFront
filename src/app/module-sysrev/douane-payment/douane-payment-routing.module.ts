import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPayementComponent } from './form-payement/form-payement.component';
import { IndexPayementComponent } from './index-payement/index-payement.component';
import { ListPayementComponent } from './list-payement/list-payement.component';

const routes: Routes = [
  {
    path: "Declaration",
    component: IndexPayementComponent
},{
  path: "liste-Declaration",
  component: ListPayementComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DouanePaymentRoutingModule { }


