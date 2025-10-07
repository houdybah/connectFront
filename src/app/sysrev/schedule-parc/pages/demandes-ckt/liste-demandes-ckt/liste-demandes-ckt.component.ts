import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormDemandeCktComponent } from '../form-demande-ckt/form-demande-ckt.component';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {DemandeCKT} from "../../../../models/DemandeCKT";
import {DemandeCKTService} from "../../../../services/demande-ckt.service";

@Component({
  selector: 'app-liste-demandes-ckt',
  templateUrl: './liste-demandes-ckt.component.html',
  styleUrls: ['./liste-demandes-ckt.component.scss']
})
export class ListeDemandesCktComponent implements OnInit, OnDestroy {
  demandes: DemandeCKT[] = [];
  filteredDemandes: DemandeCKT[] = [];
  loading = false;
  userRole: string = '';
  
  selectedDate: string = '';
  selectedHoraire: string = '';
  
  horaireOptions = [
    { value: '', label: 'Tous' },
    { value: 'MATIN', label: 'Matin' },
    { value: 'APRES_MIDI', label: 'Après-midi' },
    { value: 'JOURNEE', label: 'Journée complète' }
  ];
  
  stats = {
    total: 0,
    aujourdhui: 0,
    capaciteTotale: 0
  };
  
  private subscriptions: Subscription[] = [];

  constructor(
    private DemandeCKTService: DemandeCKTService,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.userRole = this.tokenStorage.getRole();
  }

  ngOnInit(): void {
    this.loadDemandes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDemandes(): void {
    this.loading = true;
    
    const loadObservable = this.DemandeCKTService.isCKT() 
      ? this.DemandeCKTService.getMyDemandes()
      : this.DemandeCKTService.getAllDemandeCKT();

    this.subscriptions.push(
      loadObservable.subscribe({
        next: (demandes) => {
          this.demandes = demandes;
          
          if (this.selectedDate) {
            this.filteredDemandes = demandes.filter(d => d.date === this.selectedDate);
          } else {
            this.filteredDemandes = demandes;
          }
          
          this.applyFilters();
          this.calculateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.loading = false;
          
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'Session expirée',
              text: 'Veuillez vous reconnecter'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else if (error.status === 403) {
            Swal.fire({
              icon: 'error',
              title: 'Accès refusé',
              text: 'Vous n\'avez pas les permissions nécessaires'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: error.error?.error || 'Impossible de charger les demandes'
            });
          }
        }
      })
    );
  }

  applyFilters(): void {
    this.filteredDemandes = this.demandes.filter(demande => {
      const matchDate = !this.selectedDate || demande.date === this.selectedDate;
      const matchHoraire = !this.selectedHoraire || demande.horaire === this.selectedHoraire;
      return matchDate && matchHoraire;
    });
  }

  calculateStats(): void {
    this.stats.total = this.demandes.length;
    this.stats.aujourdhui = this.filteredDemandes.length;
    this.stats.capaciteTotale = this.filteredDemandes.reduce((sum, d) => sum + d.capacite, 0);
  }

  onDateChange(): void {
    this.loadDemandes();
  }

  onHoraireChange(): void {
    this.applyFilters();
    this.calculateStats();
  }

  nouvelleDemande(): void {
    const modalRef = this.modalService.open(FormDemandeCktComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadDemandes();
        }
      },
      () => {}
    );
  }

  modifierDemande(uuid: string): void {
    const demande = this.demandes.find(d => d.uuid === uuid);
    if (!demande) return;

    const modalRef = this.modalService.open(FormDemandeCktComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.demande = demande;
    modalRef.componentInstance.demandeUuid = uuid;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadDemandes();
        }
      },
      () => {}
    );
  }

  supprimerDemande(uuid: string): void {
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
        this.subscriptions.push(
          this.DemandeCKTService.deleteDemandeCKT(uuid).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Supprimé !',
                text: 'La demande a été supprimée',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadDemandes();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.error?.error || 'Impossible de supprimer la demande'
              });
            }
          })
        );
      }
    });
  }

  voirLignes(uuid: string): void {
    this.router.navigate(['douane/demandes-ckt/Lignes', uuid]);
  }

  getHoraireBadgeClass(horaire: string): string {
    return 'badge-horaire';
  }

  getHoraireIcon(horaire: string): string {
    switch(horaire) {
      case 'MATIN': return 'fa-sun';
      case 'APRES_MIDI': return 'fa-cloud-sun';
      case 'JOURNEE': return 'fa-calendar-day';
      default: return 'fa-clock';
    }
  }

  getHoraireLabel(horaire: string): string {
    switch(horaire) {
      case 'MATIN': return 'Matin';
      case 'APRES_MIDI': return 'Après-midi';
      case 'JOURNEE': return 'Journée';
      default: return horaire;
    }
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }
}






