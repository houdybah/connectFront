import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysrecetteIframeComponent } from './sysrecette-iframe/sysrecette-iframe.component';

const routes: Routes = [
  {
    path: '',
    component: SysrecetteIframeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSysrecetteRoutingModule { }

