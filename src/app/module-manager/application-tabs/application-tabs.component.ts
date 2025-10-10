import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuVisibilityService } from '../../core/services/menu-visibility.service';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-application-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-tabs.component.html',
  styleUrls: ['./application-tabs.component.scss']
})
export class ApplicationTabsComponent implements OnInit {

  allApplications: Application[] = [
    // {
    //   id: 'douaneconnect',
    //   name: 'DouaneConnect',
    //   description: 'Plateforme centrale de gestion des services douaniers',
    //   icon: 'ri-dashboard-line',
    //   color: '#056946',
    //   route: '/pages'
    // },
    {
      id: 'sygdrd',
      name: 'SYGDRD',
      description: 'Système de Gestion de la Direction des Recettes Douaniere',
      icon: 'ri-file-list-3-line',
      color: '#059669',
      route: '/sygdrd'
    },
    {
      id: 'sysrev',
      name: 'SYSREV',
      description: 'Système de Rendez vous',
      icon: 'ri-file-search-line',
      color: '#2563eb',
      route: '/sysrev'
    },
    {
      id: 'sygmak',
      name: 'SYGMAK',
      description: 'Système de Situation Marketeur',
      icon: 'ri-building-line',
      color: '#dc2626',
      route: '/sygmak'
    }
  ];

  applications: Application[] = [];

  constructor(
    private router: Router,
    private menuVisibilityService: MenuVisibilityService
  ) { }

  ngOnInit(): void {
    // Masquer le menu au chargement
    this.menuVisibilityService.hideMenu();
    
    // Filtrer les applications en fonction de l'utilisateur connecté
    this.filterApplicationsByUser();
  }

  filterApplicationsByUser(): void {
    // Récupérer l'email de l'utilisateur connecté
    const currentUserStr = sessionStorage.getItem('currentUser');
    
    if (!currentUserStr) {
      // Si pas d'utilisateur, afficher seulement SYGMAK
      this.applications = this.allApplications.filter(app => app.id === 'sygmak');
      return;
    }

    const userEmail = JSON.parse(currentUserStr);

    // Filtrer selon l'email de l'utilisateur
    if (userEmail === 'houdy@gmail.com') {
      // Afficher toutes les applications
      this.applications = [...this.allApplications];
    } else if (userEmail === 'issa@gmail.com') {
      // Afficher SYSREV et SYGMAK
      this.applications = this.allApplications.filter(app => 
        app.id === 'sysrev' || app.id === 'sygmak'
      );
    } else {
      // Autres utilisateurs : afficher seulement SYGMAK
      this.applications = this.allApplications.filter(app => app.id === 'sygmak');
    }
  }

  selectApplication(app: Application): void {
    // Définir l'application sélectionnée
    this.menuVisibilityService.setSelectedApp(app.id);
    
    // Petit délai pour s'assurer que le service est mis à jour
    setTimeout(() => {
      // Rediriger vers l'application
      this.router.navigate([app.route]);
    }, 100);
  }

  logout(): void {
    // Nettoyer l'application sélectionnée
    this.menuVisibilityService.clearSelectedApp();
    
    // Nettoyer le sessionStorage
    sessionStorage.clear();
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/auth/login']);
  }
}

