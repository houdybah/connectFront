import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsBordRoutingModule } from './tabs-bord-routing.module';
import {AcceuilComponent} from "./acceuil/acceuil.component";
import {EtatComponent} from "./etatEtRapports/etat/etat.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabsBordRoutingModule
  ]
})
export class TabsBordModule { }
