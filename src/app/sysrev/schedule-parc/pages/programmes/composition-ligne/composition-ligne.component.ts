import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {Ligne} from "../../../../models/Ligne";
import {CompositionLigne} from "../../../../models/CompositionLigne";
import {CamionChauffeur} from "../../../../models/CamionChauffeur";
import {LigneService} from "../../../../services/ligne.service";
import {AffectationService} from "../../../../services/affectation.service";
import {CompositionService} from "../../../../services/composition.service";

@Component({
  selector: 'app-composition-Ligne',
  templateUrl: './composition-Ligne.component.html',
  styleUrls: ['./composition-Ligne.component.scss']
})
export class CompositionLigneComponent implements OnInit, OnDestroy {
  ligneUuid: string = '';
  ligne: Ligne | null = null;
  compositions: CompositionLigne[] = [];
  affectationsDisponibles: CamionChauffeur[] = [];
  
  // Variables du formulaire
  affectationSelectionnee = '';
  zoneStation = '';
  numeroConteneur = '';
  validite = '';
  disponibilite = '';
  position = '';
  
  loading = false;
  saving = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LigneService: LigneService,
    private AffectationService: AffectationService,
    private CompositionService: CompositionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ligneUuid = params.get('uuid') || '';
      if (this.ligneUuid) {
        this.loadLigne();
        this.loadCompositions();
        this.loadAffectationsDisponibles();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadLigne(): void {
    this.subscriptions.push(
      this.LigneService.getLigneById(this.ligneUuid).subscribe({
        next: (ligneData) => {
          this.ligne = ligneData;
        },
        error: (error) => {
          console.error('Erreur chargement Ligne:', error);
        }
      })
    );
  }

  loadCompositions(): void {
    this.loading = true;
    this.subscriptions.push(
      this.CompositionService.getCompositionsByLigne(this.ligneUuid).subscribe({
        next: (compositions) => {
          this.compositions = compositions;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement compositions:', error);
          this.loading = false;
        }
      })
    );
  }

  loadAffectationsDisponibles(): void {
    // UTILISER LA NOUVELLE MÉTHODE
    this.subscriptions.push(
      this.AffectationService.getDisponiblesPourLigne(this.ligneUuid).subscribe({
        next: (affectations) => {
          this.affectationsDisponibles = affectations;
          console.log(`${affectations.length} affectations disponibles pour cette Ligne`);
        },
        error: (error) => {
          console.error('Erreur chargement affectations:', error);
          // Fallback : charger toutes les affectations si l'endpoint échoue
          this.loadAllAffectations();
        }
      })
    );
  }

  // Méthode de secours
  private loadAllAffectations(): void {
    this.subscriptions.push(
      this.AffectationService.getAllAffectations().subscribe({
        next: (affectations) => {
          this.affectationsDisponibles = affectations;
        },
        error: (error) => {
          console.error('Erreur chargement toutes affectations:', error);
        }
      })
    );
  }

  ajouterAffectation(): void {
    if (!this.affectationSelectionnee) {
      alert('Veuillez sélectionner une affectation');
      return;
    }

    this.saving = true;
    const nouvelleComposition: CompositionLigne = {
      ligneUuid: this.ligneUuid,
      camionChauffeurUuid: this.affectationSelectionnee,
      zoneStation: this.zoneStation || undefined,
      numeroConteneur: this.numeroConteneur || undefined,
      validite: this.validite || undefined,
      disponibilite: this.disponibilite || undefined,
      position: this.position || undefined
    };

    this.subscriptions.push(
      this.CompositionService.createComposition(nouvelleComposition).subscribe({
        next: () => {
          alert('Affectation ajoutée avec succès');
          
          // Réinitialiser tous les champs
          this.affectationSelectionnee = '';
          this.zoneStation = '';
          this.numeroConteneur = '';
          this.validite = '';
          this.disponibilite = '';
          this.position = '';
          
          // Recharger les données
          this.loadCompositions();
          this.loadAffectationsDisponibles(); // Recharger pour mettre à jour la liste
          
          this.saving = false;
        },
        error: (error) => {
          console.error('Erreur ajout composition:', error);
          alert('Erreur lors de l\'ajout de l\'affectation');
          this.saving = false;
        }
      })
    );
  }

  retirerComposition(uuid: string): void {
    if (!confirm('Êtes-vous sûr de vouloir retirer cette affectation ?')) {
      return;
    }

    this.subscriptions.push(
      this.CompositionService.deleteComposition(uuid).subscribe({
        next: () => {
          alert('Affectation retirée avec succès');
          this.loadCompositions();
          this.loadAffectationsDisponibles(); // Recharger pour mettre à jour la liste
        },
        error: (error) => {
          console.error('Erreur suppression composition:', error);
          alert('Erreur lors de la suppression de l\'affectation');
        }
      })
    );
  }

  getOccupation(): number {
    return this.compositions.length;
  }

  getOccupationPercentage(): number {
    if (!this.ligne || this.ligne.capacite === 0) {
      return 0;
    }
    return (this.compositions.length / this.ligne.capacite) * 100;
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  retour(): void {
    if (this.ligne?.demandeCKTUuid) {
      this.router.navigate(['/douane/demandes-ckt/Lignes', this.ligne.demandeCKTUuid]);
    } else {
      this.router.navigate(['/douane/demandes-ckt']);
    }
  }
}






