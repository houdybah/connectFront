import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminAccessService } from '../services/admin-access.service';

/**
 * Autorise l'accès à l'espace admin (/modules/admin/*) aux SUPER_USER ainsi qu'aux
 * administrateurs d'application (utilisateurs portant un profil "Administrateur" sur
 * au moins une application). Les autres utilisateurs sont renvoyés vers le portail.
 *
 * La détermination du rôle est centralisée dans AdminAccessService (utilisé aussi par le
 * bouton flottant d'accès à l'administration) afin d'éviter deux implémentations qui
 * pourraient diverger.
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly adminAccessService: AdminAccessService,
    private readonly router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    const access = await this.adminAccessService.getAccess();

    if (!access.isAdmin) {
      this.router.navigate(['/modules/applications']);
      return false;
    }
    return true;
  }
}
