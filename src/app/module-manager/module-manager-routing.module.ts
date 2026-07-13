import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  // Application tabs SANS layout (reste comme avant)
  {
    path: 'applications',
    loadComponent: () => import('./application-tabs/application-tabs.component').then(m => m.ApplicationTabsComponent)
  },
  {
    path: 'app-frame',
    loadComponent: () => import('./app-frame/app-frame.component').then(m => m.AppFrameComponent)
  },
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
  // Routes d'administration AVEC layout (topbar + menu)
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'application-list',
        loadComponent: () => import('./application-list/application-list.component').then(m => m.ApplicationListComponent)
      },
      {
        path: 'utilisateur-list',
        loadComponent: () => import('./utilisateur-list/utilisateur-list.component').then(m => m.UtilisateurListComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
      },
      {
        path: 'login-history',
        loadComponent: () => import('./login-history/login-history.component').then(m => m.LoginHistoryComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./documentation/documentation.component').then(m => m.DocumentationComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // Redirection par défaut
  {
    path: '',
    redirectTo: 'applications',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleManagerRoutingModule { }
