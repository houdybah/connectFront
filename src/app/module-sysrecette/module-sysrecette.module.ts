import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleSysrecetteRoutingModule } from './module-sysrecette-routing.module';
import { SysrecetteIframeComponent } from './sysrecette-iframe/sysrecette-iframe.component';

@NgModule({
  declarations: [
    SysrecetteIframeComponent
  ],
  imports: [
    CommonModule,
    ModuleSysrecetteRoutingModule
  ]
})
export class ModuleSysrecetteModule { }

