import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {ConteneurService} from "../../../../services/conteneur.service";

@Component({
  selector: 'app-liste-rendez-vous',
  templateUrl: './liste-rendez-vous.component.html',
  styleUrls: ['./liste-rendez-vous.component.scss']
})
export class ListeRendezVousComponent implements OnInit {
  @Output() totalElementsChange = new EventEmitter<number>();

  rendezVous: any[] = [];
  loading = false;
  errorMessage = '';

  // Filtres
  validSyndicat = false; // Par défaut, afficher les rendez-vous non validés par le syndicat

  constructor(
    private conteneurService: ConteneurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.loading = true;
    this.errorMessage = '';

    this.conteneurService.getListeRendezVousByValidSyndicat(this.validSyndicat).subscribe({
      next: (data) => {
        this.rendezVous = data;
        this.loading = false;
        console.log('Rendez-vous chargés:', data);
        // Émettre le nombre total d'éléments
        this.totalElementsChange.emit(this.totalElements);
      },
      error: (error) => {
        console.error('Erreur chargement rendez-vous:', error);
        this.errorMessage = 'Impossible de charger les rendez-vous';
        this.loading = false;
        // Émettre 0 en cas d'erreur
        this.totalElementsChange.emit(0);
      }
    });
  }

  toggleValidSyndicat(): void {
    this.validSyndicat = !this.validSyndicat;
    this.loadRendezVous();
  }

  viewRendezVousDetails(rendezVous: any): void {
    console.log('Détails du rendez-vous:', rendezVous);
    // TODO: Implémenter l'ouverture d'un modal ou la navigation vers une page de détails
    alert(`Détails du rendez-vous ${rendezVous.reference}\nChauffeur: ${rendezVous.SysrevCamionChauffeur?.Chauffeur?.nom} ${rendezVous.SysrevCamionChauffeur?.Chauffeur?.prenom}\nDestination: ${rendezVous.destination}`);
  }

  validateProgramme(rendezVous: any): void {
    console.log('Validation du Programme pour:', rendezVous);
    // Navigation vers la page de validation avec les données du rendez-vous
    this.router.navigate(['/douane/rendez-vous/validation-Programme'], { queryParams: { uuid: rendezVous } });
  }

  get totalElements(): number {
    return this.rendezVous.length;
  }

  get isValidSyndicatLabel(): string {
    return this.validSyndicat ? 'Validés par le syndicat' : 'Non validés par le syndicat';
  }
}







