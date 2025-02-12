import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReferenceTabsComponent} from "./references/reference-tabs/reference-tabs.component";
import {ParametresTabsComponent} from "./parametres/parametres-tabs/parametres-tabs.component";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: 'references',
    component: ReferenceTabsComponent,
  },
  {
    path: 'parametres',
    component: ParametresTabsComponent,
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
