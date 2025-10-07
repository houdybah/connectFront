import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';

// Auth
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)  },
  { path: 'sygdrd', component: LayoutComponent, loadChildren: () => import('./module-sygdrd/module-sygdrd-routing.module').then(m => m.ModuleSygdrdRoutingModule), canActivate: [AuthGuard] },
  { path: 'modules', component: LayoutComponent, loadChildren: () => import('./module-manager/module-manager-routing.module').then(m => m.ModuleManagerRoutingModule), canActivate: [AuthGuard] },
  { path: 'sysrev', component: LayoutComponent, loadChildren: () => import('./sysrev/sysrev.module').then(m => m.SysrevModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
