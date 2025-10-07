import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ConfigurationHoraire, ConfigurationService} from "../../../../services/configuration.service";

@Component({
  selector: 'app-config-horaires',
  templateUrl: './config-horaires.component.html',
  styleUrls: ['./config-horaires.component.scss']
})
export class ConfigHorairesComponent implements OnInit {
  configForm: FormGroup;
  loading = false;
  submitted = false;
  configurationActuelle: ConfigurationHoraire | null = null;

  joursOptions = [
    { value: 'LUNDI', label: 'Lundi', checked: true },
    { value: 'MARDI', label: 'Mardi', checked: true },
    { value: 'MERCREDI', label: 'Mercredi', checked: true },
    { value: 'JEUDI', label: 'Jeudi', checked: true },
    { value: 'VENDREDI', label: 'Vendredi', checked: true },
    { value: 'SAMEDI', label: 'Samedi', checked: false },
    { value: 'DIMANCHE', label: 'Dimanche', checked: false }
  ];

  // Calculs en temps réel
  calculatedStats = {
    lignesMatin: 0,
    lignesApresMidi: 0,
    capaciteTotaleMatin: 0,
    capaciteTotaleApresMidi: 0,
    capaciteTotaleJournee: 0
  };

  constructor(
    private fb: FormBuilder,
    private configService: ConfigurationService,
    private router: Router
  ) {
    this.configForm = this.fb.group({
      heureDebutMatin: ['08:00', Validators.required],
      heureFinMatin: ['12:00', Validators.required],
      heureDebutApresMidi: ['13:00', Validators.required],
      heureFinApresMidi: ['17:00', Validators.required],
      dureeLigne: [60, [Validators.required, Validators.min(15), Validators.max(240)]],
      capaciteParDefaut: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      pauseEntreHoraires: [60, [Validators.required, Validators.min(0), Validators.max(180)]],
      joursOuvrables: [[]]
    });
  }

  ngOnInit(): void {
    this.loadConfiguration();
    
    // Calculer les stats à chaque changement
    this.configForm.valueChanges.subscribe(() => {
      this.calculateStats();
    });
  }

  loadConfiguration(): void {
    this.loading = true;
    this.configService.getConfiguration().subscribe({
      next: (config) => {
        this.configurationActuelle = config;
        this.configForm.patchValue(config);
        
        // Cocher les jours ouvrables
        if (config.joursOuvrables) {
          this.joursOptions.forEach(jour => {
            jour.checked = config.joursOuvrables.includes(jour.value);
          });
        }
        
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement configuration:', error);
        this.loading = false;
      }
    });
  }

  onJourChange(jour: any): void {
    jour.checked = !jour.checked;
    this.updateJoursOuvrables();
  }

  updateJoursOuvrables(): void {
    const joursSelectionnes = this.joursOptions
      .filter(j => j.checked)
      .map(j => j.value);
    this.configForm.patchValue({ joursOuvrables: joursSelectionnes });
  }

  calculateStats(): void {
    const formValue = this.configForm.value;
    
    // Calcul lignes matin
    const dureeMatin = this.calculateDuration(
      formValue.heureDebutMatin,
      formValue.heureFinMatin
    );
    this.calculatedStats.lignesMatin = Math.floor(dureeMatin / formValue.dureeLigne);
    
    // Calcul lignes après-midi
    const dureeApresMidi = this.calculateDuration(
      formValue.heureDebutApresMidi,
      formValue.heureFinApresMidi
    );
    this.calculatedStats.lignesApresMidi = Math.floor(dureeApresMidi / formValue.dureeLigne);
    
    // Calcul capacités
    this.calculatedStats.capaciteTotaleMatin = this.calculatedStats.lignesMatin * formValue.capaciteParDefaut;
    this.calculatedStats.capaciteTotaleApresMidi = this.calculatedStats.lignesApresMidi * formValue.capaciteParDefaut;
    this.calculatedStats.capaciteTotaleJournee = this.calculatedStats.capaciteTotaleMatin + this.calculatedStats.capaciteTotaleApresMidi;
  }

  calculateDuration(debut: string, fin: string): number {
    const [hDebut, mDebut] = debut.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);
    return (hFin * 60 + mFin) - (hDebut * 60 + mDebut);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.configForm.invalid) {
      return;
    }

    this.loading = true;
    const configData: ConfigurationHoraire = this.configForm.value;

    this.configService.updateConfiguration(configData).subscribe({
      next: () => {
        alert('Configuration enregistrée avec succès !');
        this.loadConfiguration();
      },
      error: (error) => {
        console.error('Erreur enregistrement:', error);
        alert('Erreur lors de l\'enregistrement de la configuration');
        this.loading = false;
      }
    });
  }

  resetToDefault(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration par défaut ?')) {
      this.loading = true;
      this.configService.resetToDefault().subscribe({
        next: () => {
          alert('Configuration réinitialisée avec succès !');
          this.loadConfiguration();
        },
        error: (error) => {
          console.error('Erreur réinitialisation:', error);
          alert('Erreur lors de la réinitialisation');
          this.loading = false;
        }
      });
    }
  }

  retour(): void {
    this.router.navigate(['/SysrevDashboard']);
  }

  get f() {
    return this.configForm.controls;
  }

  hasError(controlName: string): boolean {
    const control = this.configForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }
}





