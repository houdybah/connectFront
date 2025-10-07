import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ProgrammeService} from "../../../../services/programme.service";
import {ConfigurationService} from "../../../../services/configuration.service";
import {Programme} from "../../../../models/Programme";

@Component({
  selector: 'app-form-Programme',
  templateUrl: './form-programme.component.html',
  styleUrls: ['./form-programme.component.scss']
})
export class FormProgrammeComponent implements OnInit {
  programmeForm: FormGroup;
  isEditMode = false;
  programmeUuid: string | null = null;
  loading = false;
  submitted = false;

  horaireOptions = [
    { value: 'MATIN', label: 'Matin', icon: 'sun', color: '#fbbf24' },
    { value: 'APRES_MIDI', label: 'Après-midi', icon: 'cloud', color: '#60a5fa' }
  ];

  statutOptions = [
    { value: 'OUVERT', label: 'Ouvert', icon: 'door-open' },
    { value: 'COMPLET', label: 'Complet', icon: 'door-closed' },
    { value: 'FERME', label: 'Fermé', icon: 'lock' }
  ];

  // Configuration système
  configHoraires = {
    matin: { debut: '08:00', fin: '12:00' },
    apresMidi: { debut: '13:00', fin: '17:00' },
    capaciteDefaut: 10
  };

  constructor(
    private fb: FormBuilder,
    private ProgrammeService: ProgrammeService,
    private configService: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.programmeForm = this.fb.group({
      numero: ['', Validators.required],
      date: ['', Validators.required],
      horaire: ['MATIN', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      capaciteTotale: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      statut: ['OUVERT', Validators.required],
      observations: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.programmeUuid = this.route.snapshot.paramMap.get('uuid');
    
    // Charger la configuration système
    this.loadConfiguration();
    
    // Initialiser la date à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.programmeForm.patchValue({ date: today });
    
    // Générer le numéro automatiquement
    this.generateNumero();
    
    if (this.programmeUuid) {
      this.isEditMode = true;
      this.loadProgramme(this.programmeUuid);
    } else {
      // Appliquer les horaires par défaut pour "MATIN"
      this.onHoraireChange();
    }

    // Écouter les changements d'horaire
    this.programmeForm.get('horaire')?.valueChanges.subscribe(() => {
      this.onHoraireChange();
    });
  }

  loadConfiguration(): void {
    this.configService.getConfiguration().subscribe({
      next: (config) => {
        this.configHoraires = {
          matin: { 
            debut: config.heureDebutMatin, 
            fin: config.heureFinMatin 
          },
          apresMidi: { 
            debut: config.heureDebutApresMidi, 
            fin: config.heureFinApresMidi 
          },
          capaciteDefaut: config.capaciteParDefaut
        };
        
        // Mettre à jour la capacité par défaut
        if (!this.isEditMode) {
          this.programmeForm.patchValue({ 
            capaciteTotale: config.capaciteParDefaut 
          });
        }
      },
      error: (error) => {
        console.error('Erreur chargement configuration:', error);
      }
    });
  }

  loadProgramme(uuid: string): void {
    this.loading = true;
    this.ProgrammeService.getProgrammeById(uuid).subscribe({
      next: (Programme) => {
        this.programmeForm.patchValue(Programme);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement Programme:', error);
        alert('Erreur lors du chargement du Programme');
        this.router.navigate(['/SysrevProgrammes']);
      }
    });
  }

  generateNumero(): void {
    const date = this.programmeForm.get('date')?.value;
    const horaire = this.programmeForm.get('horaire')?.value;
    
    if (date && horaire) {
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0].replace(/-/g, '');
      const horaireCode = horaire === 'MATIN' ? 'M' : 'A';
      const numero = `PROG-${dateStr}-${horaireCode}`;
      
      this.programmeForm.patchValue({ numero }, { emitEvent: false });
    }
  }

  onHoraireChange(): void {
    const horaire = this.programmeForm.get('horaire')?.value;
    
    if (horaire === 'MATIN') {
      this.programmeForm.patchValue({
        heureDebut: this.configHoraires.matin.debut,
        heureFin: this.configHoraires.matin.fin
      });
    } else {
      this.programmeForm.patchValue({
        heureDebut: this.configHoraires.apresMidi.debut,
        heureFin: this.configHoraires.apresMidi.fin
      });
    }
    
    this.generateNumero();
  }

  onDateChange(): void {
    this.generateNumero();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.programmeForm.invalid) {
      return;
    }

    this.loading = true;
    const programmeData: Programme = {
      ...this.programmeForm.value,
      occupation: 0 // Nouvelle création commence à 0
    };

    if (this.isEditMode && this.programmeUuid) {
      this.ProgrammeService.updateProgramme(this.programmeUuid, programmeData).subscribe({
        next: () => {
          alert('Programme modifié avec succès !');
          this.router.navigate(['/SysrevProgrammes']);
        },
        error: (error) => {
          console.error('Erreur modification:', error);
          alert('Erreur lors de la modification du Programme');
          this.loading = false;
        }
      });
    } else {
      this.ProgrammeService.createProgramme(programmeData).subscribe({
        next: () => {
          alert('Programme créé avec succès !');
          this.router.navigate(['/SysrevProgrammes']);
        },
        error: (error) => {
          console.error('Erreur création:', error);
          alert('Erreur lors de la création du Programme');
          this.loading = false;
        }
      });
    }
  }

  annuler(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.')) {
      this.router.navigate(['/SysrevProgrammes']);
    }
  }

  get f() {
    return this.programmeForm.controls;
  }

  hasError(controlName: string): boolean {
    const control = this.programmeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  getErrorMessage(controlName: string): string {
    const control = this.programmeForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('min')) {
      return `Valeur minimale: ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Valeur maximale: ${control.errors?.['max'].max}`;
    }
    if (control?.hasError('maxLength')) {
      return `Maximum ${control.errors?.['maxLength'].requiredLength} caractères`;
    }
    
    return '';
  }

  getSelectedHoraire() {
    const horaireValue = this.programmeForm.get('horaire')?.value;
    return this.horaireOptions.find(h => h.value === horaireValue);
  }
}







