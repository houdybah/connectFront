import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {DemandeCKT} from "../../../../../models/DemandeCKT";
import {EnumStatusLigne, Ligne} from "../../../../../models/Ligne";
import {LigneService} from "../../../../../services/ligne.service";
import {DemandeCKTService} from "../../../../../services/demande-ckt.service";

@Component({
  selector: 'app-form-Ligne',
  templateUrl: './form-Ligne.component.html',
  styleUrls: ['./form-Ligne.component.scss']
})
export class FormLigneComponent implements OnInit {
  ligneForm: FormGroup;
  isEditMode = false;
  ligneUuid: string | null = null;
  demandeCKTUuid: string | null = null;
  demandesCKT: DemandeCKT[] = [];
  loading = false;
  submitted = false;
  currentStep = 1;

  statuts = [
    { value: EnumStatusLigne.EN_ATTENTE, label: 'En Attente' },
    { value: EnumStatusLigne.ANNULE, label: 'Annulé' },
    { value: EnumStatusLigne.EN_COURS, label: 'EN COURS' },
    { value: EnumStatusLigne.TERMINE, label: 'Terminé' }
  ];

  constructor(
    private fb: FormBuilder,
    private LigneService: LigneService,
    private DemandeCKTService: DemandeCKTService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ligneForm = this.fb.group({
      numero: ['', Validators.required],
      status: [EnumStatusLigne.EN_COURS, Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      capacite: [null, [Validators.required, Validators.min(1)]],
      demandeCKTUuid: ['', Validators.required],
      
    });
  }

  ngOnInit(): void {
    this.loadDemandesCKT();
    
    // Récupérer demandeCKTUuid depuis query params
    this.route.queryParams.subscribe(params => {
      this.demandeCKTUuid = params['demandeCKTUuid'];
      if (this.demandeCKTUuid) {
        this.ligneForm.patchValue({ demandeCKTUuid: this.demandeCKTUuid });
      }
    });

    // Mode édition
    this.route.paramMap.subscribe(params => {
      this.ligneUuid = params.get('uuid');
      if (this.ligneUuid) {
        this.isEditMode = true;
        this.loadLigne();
      }
    });
  }

  loadDemandesCKT(): void {
    this.DemandeCKTService.getAllDemandeCKT().subscribe({
       next: (data: DemandeCKT[]) => {  // ← Ajoutez : DemandeCKT[]
      this.demandesCKT = data;
    },
      
      error: (error) => {
        console.error('Erreur chargement demandes CKT:', error);
      }
    });
  }

  loadLigne(): void {
    if (!this.ligneUuid) return;

    this.loading = true;
    this.LigneService.getLigneById(this.ligneUuid).subscribe({
      next: (Ligne) => {
        this.ligneForm.patchValue({
          numero: Ligne.numero,
          status: Ligne.status,
          date: Ligne.date,
          heure: Ligne.heure,
          capacite: Ligne.capacite,
          demandeCKTUuid: Ligne.demandeCKTUuid
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement Ligne:', error);
        alert('Erreur lors du chargement de la Ligne');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.ligneForm.invalid) {
      return;
    }

    this.loading = true;
    const ligneData: Ligne = this.ligneForm.value;

    if (this.isEditMode && this.ligneUuid) {
      this.LigneService.updateLigne(this.ligneUuid, ligneData).subscribe({
        next: () => {
          alert('Ligne modifiée avec succès');
          this.retour();
        },
        error: (error) => {
          console.error('Erreur modification:', error);
          alert('Erreur lors de la modification de la Ligne');
          this.loading = false;
        }
      });
    } else {
      this.LigneService.createLigne(ligneData).subscribe({
        next: () => {
          alert('Ligne créée avec succès');
          this.retour();
        },
        error: (error) => {
          console.error('Erreur création:', error);
          alert('Erreur lors de la création de la Ligne');
          this.loading = false;
        }
      });
    }
  }

  retour(): void {
    if (this.demandeCKTUuid) {
      this.router.navigate(['/douane/demandes-ckt/Lignes', this.demandeCKTUuid]);
    } else {
      this.router.navigate(['/douane/demandes-ckt']);
    }
  }

  // Navigation par étapes
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
        return !!(this.ligneForm.get('demandeCKTUuid')?.value && this.ligneForm.get('numero')?.value);
      case 2:
        return !!(this.ligneForm.get('date')?.valid && 
                  this.ligneForm.get('heure')?.valid && 
                  this.ligneForm.get('capacite')?.valid &&
                  this.ligneForm.get('status')?.valid);
      default:
        return false;
    }
  }

  // Helpers pour l'affichage
  getSelectedStatut(): string {
    const status = this.ligneForm.get('status')?.value;
    const statut = this.statuts.find(s => s.value === status);
    return statut?.label || 'Non sélectionné';
  }

  getSelectedDemande(): string {
    const demandeUuid = this.ligneForm.get('demandeCKTUuid')?.value;
    const demande = this.demandesCKT.find(d => d.uuid === demandeUuid);
    return demande ? `${demande.numero} - ${demande.horaire}` : 'Non sélectionnée';
  }

  getFormattedDateTime(): string {
    const date = this.ligneForm.get('date')?.value;
    const heure = this.ligneForm.get('heure')?.value;
    
    if (!date || !heure) return 'Non défini';
    
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('fr-FR');
    return `${formattedDate} à ${heure}`;
  }

  getStatusIcon(status: EnumStatusLigne): string {
    switch (status) {
      case EnumStatusLigne.EN_ATTENTE:
        return 'fa-clock';
      case EnumStatusLigne.ANNULE:
        return 'fa-times-circle';
      case EnumStatusLigne.EN_COURS:
        return 'fa-play-circle';
      case EnumStatusLigne.TERMINE:
        return 'fa-check-circle';
      default:
        return 'fa-question-circle';
    }
  }

  getStatusDescription(status: EnumStatusLigne): string {
    switch (status) {
      case EnumStatusLigne.EN_ATTENTE:
        return 'Ligne en attente de départ';
      case EnumStatusLigne.ANNULE:
        return 'Ligne annulée';
      case EnumStatusLigne.EN_COURS:
        return 'Ligne en cours de transport';
      case EnumStatusLigne.TERMINE:
        return 'Ligne terminée';
      default:
        return 'Statut non défini';
    }
  }

  // Gestion de la capacité
  adjustCapacity(change: number): void {
    const currentValue = this.ligneForm.get('capacite')?.value || 1;
    const newValue = Math.max(1, currentValue + change);
    this.ligneForm.patchValue({ capacite: newValue });
  }

  // Validation et erreurs
  hasError(controlName: string): boolean {
    const control = this.ligneForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.ligneForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('min')) {
      return 'La valeur doit être supérieure à 0';
    }
    return '';
  }

  // Gestion des événements
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.retour();
  }

  // Getter pour faciliter l'accès au formulaire
  get f() {
    return this.ligneForm.controls;
  }
}






