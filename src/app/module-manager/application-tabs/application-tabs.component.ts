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

  applications: Application[] = [
    {
      id: 'douaneconnect',
      name: 'DouaneConnect',
      description: 'Plateforme centrale de gestion des services douaniers',
      icon: 'ri-dashboard-line',
      color: '#0d6846',
      route: '/pages'
    },
    {
      id: 'sygdrd',
      name: 'SYGDRD',
      description: 'Système de Gestion des Droits et Redevances Douaniers',
      icon: 'ri-file-list-3-line',
      color: '#059669',
      route: '/sygdrd'
    },
    {
      id: 'sysrev',
      name: 'SYSREV',
      description: 'Système de Révision',
      icon: 'ri-file-search-line',
      color: '#2563eb',
      route: '/sysrev'
    },
    {
      id: 'sygmak',
      name: 'SYGMAK',
      description: 'Système de Gestion des Magasins et Aires de Dédouanement en King',
      icon: 'ri-building-line',
      color: '#dc2626',
      route: '/sygmak'
    }
  ];

  constructor(
    private router: Router,
    private menuVisibilityService: MenuVisibilityService
  ) { }

  ngOnInit(): void {
    // Masquer le menu au chargement
    this.menuVisibilityService.hideMenu();
  }

  selectApplication(app: Application): void {
    // Définir l'application sélectionnée
    this.menuVisibilityService.setSelectedApp(app.id);
    
    // Rediriger vers l'application
    this.router.navigate([app.route]);
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

