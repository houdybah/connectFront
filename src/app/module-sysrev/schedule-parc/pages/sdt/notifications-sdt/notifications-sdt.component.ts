import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {DemandeCKT} from "../../../../models/DemandeCKT";
import {RendezVous, RendezVousService} from "../../../../services/rendez-vous.service";
import {SDTService} from "../../../../services/sdt.service";
import {EnumStatusLigne} from "../../../../models/Ligne";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'demande' | 'Ligne' | 'Camion' | 'Chauffeur';
  status: 'unread' | 'read' | 'urgent';
  isRead: boolean;
  isUrgent: boolean;
  createdAt: Date;
  demandeDetails?: {
    numero: string;
    date: string;
    heure: string;
    capacite: number;
    horaire: string;
    statut: string;
    uuid?: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  urgent: number;
}

@Component({
  selector: 'app-notifications-sdt',
  templateUrl: './notifications-sdt.component.html',
  styleUrls: ['./notifications-sdt.component.scss']
})
export class NotificationsSdtComponent implements OnInit, OnDestroy {
  notifications: NotificationItem[] = [];
  filteredNotifications: NotificationItem[] = [];
  stats: NotificationStats | null = null;
  loading = false;
  errorMessage = '';

  // Onglets
  activeTab: 'demandes' | 'rendez-vous' = 'demandes';

  // Données des onglets
  demandes: DemandeCKT[] = [];
  rendezVous: RendezVous[] = [];
  totalRendezVous = 0; // Nombre total de rendez-vous

  // Filtres
  selectedStatus = '';
  selectedType = '';
  selectedDate = '';

  constructor(
    private SDTService: SDTService,
    private rendezVousService: RendezVousService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadRendezVous();
    this.loadNotifications();
  }

  // Méthode pour mettre à jour le nombre total de rendez-vous
  updateTotalRendezVous(count: number): void {
    this.totalRendezVous = count;
  }

  ngOnDestroy(): void {
    // Cleanup si nécessaire
  }

  // Chargement des demandes
  loadDemandes(): void {
    this.SDTService.getDemandesEnAttente().subscribe({
      next: (demandes) => {
        this.demandes = demandes;
        console.log('Demandes chargées:', this.demandes);
      },
      error: (error) => {
        console.error('Erreur chargement demandes:', error);
      }
    });
  }

  // Chargement des rendez-vous
  loadRendezVous(): void {
    this.rendezVousService.getListeRendezVousSortie(0, 50).subscribe({
      next: (response) => {
        this.rendezVous = response.groupes;
        console.log('Rendez-vous chargés:', this.rendezVous);
      },
      error: (error) => {
        console.error('Erreur chargement rendez-vous:', error);
      }
    });
  }

  // Changement d'onglet
  switchTab(tab: 'demandes' | 'rendez-vous'): void {
    this.activeTab = tab;
  }

  // Chargement des notifications
  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';

