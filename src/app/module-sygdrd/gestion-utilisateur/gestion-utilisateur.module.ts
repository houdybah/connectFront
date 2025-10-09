import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuUtilisateurComponent } from './menu-utilisateur/menu-utilisateur.component';
import { ListUtilisateurComponent } from './list-utilisateur/list-utilisateur.component';
import { NifListComponent } from './nif-list/nif-list.component';



@NgModule({
  declarations: [
    MenuUtilisateurComponent,
    ListUtilisateurComponent,
    NifListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GestionUtilisateurModule { }









