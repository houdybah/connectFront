import { RouterModule, Routes } from "@angular/router";
import { AbonnementListComponent } from "./abonnement-list/abonnement-list.component";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";




const routes: Routes = [
  {
    path: "abonnements",
    component: AbonnementListComponent
  },
  {
    path: "abonnements/nouveau",
    component: AbonnementListComponent
  },
  {
    path: "",
    redirectTo: "abonnements",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
    ,FormsModule  
  ],
  exports: [RouterModule]
})


export class GestionAbonnementRoutingModule {
}





