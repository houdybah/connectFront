import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/modules', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  { path: 'modules', loadChildren: () => import('./module-manager/module-manager-routing.module').then(m => m.ModuleManagerRoutingModule), canActivate: [AuthGuard] },
  { path: 'sygdrd', component: LayoutComponent, loadChildren: () => import('./module-sygdrd/module-sygdrd-routing.module').then(m => m.ModuleSygdrdRoutingModule), canActivate: [AuthGuard] },
  { path: 'sygmak', component: LayoutComponent, loadChildren: () => import('./module-sygmak/module-sygmak-routing.module').then(m => m.ModuleSygmakRoutingModule), canActivate: [AuthGuard] },
  { path: 'sysrev', component: LayoutComponent, loadChildren: () => import('./module-sysrev/module-sysrev-routing.module').then(m => m.ModuleSysrevRoutingModule), canActivate: [AuthGuard] },
  { path: 'sydactov', component: LayoutComponent, loadChildren: () => import('./module-sydactov/module-sydactov-routing.module').then(m => m.ModuleSydactovRoutingModule), canActivate: [AuthGuard] },
  { path: 'sysrecette', component: LayoutComponent, loadChildren: () => import('./module-sysrecette/module-sysrecette-routing.module').then(m => m.ModuleSysrecetteRoutingModule), canActivate: [AuthGuard] },
  { path: 'pages', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
