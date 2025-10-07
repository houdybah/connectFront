import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {ConteneurService} from "../../../../services/conteneur.service";
import {DetailConteneurAffectationService} from "../../../../services/detail-conteneur-affectation.service";

@Component({
  selector: 'app-validation-Programme',
  templateUrl: './validation-Programme.component.html',
  styleUrls: ['./validation-Programme.component.scss']
})
export class ValidationProgrammeComponent implements OnInit {
  @Input() rendezVousData: any = null; // Données du rendez-vous passées en paramètre

  validationForm: FormGroup;
  loading = false;
  submitted = false;

  // Données du rendez-vous
  rendezVous: any = null;
  conteneurs: any[] = [];

  // Options pour les champs
  zonesStations = [
    'Zone A - Terminal Principal',
    'Zone B - Terminal Secondaire', 
    'Zone C - Zone de Stockage',
    'Zone D - Zone de Contrôle',
    'Zone E - Zone de Chargement'
  ];

  positions = [
    'Position 1',
    'Position 2', 
    'Position 3',
    'Position 4',
    'Position 5'
  ];

  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conteneurService: ConteneurService,
    private DetailConteneurAffectationService: DetailConteneurAffectationService
  ) {
    this.validationForm = this.fb.group({
      // Informations de validation
      zoneStation: ['', Validators.required],
      position: ['', Validators.required],
      validite: ['', Validators.required],
      bonEmbarquement: [null], // Fichier à uploader
      observations: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
  const rendezVousNumero = this.route.snapshot.paramMap.get('numero'); // ✅ Changé de 'uuid' à 'numero'
  console.log('📋 Numéro du rendez-vous:', rendezVousNumero);
  
  if (this.rendezVousData) {
    this.rendezVous = this.rendezVousData;
    this.loadConteneurs(this.rendezVous.numero); // ✅ Utiliser numero
  } else if (rendezVousNumero) {
    this.loadRendezVousByNumero(rendezVousNumero); // ✅ Renommé
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Aucun rendez-vous spécifié'
    }).then(() => {
      this.router.navigate(['/douane/schedule-parc/sdt/notifications']);
    });
  }
}

// ✅ Renommer la méthode
loadRendezVousByNumero(numero: string): void {
  this.loading = true;
  
  this.conteneurService.getConteneurDetails(numero).subscribe({
    next: (data) => {
      this.rendezVous = data;
      this.loadConteneurs(this.rendezVous.numero); // ✅ Utiliser numero
      this.loading = false;
      
      console.log('📋 Rendez-vous chargé:', this.rendezVous);
      
      if (this.rendezVous.isValidSYC) {
        Swal.fire({
          icon: 'info',
          title: 'Déjà validé',
          text: 'Ce rendez-vous a déjà été validé par le syndicat',
          confirmButtonText: 'Continuer quand même'
        });
      }
    },
    error: (error) => {
      console.error('❌ Erreur chargement rendez-vous:', error);
      this.loading = false;
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger le rendez-vous'
      }).then(() => {
        this.router.navigate(['/douane/schedule-parc/sdt/notifications']);
      });
    }
  });
}
onSubmit(): void {
  this.submitted = true;

  if (this.validationForm.valid) {
    this.loading = true;

    const formData = new FormData();
    
    formData.append('zone', this.validationForm.get('zoneStation')?.value);
    formData.append('position', this.validationForm.get('position')?.value);
    
    // ✅ CORRECTION : Envoyer la date au format yyyy-MM-dd
    const validiteFormValue = this.validationForm.get('validite')?.value;
    formData.append('validite', validiteFormValue); // Déjà au bon format depuis l'input date
    
    const observations = this.validationForm.get('observations')?.value;
    if (observations) {
      formData.append('observations', observations);
    }
    
    const bonEmbarquement = this.validationForm.get('bonEmbarquement')?.value;
    if (bonEmbarquement) {
      formData.append('bonEmbarquement', bonEmbarquement);
    }

    console.log('📝 Soumission validation Programme');
    console.log('Date envoyée:', validiteFormValue);

    this.conteneurService.validerRendezVousSYCWithFile(this.rendezVous.numero, formData).subscribe({
      next: (response) => {
        this.loading = false;
        
        Swal.fire({
          title: 'Succès!',
          text: response.message || 'Programme validé avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/douane/schedule-parc/sdt/liste-programmes']);
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Erreur validation:', error);
        
        Swal.fire({
          title: 'Erreur!',
          text: error.error?.error || 'Erreur lors de la validation du Programme',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  } else {
    Object.keys(this.validationForm.controls).forEach(key => {
      this.validationForm.get(key)?.markAsTouched();
    });
    
    Swal.fire({
      title: 'Formulaire incomplet',
      text: 'Veuillez remplir tous les champs obligatoires',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}
  getMinDate(): string {
  // Date minimale = aujourd'hui
  const today = new Date();
  return today.toISOString().split('T')[0];
}

getMaxDate(): string {
  // Date maximale = dans 1 an
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate.toISOString().split('T')[0];
}
loadRendezVousByUuid(uuid: string): void {
  this.loading = true;
  
  // Utiliser la méthode getConteneurDetails avec l'UUID
  this.conteneurService.getConteneurDetails(uuid).subscribe({
    next: (data) => {
      this.rendezVous = data;
      this.loadConteneurs(this.rendezVous.uuid);
      this.loading = false;
      
      console.log('📋 Rendez-vous chargé:', this.rendezVous);
      
      // Vérifier si déjà validé
      if (this.rendezVous.isValidSYC) {
        Swal.fire({
          icon: 'info',
          title: 'Déjà validé',
          text: 'Ce rendez-vous a déjà été validé par le syndicat',
          confirmButtonText: 'Continuer quand même'
        });
      }
    },
    error: (error) => {
      console.error('❌ Erreur chargement rendez-vous:', error);
      this.loading = false;
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger le rendez-vous'
      }).then(() => {
        this.router.navigate(['/douane/schedule-parc/sdt/notifications']);
      });
    }
  });
}
  loadConteneurs(uuid:string): void {
    this.DetailConteneurAffectationService.getDetailConteneurAffectation(uuid).subscribe({
      next: (data) => {
        this.conteneurs = data;
       // this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement rendez-vous:', error);
        //this.loading = false;
      }
    });
    // if (this.rendezVous?.detailAffectationConteneurDtos) {
    //   this.conteneurs = this.rendezVous.detailAffectationConteneurDtos;
    // }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validationForm.patchValue({
        bonEmbarquement: file
      });
    }
  }

   onCancel(): void {
  // ✅ Redirection vers liste-programmes au lieu de notifications
  this.router.navigate(['/douane/schedule-parc/sdt/liste-programmes']);
}

  // Getters pour l'accès facile aux données
  get Chauffeur() {
    return this.rendezVous?.SysrevCamionChauffeur?.Chauffeur;
  }

  get Camion() {
    return this.rendezVous?.SysrevCamionChauffeur?.Camion;
  }

  get Declaration() {
    return {
      reference: this.rendezVous?.referenceDeclaration,
      compagnie: this.rendezVous?.compagnie,
      quittance: this.rendezVous?.quittance,
      referenceBolorer: this.rendezVous?.referenceBolorer
    };
  }
}







