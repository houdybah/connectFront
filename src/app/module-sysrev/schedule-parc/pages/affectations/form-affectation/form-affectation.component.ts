import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import {CamionChauffeur} from "../../../../models/CamionChauffeur";
import {Camion} from "../../../../models/Camion";
import {Chauffeur} from "../../../../models/Chauffeur";
import {AffectationService} from "../../../../services/affectation.service";
import {CamionService} from "../../../../services/camion.service";
import {ChauffeurService} from "../../../../services/chauffeur.service.spec";

@Component({
  selector: 'app-form-affectation',
  templateUrl: './form-affectation.component.html',
  styleUrls: ['./form-affectation.component.scss']
})
export class FormAffectationComponent implements OnInit {
  @Input() affectation?: CamionChauffeur;
  @Input() isEditMode: boolean = false;
  @Input() affectationUuid?: string;
  @Input() chauffeurPreselectionne?: Chauffeur;
  @Input() camionPreselectionne?: Camion; // ✅ NOUVEAU

  affectationForm: FormGroup;
  loading = false;
  submitted = false;
  currentStep = 1;

  camions: Camion[] = [];
  chauffeurs: Chauffeur[] = [];
  camionsDisponibles: Camion[] = []; // ✅ NOUVEAU : Liste filtrée
  chauffeursDisponibles: Chauffeur[] = [];
  selectedCamion: Camion | null = null;
  selectedChauffeur: Chauffeur | null = null;

  statutOptions = [
    { value: 'ACTIF', label: 'Actif', icon: 'check-circle' },
    { value: 'INACTIF', label: 'Inactif', icon: 'times-circle' }
  ];

