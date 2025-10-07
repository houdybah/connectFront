import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Tableau de Bord
  {
    path: 'dashboard',
    loadChildren: () => import('../tabs-bord/tabs-bord-routing.module').then(m => m.TabsBordRoutingModule)
  },
  // Analyse et Synthèse - Utiliser les anciens modules
  {
    path: 'analyse-synthese',
    loadChildren: () => import('../analyse-synthese/analyse-synthese-routing.module').then(m => m.AnalyseSyntheseRoutingModule)
  },
  // Comptabilité - Utiliser les anciens modules
  {
    path: 'comptabilite',
    loadChildren: () => import('../comptabilite/comptabilite-routing.module').then(m => m.ComptabiliteRoutingModule)
  },
  // Configuration - Utiliser les anciens modules
  {
    path: 'configuration',
    loadChildren: () => import('../configuration/configuration-routing.module').then(m => m.ConfigurationRoutingModule)
  },
  // Gestion Utilisateur
  {
    path: 'gestion-utilisateur',
    loadChildren: () => import('../gestion-utilisateur/gestion-utilisateur-routing-module').then(m => m.GestionUtilisateurRoutingModule)
  },
  // Redirection par défaut vers le tableau de bord
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSygdrdRoutingModule { }
