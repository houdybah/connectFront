import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {DashboardSDT, SDTService} from "../../../../services/sdt.service";
import {DemandeCKT} from "../../../../models/DemandeCKT";

@Component({
  selector: 'app-dashboard-sdt',
  templateUrl: './dashboard-sdt.component.html',
  styleUrls: ['./dashboard-sdt.component.scss']
})
export class DashboardSdtComponent implements OnInit {
  dashboard: DashboardSDT | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private SDTService: SDTService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  // Méthodes pour la navigation et les actions
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  refreshData(): void {
    this.loadDashboard();
  }

  exportData(): void {
    // TODO: Implémenter l'export des données
    console.log('Export des données du dashboard SDT');
  }


  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.SDTService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
        console.log('Dashboard chargé:', data);
      },
      error: (error) => {
        console.error('Erreur chargement dashboard:', error);
        this.errorMessage = 'Impossible de charger le tableau de bord';
        this.loading = false;
      }
    });
  }

  traiterDemande(demande: DemandeCKT): void {
    Swal.fire({
      title: 'Traiter cette demande ?',
      text: `Demande ${demande.numero}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, traiter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        
        this.SDTService.traiterDemandeCKT(demande.uuid!, []).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès !',
              text: response.message,
              timer: 2000,
              showConfirmButton: false
            });
            this.loadDashboard();
          },
          error: (error) => {
            console.error('Erreur traitement demande:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: error.error?.error || 'Impossible de traiter la demande'
            });
            this.loading = false;
          }
        });
      }
    });
  }

  assignerCamion(ligneUuid: string): void {
    this.router.navigate(['/douane/sdt/assigner-Camion', ligneUuid]);
  }

  voirDetailsLigne(Ligne: any): void {
    if (Ligne.demandeCKTUuid) {
      this.router.navigate(['/douane/demandes-ckt/Lignes', Ligne.demandeCKTUuid]);
    } else {
      console.error('Pas de demandeCKTUuid pour cette Ligne');
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'en_attente':
        return 'en-attente';
      case 'en_cours':
        return 'en-cours';
      case 'termine':
        return 'termine';
      case 'annule':
        return 'annule';
      default:
        return 'en-attente';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'en_attente':
        return 'fa-clock';
      case 'en_cours':
        return 'fa-play-circle';
      case 'termine':
        return 'fa-check-circle';
      case 'annule':
        return 'fa-times-circle';
      default:
        return 'fa-clock';
    }
  }
}






