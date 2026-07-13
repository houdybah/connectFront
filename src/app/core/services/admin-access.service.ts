import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

export interface AdminAccess {
  /** SUPER_USER : accès complet à toutes les applications */
  isSuperUser: boolean;
  /** Porte le profil "Administrateur" sur au moins une application */
  isApplicationAdmin: boolean;
  /** isSuperUser || isApplicationAdmin : donne accès à l'espace d'administration DouaneConnect */
  isAdmin: boolean;
  /**
   * Codes des applications administrées (profil "Administrateur").
   * Non pertinent pour un SUPER_USER (accès à tout, tableau vide).
   */
  adminApplicationCodes: string[];
  /** UUID des applications administrées (profil "Administrateur"). */
  adminApplicationUuids: string[];
}

const NO_ACCESS: AdminAccess = {
  isSuperUser: false,
  isApplicationAdmin: false,
  isAdmin: false,
  adminApplicationCodes: [],
  adminApplicationUuids: []
};

/**
 * Source unique de vérité pour déterminer qui a accès à l'espace d'administration
 * DouaneConnect et à quel périmètre.
 *
 * Règle : l'espace admin (et le bouton flottant qui y mène) n'est visible que pour les
 * SUPER_USER (accès à tout) et les administrateurs d'application (utilisateurs portant le
 * profil "Administrateur" sur au moins une application, [[ProfileNames.ADMINISTRATEUR]] côté
 * backend). Un administrateur d'application ne voit et ne gère que les applications pour
 * lesquelles il porte ce profil : c'est le backend (SecurityContextService.getAdminApplicationUuids)
 * qui applique la restriction finale sur les données ; ce service ne sert qu'à piloter
 * l'affichage côté client (garde de route, bouton flottant, etc.).
 *
 * Utilisé par AdminGuard et par les composants qui doivent adapter leur affichage au rôle
 * (ex: ApplicationTabsComponent pour le bouton flottant). Centraliser cette lecture évite que
 * les différents points d'entrée du front dérivent chacun leur propre interprétation des claims
 * du token.
 */
@Injectable({ providedIn: 'root' })
export class AdminAccessService {
  constructor(private readonly tokenStorageService: TokenStorageService) { }

  async getAccess(): Promise<AdminAccess> {
    const claims = await this.tokenStorageService.getDecryptedClaims();
    if (!claims) {
      return { ...NO_ACCESS };
    }

    const profiles: any[] = Array.isArray(claims.profiles) ? claims.profiles : [];
    const adminProfiles = profiles.filter((p) => p?.nomProfile === 'Administrateur');

    const isSuperUser = claims.role === 'SUPER_USER';
    const isApplicationAdmin = adminProfiles.length > 0;

    return {
      isSuperUser,
      isApplicationAdmin,
      isAdmin: isSuperUser || isApplicationAdmin,
      adminApplicationCodes: adminProfiles
        .map((p) => p?.codeApplication)
        .filter((code): code is string => !!code),
      adminApplicationUuids: adminProfiles
        .map((p) => p?.uuidApplication)
        .filter((uuid): uuid is string => !!uuid)
    };
  }
}
