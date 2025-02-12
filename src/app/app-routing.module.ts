import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  { path: 'user', component: LayoutComponent, loadChildren: () => import('./gestion-utilisateur/gestion-utilisateur-routing-module').then(m => m.GestionUtilisateurRoutingModule), canActivate: [AuthGuard] },
  { path: 'tabsBord', component: LayoutComponent, loadChildren: () => import('./tabs-bord/tabs-bord-routing.module').then(m => m.TabsBordRoutingModule), canActivate: [AuthGuard] },
  { path: 'analyseSynthese', component: LayoutComponent, loadChildren: () => import('./analyse-synthese/analyse-synthese-routing.module').then(m => m.AnalyseSyntheseRoutingModule), canActivate: [AuthGuard] },
  { path: 'comptabilite', component: LayoutComponent, loadChildren: () => import('./comptabilite/comptabilite-routing.module').then(m => m.ComptabiliteRoutingModule), canActivate: [AuthGuard] },
  { path: 'configuration', component: LayoutComponent, loadChildren: () => import('./configuration/configuration-routing.module').then(m => m.ConfigurationRoutingModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
