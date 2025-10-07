import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {DemandeCKT} from "../../../../models/DemandeCKT";
import {DemandeCKTService} from "../../../../services/demande-ckt.service";

@Component({
  selector: 'app-form-demande-ckt',
  templateUrl: './form-demande-ckt.component.html',
  styleUrls: ['./form-demande-ckt.component.scss']
})
export class FormDemandeCktComponent implements OnInit {
  @Input() demande?: DemandeCKT;
  @Input() isEditMode: boolean = false;
  @Input() demandeUuid?: string;

  demandeForm: FormGroup;
  loading = false;
  submitted = false;

  horaireOptions = [
    { value: 'MATIN', label: 'Matin', icon: 'sun' },
    { value: 'APRES_MIDI', label: 'Après-midi', icon: 'cloud-sun' },
    { value: 'JOURNEE', label: 'Journée complète', icon: 'calendar-day' }
  ];

  constructor(
    private fb: FormBuilder,
    private DemandeCKTService: DemandeCKTService,
    public activeModal: NgbActiveModal
  ) {
    this.demandeForm = this.fb.group({
      numero: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      horaire: ['MATIN', Validators.required],
      capacite: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.demande) {
      const heureFormatted = this.demande.heure ? this.demande.heure.substring(0, 5) : '';
      this.demandeForm.patchValue({
        numero: this.demande.numero,
        date: this.demande.date,
        heure: heureFormatted,
        horaire: this.demande.horaire,
        capacite: this.demande.capacite
      });
    } else {
      const now = new Date();
      this.demandeForm.patchValue({
        date: now.toISOString().split('T')[0],
        heure: now.toTimeString().substring(0, 5)
      });
      this.generateNumero();
    }

    this.demandeForm.get('date')?.valueChanges.subscribe(() => this.generateNumero());
    this.demandeForm.get('horaire')?.valueChanges.subscribe(() => this.generateNumero());
  }

  generateNumero(): void {
    const date = this.demandeForm.get('date')?.value;
    const horaire = this.demandeForm.get('horaire')?.value;
    
    if (date && horaire) {
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0].replace(/-/g, '');
      
      let horaireCode = 'M';
      if (horaire === 'APRES_MIDI') horaireCode = 'A';
      if (horaire === 'JOURNEE') horaireCode = 'J';
      
      const numero = `CKT-${dateStr}-${horaireCode}`;
      this.demandeForm.patchValue({ numero }, { emitEvent: false });
    }
  }

  adjustCapacity(delta: number): void {
    const currentValue = this.f['capacite'].value || 0;
    const newValue = Math.max(1, Math.min(100, currentValue + delta));
    this.demandeForm.patchValue({ capacite: newValue });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.demandeForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    this.loading = true;
    const demandeData: DemandeCKT = this.demandeForm.value;

    const request = this.isEditMode && this.demandeUuid
      ? this.DemandeCKTService.updateDemandeCKT(this.demandeUuid, demandeData)
      : this.DemandeCKTService.createDemandeCKT(demandeData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: `Demande CKT ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
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

  annuler(): void {
    this.activeModal.dismiss('cancel');
  }

  get f() {
    return this.demandeForm.controls;
  }

  hasError(controlName: string): boolean {
    const control = this.demandeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.demandeForm.get(controlName);
    
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

  getSelectedHoraire() {
    const horaireValue = this.demandeForm.get('horaire')?.value;
    return this.horaireOptions.find(h => h.value === horaireValue);
  }

  getHoraireDescription(horaire: string): string {
    switch (horaire) {
      case 'MATIN':
        return '08h00 - 12h00';
      case 'APRES_MIDI':
        return '13h00 - 17h00';
      case 'JOURNEE':
        return '08h00 - 17h00';
      default:
        return '';
    }
  }

  onSliderChange(event: any): void {
    const value = parseInt(event.target.value);
    this.demandeForm.patchValue({ capacite: value });
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






