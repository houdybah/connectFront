import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {ConteneurService} from "../../../../services/conteneur.service";


@Component({
  selector: 'app-liste-programmes',
  templateUrl: './liste-programmes.component.html',
  styleUrls: ['./liste-programmes.component.scss']
})
export class ListeProgrammesComponent implements OnInit {
  rendezVous: any[] = [];
  loading = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private conteneurService: ConteneurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRendezVousValides();
  }

  loadRendezVousValides(): void {
    this.loading = true;
    this.errorMessage = '';

    this.conteneurService.getRendezVousValidesSYC(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.rendezVous = response.data || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.currentPage || 0;
        this.loading = false;
        
        console.log('✅ RDV validés chargés:', this.rendezVous.length);
      },
      error: (error) => {
        console.error('❌ Erreur chargement RDV validés:', error);
        this.errorMessage = 'Impossible de charger les rendez-vous validés';
        this.loading = false;
      }
    });
  }

  viewDetails(rdv: any): void {
    console.log('📋 Détails RDV:', rdv);
    
    const validiteDate = rdv.validite ? new Date(rdv.validite).toLocaleDateString('fr-FR') : 'N/A';
    
    Swal.fire({
      title: `Rendez-vous ${rdv.numero || rdv.reference}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Référence:</strong> ${rdv.reference || 'N/A'}</p>
          <p><strong>Destination:</strong> ${rdv.destination || 'N/A'}</p>
          <p><strong>Commune:</strong> ${rdv.commune || 'N/A'}</p>
          <hr>
          <h4>Validation SDT</h4>
          <p><strong>Zone:</strong> ${rdv.zone || 'N/A'}</p>
          <p><strong>Position:</strong> ${rdv.position || 'N/A'}</p>
          <p><strong>Validité:</strong> ${validiteDate}</p>
          <hr>
          <h4>Chauffeur & Camion</h4>
          <p><strong>Chauffeur:</strong> ${rdv.SysrevCamionChauffeur?.Chauffeur?.nom || ''} ${rdv.SysrevCamionChauffeur?.Chauffeur?.prenom || 'N/A'}</p>
          <p><strong>Téléphone:</strong> ${rdv.SysrevCamionChauffeur?.Chauffeur?.phone || 'N/A'}</p>
          <p><strong>Camion:</strong> ${rdv.SysrevCamionChauffeur?.Camion?.immatriculation || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      width: '600px'
    });
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadRendezVousValides();
      window.scrollTo(0, 0);
    }
  }

  refresh(): void {
    this.currentPage = 0;
    this.loadRendezVousValides();
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}







