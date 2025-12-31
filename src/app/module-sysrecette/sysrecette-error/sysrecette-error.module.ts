import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SysrecetteErrorComponent } from './sysrecette-error.component';

const routes: Routes = [
  {
    path: '',
    component: SysrecetteErrorComponent
  }
];

@NgModule({
  declarations: [
    SysrecetteErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SysrecetteErrorModule { }

