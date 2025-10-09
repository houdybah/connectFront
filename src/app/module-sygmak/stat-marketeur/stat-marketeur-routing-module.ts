
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SituationDeclarationComponent } from './situation-declaration/situation-declaration.component';
import { SituationDecadaireComponent } from './situation-decadaire/situation-decadaire.component';
import { FormsModule } from '@angular/forms';
import { MenuDeclarationComponent } from './menu-declaration/menu-declaration.component';
import { SituationQuitanceComponent } from './situation-quitance/situation-quitance.component';
import { SignatureComponent } from './signature/signature.component';



const routes: Routes = [
  {
    path: "menu-declaration",
    component: MenuDeclarationComponent
  },
  {
    path: "situation-decadaire",
    component: SituationDecadaireComponent
  },
  {
    path: "situation-quitance",
    component: SituationQuitanceComponent
  },
  {
    path: "signature",
    component: SignatureComponent
  },
  // Aliases pour compatibilité
  {
    path: "menuDelaration",
    redirectTo: "menu-declaration"
  },
  {
    path: "decadaire",
    redirectTo: "situation-decadaire"
  },
  {
    path: "quitance",
    redirectTo: "situation-quitance"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
    ,FormsModule  
  ],
  exports: [RouterModule]
})



export class StatMarketeurRoutingModule {
}





