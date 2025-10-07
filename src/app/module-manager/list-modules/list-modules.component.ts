import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-modules',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-modules.component.html',
  styleUrls: ['./list-modules.component.scss']
})
export class ListModulesComponent implements OnInit {

  modules: any[] = [
    {
      id: 1,
      name: 'Gestion Utilisateur',
      description: 'Module de gestion des utilisateurs et des rôles',
      status: 'Actif',
      version: '1.0.0',
      lastUpdate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Comptabilité',
      description: 'Module de gestion comptable et financière',
      status: 'Actif',
      version: '1.2.0',
      lastUpdate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Analyse et Synthèse',
      description: 'Module d\'analyse et de prévision douanière',
      status: 'Actif',
      version: '1.1.0',
      lastUpdate: '2024-01-18'
    },
    {
      id: 4,
      name: 'Tableau de Bord',
      description: 'Module de visualisation et de rapports',
      status: 'En développement',
      version: '0.9.0',
      lastUpdate: '2024-01-22'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onEdit(module: any): void {
    this.router.navigate(['/modules/edit', module.id]);
  }

  onCreate(): void {
    this.router.navigate(['/modules/create']);
  }

  onDelete(module: any): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le module "${module.name}" ?`)) {
      // Logique de suppression
      const index = this.modules.findIndex(m => m.id === module.id);
      if (index > -1) {
        this.modules.splice(index, 1);
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Actif':
        return 'badge bg-success';
      case 'En développement':
        return 'badge bg-warning';
      case 'Inactif':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
