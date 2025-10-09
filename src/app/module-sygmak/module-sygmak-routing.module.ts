import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'stat-marketeur',
    loadChildren: () => import('./stat-marketeur/stat-marketeur.module').then(m => m.StatMarketeurModule)
  },
  {
    path: 'gestion-utilisateur',
    loadChildren: () => import('./gestion-utilisateur/gestion-utilisateur.module').then(m => m.GestionUtilisateurModule)
  },
  {
    path: 'gestion-abonnement',
    loadChildren: () => import('./gestion-abonnement/gestion-abonnement.module').then(m => m.GestionAbonnementModule)
  },
  {
    path: '',
    redirectTo: 'stat-marketeur',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSygmakRoutingModule { }





