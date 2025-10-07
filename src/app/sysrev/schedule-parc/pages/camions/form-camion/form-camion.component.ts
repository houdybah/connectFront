import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Camion, EnumTypeConteneur} from "../../../../models/Camion";
import {CamionService} from "../../../../services/camion.service";

@Component({
  selector: 'app-form-Camion',
  templateUrl: './form-Camion.component.html',
  styleUrls: ['./form-Camion.component.scss']
})
export class FormCamionComponent implements OnInit {
  @Input() Camion?: Camion;           // ✅ Recevoir le Camion depuis le parent
  @Input() isEditMode: boolean = false; // ✅ Savoir si on est en mode édition
  @Input() camionUuid?: string;        // ✅ UUID du Camion à modifier

  EnumTypeConteneur = EnumTypeConteneur;
  camionForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  marques = [
    'MAN',
    'Volvo',
    'Mercedes-Benz',
    'Scania',
    'DAF',
    'Iveco',
    'Renault Trucks'
  ];

  typeConteneurOptions = [
    { value: EnumTypeConteneur.VINGT_PIEDS, label: '20 pieds' },
    { value: EnumTypeConteneur.QUARANTE_PIEDS, label: '40 pieds' }
  ];

  constructor(
    private fb: FormBuilder,
    private CamionService: CamionService,
    public activeModal: NgbActiveModal
  ) {
    // Initialiser le formulaire vide
    this.camionForm = this.fb.group({
      numero: ['', Validators.required],
      immatriculation: ['', Validators.required],
      marque: ['', Validators.required],
      model: ['', Validators.required],
      typeConteneur: ['', Validators.required],
      capacite: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    console.log('🔧 FormCamion Init');
    console.log('  - isEditMode:', this.isEditMode);
    console.log('  - Camion:', this.Camion);
    console.log('  - camionUuid:', this.camionUuid);

    // ✅ Si mode édition et qu'on a un Camion, remplir le formulaire
    if (this.isEditMode && this.Camion) {
      console.log('📝 Remplissage du formulaire avec:', this.Camion);
      this.camionForm.patchValue({
        numero: this.Camion.numero,
        immatriculation: this.Camion.immatriculation,
        marque: this.Camion.marque,
        model: this.Camion.model,
        typeConteneur: this.Camion.typeConteneur,
        capacite: this.Camion.capacite
      });
      console.log('✅ Formulaire rempli:', this.camionForm.value);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.camionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const camionData: Camion = this.camionForm.value;
    
    console.log('📤 Envoi des données:', camionData);
    console.log('📤 Mode:', this.isEditMode ? 'Modification' : 'Création');

    const request = this.isEditMode && this.camionUuid
      ? this.CamionService.updateCamion(this.camionUuid, camionData)
      : this.CamionService.createCamion(camionData);

    request.subscribe({
      next: (response) => {
        console.log('✅ Opération réussie:', response);
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: `Camion ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.activeModal.close('success');
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Erreur:', error);
        this.errorMessage = error.error?.message || `Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'}`;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: this.errorMessage
        });
      }
    });
  }

  annuler(): void {
    this.activeModal.dismiss('cancel');
  }

  // Helpers pour le template
  get f() {
    return this.camionForm.controls;
  }

  hasError(controlName: string): boolean {
    const control = this.camionForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.camionForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('min')) {
      return `Valeur minimale: ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Valeur maximale: ${control.errors?.['max'].max}`;
    }
    
    return '';
  }

  getSelectedType() {
    const typeValue = this.camionForm.get('typeConteneur')?.value;
    return this.typeConteneurOptions.find(t => t.value === typeValue);
  }

  getTypeDescription(type: string): string {
    switch (type) {
      case 'VINGT_PIEDS':
        return 'Conteneur standard 20 pieds';
      case 'QUARANTE_PIEDS':
        return 'Conteneur standard 40 pieds';
      default:
        return '';
    }
  }

  adjustCapacity(delta: number): void {
    const currentValue = this.f['capacite'].value || 1;
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    this.camionForm.patchValue({ capacite: newValue });
  }

  onSliderChange(event: any): void {
    const value = parseInt(event.target.value);
    this.camionForm.patchValue({ capacite: value });
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