  etatOptions = [
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'EN_MISSION', label: 'En Mission' },
    { value: 'OCCUPE', label: 'Occupé' },
    { value: 'HORS_SERVICE', label: 'Hors Service' },
    { value: 'EN_REPARATION', label: 'En Réparation' }
  ];

  positionOptions = [
    { value: 'PARC', label: 'Parc' },
    { value: 'TERMINAL', label: 'Terminal' },
    { value: 'EN_ROUTE', label: 'En Route' },
    { value: 'GARAGE', label: 'Garage' }
  ];

  constructor(
    private fb: FormBuilder,
    private AffectationService: AffectationService,
    private CamionService: CamionService,
    private ChauffeurService: ChauffeurService,
    public activeModal: NgbActiveModal
  ) {
    this.affectationForm = this.fb.group({
      camionUuid: ['', Validators.required],
      chauffeurUuid: ['', Validators.required],
      status: ['ACTIF', Validators.required],
      statusEtat: ['DISPONIBLE', Validators.required],
      position: ['PARC']
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    if (this.isEditMode && this.affectation) {
      this.affectationForm.patchValue({
        camionUuid: this.affectation.camionUuid,
        chauffeurUuid: this.affectation.chauffeurUuid,
        status: this.affectation.status,
        statusEtat: this.affectation.statusEtat,
        position: this.affectation.position
      });
    }
  }


  loadInitialData(): void {
    this.loading = true;
    forkJoin({
      camions: this.CamionService.getAllCamions(),
      chauffeurs: this.ChauffeurService.getAllChauffeurs()
    }).subscribe({
      next: (data) => {
        this.camions = data.camions;
        this.chauffeurs = data.chauffeurs;
        
        // ✅ FILTRER les camions ET chauffeurs disponibles
        this.filterCamionsDisponibles();
        this.filterChauffeursDisponibles();
        
        if (this.isEditMode && this.affectation) {
          this.selectedCamion = this.camions.find(c => c.uuid === this.affectation!.camionUuid) || null;
          this.selectedChauffeur = this.chauffeurs.find(c => c.uuid === this.affectation!.chauffeurUuid) || null;
        }
        
        // ✅ Si Camion présélectionné
        if (this.camionPreselectionne) {
          this.affectationForm.patchValue({
            camionUuid: this.camionPreselectionne.uuid
          });
          this.selectedCamion = this.camionPreselectionne;
        }
        
        // ✅ Si Chauffeur présélectionné
        if (this.chauffeurPreselectionne) {
          this.affectationForm.patchValue({
            chauffeurUuid: this.chauffeurPreselectionne.uuid
          });
          this.selectedChauffeur = this.chauffeurPreselectionne;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement données:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les données'
        });
        this.loading = false;
      }
    });
  }
  // ✅ NOUVELLE MÉTHODE : Filtrer les camions disponibles
  filterCamionsDisponibles(): void {
    this.camionsDisponibles = this.camions.filter(Camion => {
      // Ne pas filtrer le Camion en cours de modification
      if (this.isEditMode && this.affectation?.camionUuid === Camion.uuid) {
        return true;
      }
      
      // Ne pas filtrer le Camion présélectionné
      if (this.camionPreselectionne?.uuid === Camion.uuid) {
        return true;
      }
      
      // Vérifier si le Camion a une mission en cours
      return !this.hasMissionEnCours(Camion);
    });

    console.log('Camions disponibles:', this.camionsDisponibles.length, '/', this.camions.length);
    
    // ✅ Afficher un message si aucun Camion et Chauffeur disponible
    if (this.camionsDisponibles.length === 0 && this.chauffeursDisponibles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Aucune ressource disponible',
        html: `
          <p>Tous les camions et chauffeurs sont actuellement en mission.</p>
          <p>Veuillez attendre qu'une mission se termine.</p>
        `,
        confirmButtonText: 'Compris'
      }).then(() => {
        this.activeModal.dismiss('no-resources');
      });
    } else if (this.camionsDisponibles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Aucun Camion disponible',
        html: `
          <p>Tous les camions sont actuellement en mission.</p>
          <p>Veuillez attendre qu'un Camion termine sa mission.</p>
        `,
        confirmButtonText: 'Compris'
      }).then(() => {
        this.activeModal.dismiss('no-trucks');
      });
    }
  }

  // ✅ NOUVELLE MÉTHODE : Vérifier si un Camion a une mission en cours
  hasMissionEnCours(Camion: Camion): boolean {
    if (!Camion.camionChauffeurs || Camion.camionChauffeurs.length === 0) {
      return false;
    }
    
    // Vérifier si au moins une affectation est en cours
    return Camion.camionChauffeurs.some((affectation: any) => {
      // Une mission est en cours si :
      // - Le statut est ACTIF
      // - L'état est EN_MISSION ou OCCUPE
      // - Il n'y a pas de date de fin
      // - La mission n'est pas terminée
      return (
        affectation.status === 'ACTIF' &&
        (affectation.statusEtat === 'EN_MISSION' || 
         affectation.statusEtat === 'OCCUPE') &&
        !affectation.dateFin &&
        affectation.missionTerminee !== true
      );
    });
  }

  // Méthode existante mise à jour
  filterChauffeursDisponibles(): void {
    this.chauffeursDisponibles = this.chauffeurs.filter(Chauffeur => {
      if (this.isEditMode && this.affectation?.chauffeurUuid === Chauffeur.uuid) {
        return true;
      }
      
      if (this.chauffeurPreselectionne?.uuid === Chauffeur.uuid) {
        return true;
      }
      
      return !this.hasCourseEnCours(Chauffeur);
    });

    console.log('Chauffeurs disponibles:', this.chauffeursDisponibles.length, '/', this.chauffeurs.length);
  }

  hasCourseEnCours(Chauffeur: Chauffeur): boolean {
    if (!Chauffeur.camionChauffeurs || Chauffeur.camionChauffeurs.length === 0) {
      return false;
    }
    
    return Chauffeur.camionChauffeurs.some((affectation: any) => {
      return (
        affectation.status === 'ACTIF' &&
        (affectation.statusEtat === 'EN_MISSION' || 
         affectation.statusEtat === 'OCCUPE') &&
        !affectation.dateFin &&
        affectation.courseTerminee !== true
      );
    });
  }

  onCamionSelect(event: any): void {
    const uuid = event.target.value;
    this.selectedCamion = this.camionsDisponibles.find(c => c.uuid === uuid) || null;
  }

  onChauffeurSelect(event: any): void {
    const uuid = event.target.value;
    this.selectedChauffeur = this.chauffeursDisponibles.find(c => c.uuid === uuid) || null;
  }
  
  

  onSubmit(): void {
    this.submitted = true;

    if (this.affectationForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    this.loading = true;
    const affectationData: CamionChauffeur = this.affectationForm.value;

    const request = this.isEditMode && this.affectationUuid
      ? this.AffectationService.updateAffectation(this.affectationUuid, affectationData)
      : this.AffectationService.createAffectation(affectationData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: `Affectation ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.activeModal.close('success');
        });
      },
      error: (error) => {
        console.error('Erreur:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error?.message || `Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'}`
        });
        this.loading = false;
      }
    });
  }

  // ... reste du code inchangé ...

  annuler(): void {
    this.activeModal.dismiss('cancel');
  }

  hasError(controlName: string): boolean {
    const control = this.affectationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.affectationForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    return '';
  }

  nextStep(): void {
    if (this.currentStep < 3 && this.canProceed()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.selectedCamion && this.selectedChauffeur);
      case 2:
        return !!(this.affectationForm.get('status')?.valid && 
                  this.affectationForm.get('statusEtat')?.valid && 
                  this.affectationForm.get('position')?.valid);
      default:
        return false;
    }
  }

  getSelectedStatut(): string {
    const statut = this.affectationForm.get('status')?.value;
    const option = this.statutOptions.find(opt => opt.value === statut);
    return option?.label || 'Non sélectionné';
  }

  getSelectedEtat(): string {
    const etat = this.affectationForm.get('statusEtat')?.value;
    const option = this.etatOptions.find(opt => opt.value === etat);
    return option?.label || 'Non sélectionné';
  }

  getSelectedPosition(): string {
    const position = this.affectationForm.get('position')?.value;
    const option = this.positionOptions.find(opt => opt.value === position);
    return option?.label || 'Non sélectionné';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.annuler();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.annuler();
  }

  get f() {
    return this.affectationForm.controls;
  }
}






