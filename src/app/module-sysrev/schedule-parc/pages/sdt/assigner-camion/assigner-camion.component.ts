import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {AffectationConteneur} from "../../../../models/AffectationConteneur";
import {LigneService} from "../../../../services/ligne.service";
import {ConteneurService} from "../../../../services/conteneur.service";

@Component({
  selector: 'app-assigner-Camion',
  templateUrl: './assigner-camion.component.html',
  styleUrls: ['./assigner-camion.component.scss']
})
export class AssignerCamionComponent implements OnInit {
  ligneUuid: string = '';
  Ligne: any = null;
  rendezVousDisponibles: AffectationConteneur[] = [];
  rendezVousSelectionnes: AffectationConteneur[] = [];
  loading = false;

  // Configuration de la sélection
  readonly MAX_RENDEZ_VOUS_PAR_LIGNE = 15;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LigneService: LigneService,
    private rendezVousService: ConteneurService
  ) {}

  ngOnInit(): void {
    this.ligneUuid = this.route.snapshot.params['uuid'];
    this.loadLigneDetails();
    this.loadRendezVousDisponibles();
  }

  loadLigneDetails(): void {
    this.loading = true;
    this.LigneService.getLigneById(this.ligneUuid).subscribe({
      next: (Ligne) => {
        this.Ligne = Ligne;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement Ligne:', error);
        Swal.fire('Erreur', 'Impossible de charger les détails de la Ligne', 'error');
        this.loading = false;
      }
    });
  }


  loadRendezVousDisponibles(): void {
    this.rendezVousService.getListeRendezVousByValidSyndicat(true).subscribe({
      next: (response) => {
        console.log(response);
        // Trier par ordre d'enregistrement (date de sortie croissante)
        this.rendezVousDisponibles = response.sort((a: AffectationConteneur, b: AffectationConteneur) => {
          const dateA = a.dateSortie ? new Date(a.dateSortie).getTime() : 0;
          const dateB = b.dateSortie ? new Date(b.dateSortie).getTime() : 0;
          return dateA - dateB;
        });
        
        // Initialiser la liste des rendez-vous sélectionnés basée sur isSelectedProgramme
        this.rendezVousSelectionnes = this.rendezVousDisponibles.filter(rv => rv.isSelectedProgramme === true);
        
        console.log('Rendez-vous déjà sélectionnés:', this.rendezVousSelectionnes.length);
      },
      error: (error) => {
        console.error('Erreur chargement rendez-vous:', error);
        Swal.fire('Attention', 'Impossible de charger les rendez-vous disponibles', 'warning');
      }
    });
  }

  onRendezVousSelectionChange(rendezVous: AffectationConteneur, isSelected: boolean): void {
    if (isSelected) {
      // Vérifier la limite de 15 rendez-vous par Ligne
      if (this.getNombreRendezVousSelectionnes() >= this.MAX_RENDEZ_VOUS_PAR_LIGNE) {
        Swal.fire('Limite atteinte', `Maximum ${this.MAX_RENDEZ_VOUS_PAR_LIGNE} rendez-vous par Ligne`, 'warning');
        return;
      }
      
      // Marquer le rendez-vous comme sélectionné
      rendezVous.isSelectedProgramme = true;
    } else {
      // Marquer le rendez-vous comme non sélectionné
      rendezVous.isSelectedProgramme = false;
    }
    
    // Synchroniser la liste des rendez-vous sélectionnés
    this.synchroniserRendezVousSelectionnes();
  }

  isRendezVousSelectionne(rendezVous: AffectationConteneur): boolean {
    return rendezVous.isSelectedProgramme === true;
  }

  /**
   * Obtient le nombre de rendez-vous sélectionnés basé sur isSelectedProgramme
   */
  getNombreRendezVousSelectionnes(): number {
    return this.rendezVousDisponibles.filter(rv => rv.isSelectedProgramme === true).length;
  }

  /**
   * Synchronise la liste rendezVousSelectionnes avec les rendez-vous ayant isSelectedProgramme = true
   */
  synchroniserRendezVousSelectionnes(): void {
    this.rendezVousSelectionnes = this.rendezVousDisponibles.filter(rv => rv.isSelectedProgramme === true);
  }

  selectAllRendezVous(): void {
    const maxToSelect = Math.min(this.MAX_RENDEZ_VOUS_PAR_LIGNE, this.rendezVousDisponibles.length);
    
    // Marquer les premiers rendez-vous comme sélectionnés
    for (let i = 0; i < maxToSelect; i++) {
      this.rendezVousDisponibles[i].isSelectedProgramme = true;
    }
    
    // Marquer les autres comme non sélectionnés
    for (let i = maxToSelect; i < this.rendezVousDisponibles.length; i++) {
      this.rendezVousDisponibles[i].isSelectedProgramme = false;
    }
    
    // Synchroniser la liste
    this.synchroniserRendezVousSelectionnes();
  }

  deselectAllRendezVous(): void {
    // Marquer tous les rendez-vous comme non sélectionnés
    this.rendezVousDisponibles.forEach(rv => {
      rv.isSelectedProgramme = false;
    });
    
    // Synchroniser la liste
    this.synchroniserRendezVousSelectionnes();
  }

  validerSelection(): void {
    if (this.getNombreRendezVousSelectionnes() === 0) {
      Swal.fire('Attention', 'Veuillez sélectionner au moins un rendez-vous', 'warning');
      return;
    }

    this.loading = true;
    
    // Synchroniser avant la validation
    this.synchroniserRendezVousSelectionnes();
    
    // Afficher un résumé de la sélection
    const rendezVousList = this.rendezVousSelectionnes.map(rv => rv.numero || rv.reference).join(', ');
    
    Swal.fire({
      title: 'Confirmer la sélection',
      html: `
        <p><strong>${this.rendezVousSelectionnes.length}</strong> rendez-vous sélectionnés :</p>
        <p><small>${rendezVousList}</small></p>
        <p>Voulez-vous confirmer cette sélection ?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Ici vous pouvez ajouter la logique pour sauvegarder la sélection
        // Par exemple, appeler un service pour enregistrer les rendez-vous sélectionnés
        this.sauvegarderSelection();
      } else {
        this.loading = false;
      }
    });
  }

  private sauvegarderSelection(): void {
    // Simulation de sauvegarde - à remplacer par votre logique métier
  this.rendezVousService.validerSelection(this.rendezVousSelectionnes, this.ligneUuid).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Sélection validée',
        text: `${this.rendezVousSelectionnes.length} rendez-vous ont été sélectionnés avec succès`,
        timer: 3000,
        showConfirmButton: false
      });
      this.loading = false;
      this.router.navigate(['/douane/sdt/SysrevDashboard']);
    },
    error: (error) => {
      console.error('Erreur validation selection:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de valider la sélection'
      });
      this.loading = false;
      this.router.navigate(['/douane/sdt/mes-lignes']);
    }
  });
    
  }

  annuler(): void {
    this.router.navigate(['/douane/sdt/mes-lignes']);
  }

  getNombreRendezVousRestants(): number {
    return Math.max(0, this.MAX_RENDEZ_VOUS_PAR_LIGNE - this.getNombreRendezVousSelectionnes());
  }





}








