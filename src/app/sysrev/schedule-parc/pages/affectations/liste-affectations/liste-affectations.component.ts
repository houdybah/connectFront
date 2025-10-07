import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormAffectationComponent } from '../form-affectation/form-affectation.component';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import {
  CamionChauffeur,
  EnumStatusCamionChauffeur,
  EnumStatusEtat,
  StatusCamionChauffeurLabels, StatusEtatLabels
} from "../../../../models/CamionChauffeur";
import {AffectationService} from "../../../../services/affectation.service";

@Component({
  selector: 'app-liste-affectations',
  templateUrl: './liste-affectations.component.html',
  styleUrls: ['./liste-affectations.component.scss']
})
export class ListeAffectationsComponent implements OnInit {
  affectations: CamionChauffeur[] = [];
  filteredAffectations: CamionChauffeur[] = [];
  loading = false;
  userRole: string = '';
  
  EnumStatusCamionChauffeur = EnumStatusCamionChauffeur;
  EnumStatusEtat = EnumStatusEtat;
  StatusCamionChauffeurLabels = StatusCamionChauffeurLabels;
  StatusEtatLabels = StatusEtatLabels;
  
  activeFilter: 'tous' | 'actifs' | 'inactifs' | 'mission' = 'tous';
  
  stats = {
    total: 0,
    actifs: 0,
    inactifs: 0,
    enMission: 0
  };

  constructor(
    private AffectationService: AffectationService,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.userRole = this.tokenStorage.getRole();
    this.loadAffectations();
  }

  loadAffectations(): void {
    this.loading = true;
    this.AffectationService.getAllAffectations().subscribe({
      next: (affectations) => {
        this.affectations = affectations;
        this.filteredAffectations = [...this.affectations];
        this.calculateStats();
        this.applyFilter(this.activeFilter);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement affectations:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les affectations'
        });
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.affectations.length;
    this.stats.actifs = this.affectations.filter(a => a.status === EnumStatusCamionChauffeur.ACTIF).length;
    this.stats.inactifs = this.affectations.filter(a => a.status === EnumStatusCamionChauffeur.INACTIF).length;
    this.stats.enMission = this.affectations.filter(a => a.statusEtat === EnumStatusEtat.EN_MISSION).length;
  }

  applyFilter(filter: 'tous' | 'actifs' | 'inactifs' | 'mission'): void {
    this.activeFilter = filter;
    
    switch(filter) {
      case 'actifs':
        this.filteredAffectations = this.affectations.filter(a => a.status === EnumStatusCamionChauffeur.ACTIF);
        break;
      case 'inactifs':
        this.filteredAffectations = this.affectations.filter(a => a.status === EnumStatusCamionChauffeur.INACTIF);
        break;
      case 'mission':
        this.filteredAffectations = this.affectations.filter(a => a.statusEtat === EnumStatusEtat.EN_MISSION);
        break;
      default:
        this.filteredAffectations = [...this.affectations];
    }
  }

  nouvelleAffectation(): void {
    // Vérifier les permissions
    if (!this.hasPermission()) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les permissions nécessaires'
      });
      return;
    }

    const modalRef = this.modalService.open(FormAffectationComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadAffectations();
        }
      },
      () => {}
    );
  }

  modifierAffectation(uuid: string): void {
    if (!this.hasPermission()) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les permissions nécessaires'
      });
      return;
    }

    const affectation = this.affectations.find(a => a.uuid === uuid);
    if (!affectation) return;

    const modalRef = this.modalService.open(FormAffectationComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.affectation = affectation;
    modalRef.componentInstance.affectationUuid = uuid;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadAffectations();
        }
      },
      () => {}
    );
  }

  supprimerAffectation(uuid: string): void {
    if (!this.hasPermission()) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les permissions nécessaires'
      });
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AffectationService.deleteAffectation(uuid).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'L\'affectation a été supprimée',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAffectations();
          },
          error: (error) => {
            console.error('Erreur suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer l\'affectation'
            });
          }
        });
      }
    });
  }

  hasPermission(): boolean {
    const allowedRoles = ['ADMIN', 'CHEF_BUREAU_PARC', 'SDT'];
    return allowedRoles.includes(this.userRole);
  }

  voirDetails(uuid: string): void {
    // Implémenter la vue détails si nécessaire
    console.log('Voir détails:', uuid);
  }

  getStatusBadgeClass(status: EnumStatusCamionChauffeur): string {
    switch(status) {
      case EnumStatusCamionChauffeur.ACTIF: return 'badge-success';
      case EnumStatusCamionChauffeur.INACTIF: return 'badge-secondary';
      case EnumStatusCamionChauffeur.SUSPENDU: return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getEtatBadgeClass(etat: EnumStatusEtat): string {
    switch(etat) {
      case EnumStatusEtat.DISPONIBLE: return 'badge-success';
      case EnumStatusEtat.EN_MISSION: return 'badge-warning';
      case EnumStatusEtat.OCCUPE: return 'badge-danger';
      case EnumStatusEtat.HORS_SERVICE: return 'badge-secondary';
      case EnumStatusEtat.EN_REPARATION: return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getPositionBadgeClass(position: string | undefined): string {
    if (!position) return 'badge-secondary';
    switch(position.toUpperCase()) {
      case 'TERMINAL': return 'badge-primary';
      case 'PARC': return 'badge-info';
      case 'EN_ROUTE': return 'badge-warning';
      case 'GARAGE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeSince(date: Date | undefined): string {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours}h`;
    return 'À l\'instant';
  }

  getInitials(nom: string, prenom: string): string {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  }
}






