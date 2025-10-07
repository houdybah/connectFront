import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {DemandeCKT} from "../../../../models/DemandeCKT";
import {Ligne} from "../../../../models/Ligne";
import {LigneService} from "../../../../services/ligne.service";
import {DemandeCKTService} from "../../../../services/demande-ckt.service";

@Component({
  selector: 'app-gestion-lignes',
  templateUrl: './gestion-lignes.component.html',
  styleUrls: ['./gestion-lignes.component.scss']
})
export class GestionLignesComponent implements OnInit, OnDestroy {
  demandeCKTUuid: string = '';
  demandeCKT: DemandeCKT | null = null;
  lignes: Ligne[] = [];
  loading = false;
  generatingLignes = false;

  // Statistiques
  stats = {
    totalLignes: 0,
    capaciteTotale: 0,
    occupationTotale: 0,
    tauxOccupation: 0,
    placesDisponibles: 0
  };

  // Info utilisateur
  userRole: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    public ligneService: LigneService,
    private DemandeCKTService: DemandeCKTService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userRole = this.getCurrentUserRole();
  }

  ngOnInit(): void {
     this.demandeCKTUuid = this.route.snapshot.params['uuid'];
    console.log('UUID de la demande:', this.demandeCKTUuid);
    
    this.loadDemandeCKT();
    this.loadLignes();
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDemandeCKT(): void {
    this.subscriptions.push(
      this.DemandeCKTService.getDemandeCKTById(this.demandeCKTUuid).subscribe({
        next: (demandeCKTData) => {
          this.demandeCKT = demandeCKTData;
          console.log('Demande CKT chargée:', demandeCKTData);
        },
        error: (error) => {
          console.error('Erreur chargement demande CKT:', error);
          
          if (error.status === 401) {
            alert('Session expirée. Veuillez vous reconnecter.');
            this.router.navigate(['/login']);
          } else if (error.status === 404) {
            alert('Demande CKT introuvable');
            this.router.navigate(['/douane/demandes-ckt']);
          } else {
            alert('Erreur lors du chargement de la demande CKT');
            this.router.navigate(['/douane/demandes-ckt']);
          }
        }
      })
    );
  }

  loadLignes(): void {
    this.loading = true;
    
    this.subscriptions.push(
      this.ligneService.getLignesByDemandeCKT(this.demandeCKTUuid).subscribe({
        next: (lignes) => {
          console.log('Lignes chargées:', lignes.length);
          this.lignes = lignes.sort((a, b) => {
            return a.heure.localeCompare(b.heure);
          });
          this.calculateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement lignes:', error);
          this.loading = false;
          
          if (error.status === 401) {
            alert('Session expirée. Veuillez vous reconnecter.');
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            alert('Accès refusé : vous devez avoir le rôle SDT, ADMIN ou DOUANE');
          } else {
            alert('Erreur lors du chargement des lignes');
          }
        }
      })
    );
  }

  calculateStats(): void {
    this.stats.totalLignes = this.lignes.length;
    this.stats.capaciteTotale = this.lignes.reduce((sum, l) => sum + l.capacite, 0);
    
    this.stats.occupationTotale = this.lignes.reduce((sum, l) => {
      const occupation = l.compositionLignes?.length || 0;
      return sum + occupation;
    }, 0);
    
    this.stats.placesDisponibles = this.stats.capaciteTotale - this.stats.occupationTotale;
    this.stats.tauxOccupation = this.stats.capaciteTotale > 0 
      ? Math.round((this.stats.occupationTotale / this.stats.capaciteTotale) * 100) 
      : 0;
  }

  genererLignes(): void {
    alert('Fonctionnalité de génération automatique non disponible.\nVeuillez créer les lignes manuellement via le bouton "Créer une Ligne".');
  }

  creerLigne(): void {
    // Vérifier le rôle SDT
    if (!this.ligneService.isSDT() && !this.ligneService.isAdminOrDouane()) {
      alert('Seuls les utilisateurs SDT peuvent créer des lignes');
      return;
    }
    
    this.router.navigate(['/douane/Lignes/create'], {
      queryParams: { demandeCKTUuid: this.demandeCKTUuid }
    });
  }

  supprimerLigne(uuid: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette Ligne ?')) {
      this.subscriptions.push(
        this.ligneService.deleteLigne(uuid).subscribe({
          next: () => {
            alert('Ligne supprimée avec succès');
            this.loadLignes();
          },
          error: (error) => {
            console.error('Erreur suppression:', error);
            
            if (error.status === 403) {
              alert('Accès refusé : Vous ne pouvez supprimer que vos propres lignes');
            } else {
              const errorMsg = error.error?.error || 'Erreur lors de la suppression de la Ligne';
              alert(errorMsg);
            }
          }
        })
      );
    }
  }

  composerLigne(uuid: string): void {
    this.router.navigate(['/douane/Lignes/composer', uuid]);
  }

  retour(): void {
  const role = this.userRole;
  
  // Si on vient du dashboard SDT, y retourner
  const previousUrl = sessionStorage.getItem('previousUrl');
  
  if (previousUrl && previousUrl.includes('sdt/Dashboard')) {
    this.router.navigate(['/douane/sdt/Dashboard']);
    return;
  }
  
  // Sinon, navigation selon le rôle
  switch(role) {
    case 'SDT':
      this.router.navigate(['/douane/sdt/Dashboard']);
      break;
    
    case 'CKT':
      this.router.navigate(['/douane/demandes-ckt']);
      break;
    
    case 'DOUANE':
    case 'ADMIN':
      this.router.navigate(['/douane/demandes-ckt']);
      break;
    
    default:
      this.router.navigate(['/tableaudebord']);
      break;
  }
}

  getCurrentUserRole(): string {
    const role = sessionStorage.getItem('role') || '';
    return role.replace(/"/g, '');
  }

  getStatutBadgeClass(status: string): string {
    switch(status) {
      case 'EN_ATTENTE': return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'TERMINE': return 'badge-success';
      case 'ANNULE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getOccupationPercentage(Ligne: Ligne): number {
    const occupation = Ligne.compositionLignes?.length || 0;
    return Ligne.capacite > 0 ? Math.round((occupation / Ligne.capacite) * 100) : 0;
  }

  getOccupationClass(Ligne: Ligne): string {
    const percentage = this.getOccupationPercentage(Ligne);
    if (percentage < 50) return 'occupation-low';
    if (percentage < 80) return 'occupation-medium';
    return 'occupation-high';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'EN_ATTENTE': return 'fa-clock';
      case 'EN_COURS': return 'fa-spinner';
      case 'TERMINE': return 'fa-check-circle';
      case 'ANNULE': return 'fa-times-circle';
      default: return 'fa-question-circle';
    }
  }
}






