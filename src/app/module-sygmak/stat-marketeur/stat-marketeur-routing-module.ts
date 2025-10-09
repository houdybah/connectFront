
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
      path: "menuDelaration",
      component: MenuDeclarationComponent
  },
  {
    path: "decadaire",
    component: SituationDecadaireComponent
 }  ,{
 
   path: "quitance",
     component: SituationQuitanceComponent
 },
 {
    path: "signature",
    component: SignatureComponent
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





