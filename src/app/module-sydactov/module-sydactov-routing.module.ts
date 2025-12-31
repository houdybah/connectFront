import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://41.77.184.36:8070/remoteEntry.js',
        exposedModule: './Module'
      })
      .then(m => m.RemoteAppModule)
      .catch(err => {
        console.error('Erreur lors du chargement du module distant SYDACTOV:', err);
        // Retourner un module vide en cas d'erreur
        return import('./sydactov-error/sydactov-error.module').then(m => m.SydactovErrorModule);
      })
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSydactovRoutingModule { }

