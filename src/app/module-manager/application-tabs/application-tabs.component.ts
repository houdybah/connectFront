import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuVisibilityService } from '../../core/services/menu-visibility.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { ApplicationService } from '../services/application.service';
import { UserApplicationAcces } from '../models/UserApplicationAcces';
import { EncryptionService } from '../../core/services/encryption.service';

@Component({
  selector: 'app-application-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-tabs.component.html',
  styleUrls: ['./application-tabs.component.scss']
})
export class ApplicationTabsComponent implements OnInit {


  applications: UserApplicationAcces[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isAdmin: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly menuVisibilityService: MenuVisibilityService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly applicationService: ApplicationService,
    private readonly encryptionService: EncryptionService
  ) { }

  ngOnInit(): void {
    // Masquer le menu au chargement
    this.menuVisibilityService.hideMenu();
    
    // Vérifier si l'utilisateur est admin
    this.checkAdminRole();
    
    // Charger les applications de l'utilisateur depuis l'API
    this.loadUserApplications();
  }

  /**
   * Vérifie si l'utilisateur a le rôle admin en vérifiant le champ 'service' dans le token
   */
  checkAdminRole(): void {
    const token = this.tokenStorageService.getToken();
    
    if (!token) {
      this.isAdmin = false;
      return;
    }
    
    try {
      const payload = this.encryptionService.decodeJWT(token);
      console.log('Payload du token pour vérification admin:', payload);
      console.log('Champ service:', payload?.service);
      
      // Vérifier si le champ 'service' est égal à 'admin'
      this.isAdmin = payload?.role === 'SUPER_USER';
      console.log('Utilisateur est admin:', this.isAdmin);
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      this.isAdmin = false;
    }
  }

  /**
   * Charge les applications de l'utilisateur depuis l'API
   */
  loadUserApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // DEBUG: Vérifier le token
    const token = this.tokenStorageService.getToken();
    console.log('Token récupéré:', token ? 'Token présent' : 'Token absent');

    // Extraire l'UUID de l'utilisateur depuis le token JWT (champ jti)
    const userUuid = this.tokenStorageService.getUserUuid();
    console.log('UUID utilisateur extrait:', userUuid);

    if (!userUuid) {
      console.error('UUID utilisateur non trouvé dans le token');
      this.errorMessage = 'Impossible de récupérer les informations utilisateur';
      this.isLoading = false;
      return;
    }

    console.log('Appel API pour récupérer les applications de l\'utilisateur:', userUuid);
    // Appeler le service pour récupérer les applications de l'utilisateur
    this.applicationService.applicationUser(userUuid).subscribe({
      next: (applications) => {
        this.applications = applications;
        console.log('=== DONNÉES APPLICATIONS REÇUES ===');
        console.log('Nombre d\'applications:', applications.length);
        for (let index = 0; index < applications.length; index++) {
          const app = applications[index];
          console.log(`\nApplication ${index + 1}:`, {
            uuidApplication: app.uuidApplication,
            codeApplication: app.codeApplication,
            nomApplication: app.nomApplication,
            version: app.version,
            environnement: app.environnement,
            descriptionApplication: app.descriptionApplication,
            urlApplication: app.urlApplication,
            icon: app.icon,
            color: app.color,
            enabled: app.enabled,
            applicationEnabled: app.applicationEnabled,
            hasAccess: app.hasAccess,
            nonLocked: app.nonLocked,
            nonExpired: app.nonExpired
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des applications:', error);
        this.errorMessage = 'Erreur lors du chargement des applications';
        this.isLoading = false;
      }
    });
  }

  showNoAppsMessage(): boolean {
    return !this.isLoading && this.applications.length === 0 && !this.errorMessage;
  }

  selectApplication(app: UserApplicationAcces): void {
    console.log('Application sélectionnée:', app);
    
    // Vérifier si l'application est disponible
    if (!app.applicationEnabled) {
      console.warn('Application non disponible:', app.nomApplication);
      this.errorMessage = `L'application ${app.nomApplication} est actuellement indisponible`;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }
    
    // Vérifier si l'URL de l'application existe
    if (!app.urlApplication) {
      console.error('URL de l\'application non définie:', app.nomApplication);
      this.errorMessage = `L'URL de l'application ${app.nomApplication} n'est pas configurée`;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }
    
    const appCode = app.codeApplication?.toLowerCase() || '';
    
    // Récupérer le token décrypté depuis le service
    const token = this.tokenStorageService.getToken();
    
    if (!token) {
      console.error('Token non trouvé dans le sessionStorage');
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
      return;
    }
    
    // Récupérer l'URL de la page en cours
    const currentUrl = globalThis.location.href;
    
    // Sauvegarder des informations dans le sessionStorage pour référence
    sessionStorage.setItem('currentApp', appCode);
    sessionStorage.setItem('returnUrl', currentUrl);
    
    // Mettre à jour le service de visibilité du menu
    this.menuVisibilityService.setSelectedApp(appCode);
    
    // Construire l'URL avec le token et l'URL de retour en paramètres de requête
    const url = new URL(app.urlApplication);
    url.searchParams.append('token', token);
    url.searchParams.append('url', currentUrl);
    const finalUrl = url.toString();
    
    console.log(`Redirection vers l'application ${app.nomApplication}:`, finalUrl);
    console.log('Token passé:', token);
    console.log('URL de retour:', currentUrl);
    
    // Rediriger vers l'URL de l'application avec le token et l'URL de retour
    globalThis.location.href = finalUrl;
  }

  logout(): void {
    // Nettoyer l'application sélectionnée
    this.menuVisibilityService.clearSelectedApp();
    
    // Nettoyer le sessionStorage
    sessionStorage.clear();
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/auth/login']);
  }

  /**
   * Navigation vers le panneau d'administration
   */
  onAdminAction(): void {
    console.log('=== BOUTON ADMIN CLIQUÉ ===');
    console.log('isAdmin:', this.isAdmin);
    console.log('URL actuelle:', this.router.url);
    console.log('Navigation vers: /modules/admin/dashboard');
    
    // Navigation avec gestion d'erreur complète
    this.router.navigate(['/modules/admin/dashboard'])
      .then(
        (success) => {
          console.log('✅ Navigation réussie:', success);
          console.log('Nouvelle URL:', this.router.url);
        }
      )
      .catch(
        (error) => {
          console.error('❌ Erreur de navigation:', error);
        }
      );
  }
}

