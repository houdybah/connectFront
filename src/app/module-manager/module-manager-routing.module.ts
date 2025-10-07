import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleManagerModule } from './module-manager.module';

const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list-modules/list-modules.component').then(m => m.ListModulesComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form-module/form-module.component').then(m => m.FormModuleComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./form-module/form-module.component').then(m => m.FormModuleComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleManagerRoutingModule { }
