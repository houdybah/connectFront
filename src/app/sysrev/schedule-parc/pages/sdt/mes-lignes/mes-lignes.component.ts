import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {DemandeCKT} from "../../../../models/DemandeCKT";
import {SDTService} from "../../../../services/sdt.service";
import {LigneService} from "../../../../services/ligne.service";

export interface LigneWithDemande {
  uuid?: string;
  numero?: string;
  date?: string;
  heure?: string;
  capacite?: number;
  status?: string;
  demandeCKTUuid?: string;
  horaire?: string;
  demandeCKT?: DemandeCKT;
  nombreRendezVous?: number;
}

@Component({
  selector: 'app-mes-lignes',
  templateUrl: './mes-lignes.component.html',
  styleUrls: ['./mes-lignes.component.scss']
})
export class MesLignesComponent implements OnInit {
  lignes: LigneWithDemande[] = [];
  filteredLignes: LigneWithDemande[] = [];
  demandes: DemandeCKT[] = [];
  loading = false;
  errorMessage = '';

  // Filtres
  selectedDemande = '';
  selectedHoraire = '';
  selectedStatut = '';
  searchTerm = '';

  // Options de filtrage
  horairesOptions = [
    { value: '06:00', label: '06:00' },
    { value: '08:00', label: '08:00' },
    { value: '10:00', label: '10:00' },
    { value: '12:00', label: '12:00' },
    { value: '14:00', label: '14:00' },
    { value: '16:00', label: '16:00' },
    { value: '18:00', label: '18:00' },
    { value: '20:00', label: '20:00' }
  ];

  statutsOptions = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINE', label: 'Terminé' },
    { value: 'ANNULE', label: 'Annulé' }
  ];

  constructor(
    private SDTService: SDTService,
    private LigneService: LigneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLignes();
    this.loadDemandes();
  }

  // Chargement des lignes
  loadLignes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.SDTService.getMesLignes().subscribe({
      next: (lignes) => {
        this.lignes = lignes.map(Ligne => ({
          ...Ligne,
          demandeCKT: this.demandes.find(d => d.uuid === Ligne.demandeCKTUuid)
        }));
        this.applyFilters();
        this.loading = false;
        console.log('Lignes chargées:', this.lignes);
      },
      error: (error) => {
        console.error('Erreur chargement lignes:', error);
        this.errorMessage = 'Impossible de charger les lignes';
        this.loading = false;
      }
    });
  }

  // Chargement des demandes pour les filtres
  loadDemandes(): void {
    this.SDTService.getDemandesEnAttente().subscribe({
      next: (demandes) => {
        this.demandes = demandes;
        // Recharger les lignes pour associer les demandes
        if (this.lignes.length > 0) {
          this.lignes = this.lignes.map(Ligne => ({
            ...Ligne,
            demandeCKT: this.demandes.find(d => d.uuid === Ligne.demandeCKTUuid)
          }));
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Erreur chargement demandes:', error);
      }
    });
  }

  // Application des filtres
  applyFilters(): void {
    let filtered = [...this.lignes];

    // Filtre par demande
    if (this.selectedDemande) {
      filtered = filtered.filter(Ligne => 
        Ligne.demandeCKTUuid === this.selectedDemande
      );
    }

    // Filtre par horaire
    if (this.selectedHoraire) {
      filtered = filtered.filter(Ligne => 
        Ligne.heure === this.selectedHoraire
      );
    }

    // Filtre par statut
    if (this.selectedStatut) {
      filtered = filtered.filter(Ligne => 
        Ligne.status?.toUpperCase() === this.selectedStatut
      );
    }

    // Filtre par recherche textuelle
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(Ligne => 
        Ligne.numero?.toLowerCase().includes(term) ||
        Ligne.demandeCKT?.numero?.toLowerCase().includes(term) ||
        Ligne.date?.toLowerCase().includes(term)
      );
    }

    this.filteredLignes = filtered;
  }

  // Effacer les filtres
  clearFilters(): void {
    this.selectedDemande = '';
    this.selectedHoraire = '';
    this.selectedStatut = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  // Actualiser les données
  refreshData(): void {
    this.loadLignes();
    this.loadDemandes();
  }

  // Actions sur les lignes
  voirDetails(Ligne: LigneWithDemande): void {
    if (Ligne.demandeCKTUuid) {
      this.router.navigate(['/douane/schedule-parc/demandes-ckt/Lignes', Ligne.demandeCKTUuid]);
    } else {
      Swal.fire('Information', 'Aucune demande associée à cette Ligne', 'info');
    }
  }

  assignerCamion(Ligne: LigneWithDemande): void {
    // Vérifier si la Ligne est clôturée
    if (this.isLigneCloturee(Ligne)) {
      Swal.fire({
        icon: 'warning',
        title: 'Ligne clôturée',
        text: 'Cette Ligne est complètement remplie. Impossible d\'assigner de nouveaux camions.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (Ligne.uuid) {
      this.router.navigate(['/douane/sdt/assigner-Camion', Ligne.uuid]);
    }
  }

  modifierLigne(Ligne: LigneWithDemande): void {
    if (Ligne.uuid) {
      this.router.navigate(['/douane/schedule-parc/Lignes/modifier', Ligne.uuid]);
    }
  }

  supprimerLigne(Ligne: LigneWithDemande): void {
    // Vérifier si la suppression est désactivée
    if (this.isSuppressionDesactivee(Ligne)) {
      Swal.fire({
        icon: 'warning',
        title: 'Suppression impossible',
        text: this.getMessageSuppression(Ligne),
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title: 'Supprimer cette Ligne ?',
      text: `Ligne ${Ligne.numero}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        
        // TODO: Implémenter la suppression côté backend
        // this.LigneService.deleteLigne(Ligne.uuid!).subscribe({
        //   next: () => {
        //     Swal.fire('Supprimé !', 'La Ligne a été supprimée.', 'success');
        //     this.loadLignes();
        //   },
        //   error: (error) => {
        //     console.error('Erreur suppression:', error);
        //     Swal.fire('Erreur', 'Impossible de supprimer la Ligne', 'error');
        //     this.loading = false;
        //   }
        // });

        // Simulation pour l'instant
        setTimeout(() => {
          Swal.fire('Supprimé !', 'La Ligne a été supprimée.', 'success');
          this.loadLignes();
        }, 1000);
      }
    });
  }

  // Méthodes utilitaires pour la gestion des boutons
  isLigneCloturee(Ligne: LigneWithDemande): boolean {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    return (capacite - nombreRendezVous) === 0;
  }

  isSuppressionDesactivee(Ligne: LigneWithDemande): boolean {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    const placesRestantes = capacite - nombreRendezVous;
    
    // Désactiver la suppression si :
    // 1. La Ligne est clôturée (placesRestantes = 0)
    // 2. La Ligne est en cours (placesRestantes > 0 et < capacite)
    return placesRestantes === 0 || (placesRestantes > 0 && placesRestantes !== capacite);
  }

  getMessageSuppression(Ligne: LigneWithDemande): string {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    const placesRestantes = capacite - nombreRendezVous;
    
    if (placesRestantes === 0) {
      return 'Ligne clôturée - Impossible de supprimer';
    } else if (placesRestantes > 0 && placesRestantes !== capacite) {
      return 'Ligne en cours - Impossible de supprimer';
    } else {
      return 'Supprimer la Ligne';
    }
  }

  // Méthodes utilitaires pour l'affichage
  getStatusClass(Ligne: LigneWithDemande): string {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    const placesRestantes = capacite - nombreRendezVous;
    
    if (placesRestantes === capacite) {
      return 'bg-warning'; // EN ATTENTE
    } else if (placesRestantes > 0) {
      return 'bg-primary'; // EN COURS
    } else {
      return 'bg-success'; // CLOTURE
    }
  }

  getStatusIcon(Ligne: LigneWithDemande): string {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    const placesRestantes = capacite - nombreRendezVous;
    
    if (placesRestantes === capacite) {
      return 'fa-clock'; // EN ATTENTE
    } else if (placesRestantes > 0) {
      return 'fa-play-circle'; // EN COURS
    } else {
      return 'fa-check-circle'; // CLOTURE
    }
  }

  getStatusText(Ligne: LigneWithDemande): string {
    const capacite = Ligne.capacite || 0;
    const nombreRendezVous = Ligne.nombreRendezVous || 0;
    const placesRestantes = capacite - nombreRendezVous;
    
    if (placesRestantes === capacite) {
      return 'EN ATTENTE';
    } else if (placesRestantes > 0) {
      return 'EN COURS';
    } else {
      return 'CLOTURE';
    }
  }

  // Export des données
  exportData(): void {
    // TODO: Implémenter l'export Excel/CSV
    console.log('Export des lignes:', this.filteredLignes);
    Swal.fire('Information', 'Fonctionnalité d\'export en cours de développement', 'info');
  }

  // Statistiques
  getStats() {
    const enAttente = this.lignes.filter(l => {
      const capacite = l.capacite || 0;
      const nombreRendezVous = l.nombreRendezVous || 0;
      return (capacite - nombreRendezVous) === capacite;
    }).length;
    
    const enCours = this.lignes.filter(l => {
      const capacite = l.capacite || 0;
      const nombreRendezVous = l.nombreRendezVous || 0;
      const placesRestantes = capacite - nombreRendezVous;
      return placesRestantes > 0 && placesRestantes !== capacite;
    }).length;
    
    const cloturees = this.lignes.filter(l => {
      const capacite = l.capacite || 0;
      const nombreRendezVous = l.nombreRendezVous || 0;
      return (capacite - nombreRendezVous) === 0;
    }).length;
    
    return {
      total: this.lignes.length,
      enAttente: enAttente,
      enCours: enCours,
      cloturees: cloturees
    };
  }
}







