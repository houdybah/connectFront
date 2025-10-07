import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  CategoriePermisLabels,
  Chauffeur,
  EnumCategoriePermis,
  EnumSexe, EnumStatutChauffeur,
  SexeLabels, StatutChauffeurLabels
} from "../../../../models/Chauffeur";
import {ChauffeurService} from "../../../../services/chauffeur.service";


@Component({
  selector: 'app-form-chauffeur',
  templateUrl: './form-chauffeur.component.html',
  styleUrls: ['./form-chauffeur.component.scss']
})
export class FormChauffeurComponent implements OnInit {
  @Input() chauffeur?: Chauffeur;
  @Input() isEditMode: boolean = false;
  @Input() chauffeurUuid?: string;

  chauffeurForm: FormGroup;
  loading = false;
  submitted = false;
  selectedPhoto: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;

  communes = [
    'Kaloum',
    'Dixinn',
    'Matam',
    'Ratoma',
    'Matoto'
  ];

  // Options pour les formulaires
  sexeOptions = [
    { value: EnumSexe.M, label: SexeLabels[EnumSexe.M] },
    { value: EnumSexe.F, label: SexeLabels[EnumSexe.F] }
  ];

  categoriesPermis = [
    { value: EnumCategoriePermis.A, label: CategoriePermisLabels[EnumCategoriePermis.A] },
    { value: EnumCategoriePermis.B, label: CategoriePermisLabels[EnumCategoriePermis.B] },
    { value: EnumCategoriePermis.C, label: CategoriePermisLabels[EnumCategoriePermis.C] },
    { value: EnumCategoriePermis.D, label: CategoriePermisLabels[EnumCategoriePermis.D] },
    { value: EnumCategoriePermis.E, label: CategoriePermisLabels[EnumCategoriePermis.E] }
  ];

  statutOptions = [
    { value: EnumStatutChauffeur.ACTIF, label: StatutChauffeurLabels[EnumStatutChauffeur.ACTIF] },
    { value: EnumStatutChauffeur.INACTIF, label: StatutChauffeurLabels[EnumStatutChauffeur.INACTIF] },
    { value: EnumStatutChauffeur.SUSPENDU, label: StatutChauffeurLabels[EnumStatutChauffeur.SUSPENDU] },
    { value: EnumStatutChauffeur.EN_MISSION, label: StatutChauffeurLabels[EnumStatutChauffeur.EN_MISSION] }
  ];

  constructor(
    private fb: FormBuilder,
    private chauffeurService: ChauffeurService,
    public activeModal: NgbActiveModal
  ) {
    this.chauffeurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      prenom: ['', [Validators.required, Validators.maxLength(100)]],
      permis: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(50)]],
      adresse: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      sexe: [EnumSexe.M, Validators.required],
      categoriePermis: [EnumCategoriePermis.C, Validators.required],
      dateObtentionPermis: ['', Validators.required],
      dateExpirationPermis: ['', Validators.required],
      statut: [EnumStatutChauffeur.ACTIF, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.chauffeur) {
      this.chauffeurForm.patchValue(this.chauffeur);
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Fichier trop volumineux',
          text: 'La photo ne doit pas dépasser 2 MB'
        });
        return;
      }

      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.chauffeurForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    this.loading = true;
    const chauffeurData: Chauffeur = this.chauffeurForm.value;

    const request = this.isEditMode && this.chauffeurUuid
      ? this.chauffeurService.updateChauffeur(this.chauffeurUuid, chauffeurData)
      : this.chauffeurService.createChauffeur(chauffeurData);

    request.subscribe({
      next: (response) => {
        if (this.selectedPhoto) {
          const uuid = this.chauffeurUuid || response.uuid;
          if (uuid) {
            this.uploadPhoto(uuid);
          } else {
            this.showSuccessAndClose();
          }
        } else {
          this.showSuccessAndClose();
        }
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

  uploadPhoto(uuid: string): void {
    if (this.selectedPhoto) {
      this.chauffeurService.uploadPhoto(uuid, this.selectedPhoto).subscribe({
        next: () => {
          this.showSuccessAndClose();
        },
        error: (error) => {
          console.error('Erreur upload photo:', error);
          Swal.fire({
            icon: 'warning',
            title: 'Attention',
            text: 'chauffeur enregistré mais erreur lors de l\'upload de la photo',
            showConfirmButton: true
          }).then(() => {
            this.activeModal.close('success');
          });
        }
      });
    }
  }

  showSuccessAndClose(): void {
    Swal.fire({
      icon: 'success',
      title: 'Succès !',
      text: `chauffeur ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.activeModal.close('success');
    });
  }

  annuler(): void {
    this.activeModal.dismiss('cancel');
  }

  hasError(controlName: string): boolean {
    const control = this.chauffeurForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.chauffeurForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('email')) {
      return 'Email invalide';
    }
    if (control?.hasError('maxLength')) {
      return `Maximum ${control.errors?.['maxLength'].requiredLength} caractères`;
    }
    if (control?.hasError('min')) {
      return `Valeur minimale: ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Valeur maximale: ${control.errors?.['max'].max}`;
    }
    
    return '';
  }

  get f() {
    return this.chauffeurForm.controls;
  }

  getSelectedStatut() {
    const statutValue = this.chauffeurForm.get('statut')?.value;
    return this.statutOptions.find(s => s.value === statutValue);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.annuler();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.annuler();
  }
}





