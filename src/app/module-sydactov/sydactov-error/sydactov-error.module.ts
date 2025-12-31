import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SydactovErrorComponent } from './sydactov-error.component';

const routes: Routes = [
  {
    path: '',
    component: SydactovErrorComponent
  }
];

@NgModule({
  declarations: [
    SydactovErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SydactovErrorModule { }