    // Simulation des données - à remplacer par l'appel API réel
    this.SDTService.getDashboard().subscribe({
      next: (dashboard) => {
        // Convertir les demandes en notifications
        this.notifications = this.convertDemandesToNotifications(dashboard.demandesEnAttente || []);
        this.applyFilters();
        this.loading = false;
        console.log('Notifications chargées:', this.notifications);
      },
      error: (error) => {
        console.error('Erreur chargement notifications:', error);
        this.errorMessage = 'Impossible de charger les notifications';
        this.loading = false;
      }
    });
  }

  // Conversion des demandes CKT en notifications
  private convertDemandesToNotifications(demandes: DemandeCKT[]): NotificationItem[] {
    return demandes.map((demande, index) => ({
      id: `demande-${demande.uuid || index}`,
      title: `Nouvelle demande CKT - ${demande.numero}`,
      message: `Une nouvelle demande CKT a été créée et nécessite votre attention.`,
      type: 'demande' as const,
      status: 'unread' as const,
      isRead: false,
      isUrgent: this.isDemandeUrgent(demande),
      createdAt: new Date(),
      demandeDetails: {
        numero: demande.numero,
        date: demande.date || 'N/A',
        heure: demande.heure || 'N/A',
        capacite: demande.capacite || 0,
        horaire: demande.horaire || 'N/A',
        statut: 'EN_ATTENTE',
        uuid: demande.uuid
      }
    }));
  }

  // Déterminer si une demande est urgente
  private isDemandeUrgent(demande: DemandeCKT): boolean {
    // Logique pour déterminer si une demande est urgente
    // Par exemple: demande créée il y a plus de 24h ou avec une capacité élevée
    const now = new Date();
    const demandeDate = now;
    const hoursDiff = (now.getTime() - demandeDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff > 24 || (demande.capacite || 0) > 50;
  }

  // Calcul des statistiques
  calculateStats(): void {
    if (!this.notifications.length) {
      this.stats = { total: 0, unread: 0, today: 0, urgent: 0 };
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.stats = {
      total: this.notifications.length,
      unread: this.notifications.filter(n => !n.isRead).length,
      today: this.notifications.filter(n => {
        const notificationDate = new Date(n.createdAt);
        return notificationDate >= today;
      }).length,
      urgent: this.notifications.filter(n => n.isUrgent).length
    };
  }

  // Application des filtres
  applyFilters(): void {
    let filtered = [...this.notifications];

    // Filtre par statut
    if (this.selectedStatus) {
      switch (this.selectedStatus) {
        case 'unread':
          filtered = filtered.filter(n => !n.isRead);
          break;
        case 'read':
          filtered = filtered.filter(n => n.isRead);
          break;
        case 'urgent':
          filtered = filtered.filter(n => n.isUrgent);
          break;
      }
    }

    // Filtre par type
    if (this.selectedType) {
      filtered = filtered.filter(n => n.type === this.selectedType);
    }

    // Filtre par date
    if (this.selectedDate) {
      const filterDate = new Date(this.selectedDate);
      filtered = filtered.filter(n => {
        const notificationDate = new Date(n.createdAt);
        return notificationDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredNotifications = filtered;
  }

  // Effacer les filtres
  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedDate = '';
    this.applyFilters();
  }

  // Actualiser les notifications
  refreshNotifications(): void {
    this.loadNotifications();
    this.calculateStats();
  }

  // Marquer une notification comme lue
  markAsRead(notification: NotificationItem): void {
    if (notification.isRead) return;

    notification.isRead = true;
    notification.status = 'read';
    this.calculateStats();
    this.applyFilters();

    // Optionnel: sauvegarder l'état sur le serveur
    console.log('Notification marquée comme lue:', notification.id);
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    Swal.fire({
      title: 'Marquer toutes comme lues ?',
      text: 'Cette action marquera toutes les notifications comme lues.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, marquer toutes',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notifications.forEach(n => {
          n.isRead = true;
          n.status = 'read';
        });
        this.calculateStats();
        this.applyFilters();
        
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Toutes les notifications ont été marquées comme lues.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // Voir les détails d'une notification
  viewDetails(notification: NotificationItem): void {
    if (notification.type === 'demande' && notification.demandeDetails?.uuid) {
      this.router.navigate(['/douane/demandes-ckt/edit', notification.demandeDetails.uuid]);
    } else {
      // Navigation par défaut selon le type
      switch (notification.type) {
        case 'demande':
          this.router.navigate(['/douane/sdt/demandes-ckt']);
          break;
        case 'Ligne':
          this.router.navigate(['/douane/sdt/Lignes']);
          break;
        case 'Camion':
          this.router.navigate(['/douane/sdt/Camions']);
          break;
        case 'Chauffeur':
          this.router.navigate(['/douane/sdt/Chauffeurs']);
          break;
      }
    }
  }

  // Traiter une notification
  processNotification(notification: NotificationItem): void {
    if (notification.type === 'demande' && notification.demandeDetails?.uuid) {
      Swal.fire({
        title: 'Traiter cette demande ?',
        text: `Demande ${notification.demandeDetails.numero}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, traiter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          
          this.SDTService.traiterDemandeCKT(notification.demandeDetails!.uuid!, []).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Succès !',
                text: response.message,
                timer: 2000,
                showConfirmButton: false
              });
              this.loadNotifications();
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
  }

  // Ignorer une notification
  dismissNotification(notification: NotificationItem): void {
    Swal.fire({
      title: 'Ignorer cette notification ?',
      text: 'Cette notification sera supprimée de votre liste.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, ignorer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index > -1) {
          this.notifications.splice(index, 1);
          this.calculateStats();
          this.applyFilters();
          
          Swal.fire({
            icon: 'success',
            title: 'Notification ignorée',
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
    });
  }

  // Méthodes utilitaires pour l'affichage
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'demande': return 'fa-ship';
      case 'Ligne': return 'fa-route';
      case 'Camion': return 'fa-truck';
      case 'Chauffeur': return 'fa-user';
      default: return 'fa-bell';
    }
  }

  getNotificationIconClass(type: string): string {
    return type;
  }

  getStatusBadgeClass(status: string): string {
    return status;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'unread': return 'Non lue';
      case 'read': return 'Lue';
      case 'urgent': return 'Urgente';
      default: return status;
    }
  }

  getDemandeStatusClass(statut: string): string {
    return statut?.toUpperCase() || 'EN_ATTENTE';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Méthodes pour les demandes
  viewDemandeDetails(demande: DemandeCKT): void {
    if (demande.uuid) {
      this.router.navigate(['/douane/schedule-parc/demandes-ckt/edit', demande.uuid]);
    }
  }

  processDemande(demande: DemandeCKT): void {
    if (!demande.uuid) return;

    // Calculer le nombre de lignes nécessaires
    const capacite = demande.capacite || 0;
    const maxCamionsParLigne = 15;
    const nombreLignes = Math.ceil(capacite / maxCamionsParLigne);


    console.log(`Nombre de lignes à créer: ${nombreLignes} pour la demande ${demande.numero}`);

    // Créer automatiquement les lignes pour cette demande
    this.creerLignesPourDemande(demande, capacite, maxCamionsParLigne);
  }

  private generateLignesRepartition(capacite: number, maxCamionsParLigne: number): string {
    let html = '';
    let camionsRestants = capacite;
    let numeroLigne = 1;

    while (camionsRestants > 0) {
      const camionsDansLigne = Math.min(camionsRestants, maxCamionsParLigne);
      html += `<li><i class="fas fa-route text-primary"></i> Ligne ${numeroLigne} : ${camionsDansLigne} camions</li>`;
      camionsRestants -= camionsDansLigne;
      numeroLigne++;
    }

    return html;
  }

  private creerLignesPourDemande(demande: DemandeCKT, capacite: number, maxCamionsParLigne: number): void {
    this.loading = true;
    
    // Calculer la répartition des lignes
    const lignesACreer = this.calculerRepartitionLignes(capacite, maxCamionsParLigne);
    
    // Afficher le progrès
    Swal.fire({
      title: 'Création des lignes en cours...',
      html: `
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p>Création de ${lignesACreer.length} Ligne(s) pour la demande ${demande.numero}</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    // Créer toutes les lignes en une seule fois
    this.creerLignesEnLot(demande, lignesACreer);
  }

  private calculerRepartitionLignes(capacite: number, maxCamionsParLigne: number): Array<{numero: number, capacite: number}> {
    const lignes = [];
    let camionsRestants = capacite;
    let numeroLigne = 1;

    while (camionsRestants > 0) {
      const camionsDansLigne = Math.min(camionsRestants, maxCamionsParLigne);
      lignes.push({
        numero: numeroLigne,
        capacite: camionsDansLigne
      });
      camionsRestants -= camionsDansLigne;
      numeroLigne++;
    }

    return lignes;
  }

  private creerLignesEnLot(demande: DemandeCKT, lignesACreer: Array<{numero: number, capacite: number}>): void {
    // Préparer les données à envoyer au serveur
    const donneesLignes = {
      demandeUuid: demande.uuid,
      demandeNumero: demande.numero,
      lignes: lignesACreer.map(Ligne => ({
        numero: `L${Ligne.numero.toString().padStart(3, '0')}`,
        capacite: Ligne.capacite,
        date: demande.date || '',
        heure: demande.heure || '',
        status: EnumStatusLigne.EN_ATTENTE,
        demandeCKTUuid: demande.uuid || '',
        horaire: demande.horaire || ''

      }))
    };

    console.log('Données à envoyer au serveur:', donneesLignes);

    // Appeler le service avec la liste complète des lignes
    this.SDTService.traiterDemandeCKT(demande.uuid!, donneesLignes.lignes).subscribe({
      next: (response) => {
        // Succès - toutes les lignes ont été créées
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          html: `
            <p>${lignesACreer.length} Ligne(s) créée(s) avec succès pour la demande ${demande.numero}</p>
            <div class="text-start mt-3">
              <strong>Répartition :</strong>
              <ul class="list-unstyled ms-3">
                ${lignesACreer.map(Ligne => 
                  `<li><i class="fas fa-route text-success"></i> Ligne ${Ligne.numero} : ${Ligne.capacite} camions</li>`
                ).join('')}
              </ul>
            </div>
          `,
          timer: 4000,
          showConfirmButton: false
        });
        this.loadDemandes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur création des lignes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          html: `
            <p>Erreur lors de la création des lignes pour la demande ${demande.numero}</p>
            <p class="text-muted">${error.error?.error || 'Erreur inconnue'}</p>
          `
        });
        this.loading = false;
      }
    });
  }

  // Méthodes pour les rendez-vous
  viewRendezVousDetails(rendezVous: RendezVous): void {
    // Navigation vers les détails du rendez-vous
    this.router.navigate(['/douane/schedule-parc/rendez-vous'], {
      queryParams: { numero: rendezVous.numeroRdz }
    });
  }
}






