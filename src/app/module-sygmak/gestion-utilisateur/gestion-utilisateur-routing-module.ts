import { RouterModule, Routes } from "@angular/router";
import { ListUtilisateurComponent } from "./list-utilisateur/list-utilisateur.component";
import { NifListComponent } from "./nif-list/nif-list.component";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuUtilisateurComponent } from "./menu-utilisateur/menu-utilisateur.component";



const routes: Routes = [
  {
    path: "menuUser",
    component: MenuUtilisateurComponent
  },
  {
    path: "utilisateurs",
    component: ListUtilisateurComponent
  },
  {
    path: "entreprises",
    component: MenuUtilisateurComponent // Utilise les tabs
  },
  {
    path: "nif",
    component: NifListComponent
  },
  {
    path: "rechargements",
    component: MenuUtilisateurComponent // Utilise les tabs
  },
  {
    path: "references-abonnement",
    component: MenuUtilisateurComponent // Utilise les tabs
  },
  {
    path: "",
    redirectTo: "menuUser",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
    ,FormsModule  
  ],
  exports: [RouterModule]
})


export class GestionUtilisateurRoutingModule {
}





