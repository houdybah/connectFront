import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import Swal from 'sweetalert2';
import {Chauffeur} from "../../../../models/Chauffeur";
import {FormAffectationComponent} from "../../affectations/form-affectation/form-affectation.component";
import {FormChauffeurComponent} from "../form-chauffeur/form-chauffeur.component";
import {ChauffeurService} from "../../../../services/chauffeur.service";

@Component({
  selector: 'app-liste-chauffeurs',
  templateUrl: './liste-chauffeurs.component.html',
  styleUrls: ['./liste-chauffeurs.component.scss']
})
export class ListeChauffeursComponent implements OnInit, OnDestroy {
  chauffeurs: Chauffeur[] = [];
  filteredChauffeurs: Chauffeur[] = [];
  loading = false;
  searchKeyword = '';
  userRole: string = '';
  
  stats = {
    total: 0,
    actifs: 0,
    enMission: 0,
    disponibles: 0
  };
  
  private subscriptions: Subscription[] = [];

  constructor(
    private chauffeurService: ChauffeurService,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.userRole = this.tokenStorage.getRole();
    this.loadChauffeurs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadChauffeurs(): void {
    this.loading = true;
    
    this.subscriptions.push(
      this.chauffeurService.getAllChauffeurs().subscribe({
        next: (data) => {
          this.chauffeurs = data;
          this.filteredChauffeurs = [...this.chauffeurs];
          this.calculateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement chauffeurs:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger les chauffeurs'
          });
          this.loading = false;
        }
      })
    );
  }

  
  calculateStats(): void {
  this.stats.total = this.chauffeurs.length;
  this.stats.actifs = this.chauffeurs.filter(c => this.isChauffeurAffecte(c)).length;
  this.stats.disponibles = this.stats.total - this.stats.actifs;
  this.stats.enMission = Math.floor(this.stats.actifs * 0.5);
}
  onSearch(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredChauffeurs = this.chauffeurs;
      return;
    }

    const term = this.searchKeyword.toLowerCase();
    this.filteredChauffeurs = this.chauffeurs.filter(Chauffeur =>
      Chauffeur.nom.toLowerCase().includes(term) ||
      Chauffeur.prenom.toLowerCase().includes(term) ||
      Chauffeur.phone.includes(term) ||
      Chauffeur.permis.toLowerCase().includes(term)
    );
  }

  nouveauChauffeur(): void {
    if (!this.hasPermission()) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les permissions nécessaires'
      });
      return;
    }

    const modalRef = this.modalService.open(FormChauffeurComponent, {
      size: 'xl',              
    backdrop: 'static',
    centered: false,          
    scrollable: true,         
    windowClass: 'modal-Chauffeur' 
    });

    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadChauffeurs();
        }
      },
      () => {}
    );
  }

  modifierChauffeur(uuid: string): void {
    if (!this.hasPermission()) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les permissions nécessaires'
      });
      return;
    }

    const Chauffeur = this.chauffeurs.find(c => c.uuid === uuid);
    if (!Chauffeur) return;

    const modalRef = this.modalService.open(FormChauffeurComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.Chauffeur = Chauffeur;
    modalRef.componentInstance.chauffeurUuid = uuid;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.loadChauffeurs();
        }
      },
      () => {}
    );
  }
isChauffeurAffecte(Chauffeur: Chauffeur): boolean {
  console.log('Chauffeur:', Chauffeur.nom, Chauffeur.prenom);
  console.log('camionChauffeurs:', Chauffeur.camionChauffeurs);
  
  const isAffecte = !!Chauffeur.camionChauffeurs && Chauffeur.camionChauffeurs.length > 0;
  console.log('Est affecté?', isAffecte);
  
  return isAffecte;
}

// ✅ NOUVELLE MÉTHODE : Vérifier si le Chauffeur a une course en cours
hasCourseEnCours(Chauffeur: Chauffeur): boolean {
  if (!Chauffeur.camionChauffeurs || Chauffeur.camionChauffeurs.length === 0) {
    return false;
  }
  
  // Vérifier si au moins une affectation a une course non terminée
  return Chauffeur.camionChauffeurs.some((affectation: any) => {
    // Adaptez selon votre structure de données
    // Vérifiez si la course est terminée (status, dateFinCourse, etc.)
    return affectation.enCours === true || 
           affectation.status === 'EN_COURS' ||
           !affectation.dateFin ||
           affectation.courseTerminee === false;
  });
}

// ✅ NOUVELLE MÉTHODE : Vérifier si le Chauffeur peut être affecté
canBeAffected(Chauffeur: Chauffeur): boolean {
  return !this.hasCourseEnCours(Chauffeur);
}

// Modifier la méthode affecterChauffeur
affecterChauffeur(Chauffeur: Chauffeur): void {
  // ✅ VALIDATION : Vérifier si le Chauffeur a déjà une course en cours
  if (this.hasCourseEnCours(Chauffeur)) {
    Swal.fire({
      icon: 'warning',
      title: 'Course en cours',
      html: `
        <p>Le Chauffeur <strong>${Chauffeur.nom} ${Chauffeur.prenom}</strong> 
        a déjà une course en cours.</p>
        <p>Il ne peut pas être affecté à un autre Camion tant que 
        sa course actuelle n'est pas terminée.</p>
      `,
      confirmButtonText: 'Compris'
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
  modalRef.componentInstance.chauffeurPreselectionne = Chauffeur;

  modalRef.result.then(
    (result) => {
      if (result === 'success') {
        this.loadChauffeurs(); // Recharger pour avoir les nouvelles données
        
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Affectation créée avec succès',
          timer: 2000
        });
      }
    },
    () => {}
  );
}
  supprimerChauffeur(uuid: string): void {
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
        this.subscriptions.push(
          this.chauffeurService.deleteChauffeur(uuid).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Supprimé !',
                text: 'Le Chauffeur a été supprimé',
                timer: 2000,
                showConfirmButton: false
              });
              this.loadChauffeurs();
            },
            error: (error) => {
              console.error('Erreur suppression:', error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de supprimer le Chauffeur'
              });
            }
          })
        );
      }
    });
  }

  voirDetails(uuid: string): void {
    console.log('Voir détails:', uuid);
  }

  getInitials(nom: string, prenom: string): string {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  }

  exportData(): void {
    Swal.fire({
      icon: 'info',
      title: 'Export',
      text: 'Fonctionnalité d\'export en cours de développement'
    });
  }

  hasPermission(): boolean {
    const allowedRoles = ['ADMIN', 'DOUANE','SDT'];
    return allowedRoles.includes(this.userRole);
  }

}





