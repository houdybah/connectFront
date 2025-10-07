// modification-Chauffeur.component.ts - Version avec debugging

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ConteneurService} from "../../../../services/conteneur.service";
import {DetailConteneurAffectationService} from "../../../../services/detail-conteneur-affectation.service";

@Component({
  selector: 'app-modification-Chauffeur',
  templateUrl: './modification-chauffeur.component.html',
  styleUrls: ['./modification-chauffeur.component.scss']
})
export class ModificationChauffeurComponent implements OnInit {
  @Input() conteneurData: any; // Données du conteneur à modifier
  
  modificationForm!: FormGroup;
  isLoading = false;
  detailAffectationConteneurDtos: any;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private conteneurService: ConteneurService,
    private detailConteneurService: DetailConteneurAffectationService
  ) {}

  ngOnInit() {
    // ✅ DEBUGGING - Afficher les données reçues
    console.log('🔍 DEBUGGING - Données reçues dans la modal:', this.conteneurData);
    console.log('🔍 Reference Compagnie:', this.conteneurData?.referenceCompagnie);
    console.log('🔍 Reference AGL:', this.conteneurData?.referenceAGL);
    console.log('🔍 Conteneurs:', this.conteneurData?.conteneurs);
    
    this.initForm();
    this.populateForm();
    this.loadDetailConteneurAffectation();
  }

  initForm() {
    this.modificationForm = this.fb.group({
      nomChauffeur: ['', [Validators.required, Validators.minLength(2)]],
      phoneChauffeur: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      permisChauffeur: ['', [Validators.required, Validators.minLength(3)]],
      immatriculation: ['', [Validators.required, Validators.minLength(3)]],
      commune: ['', Validators.required],
      destination: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  populateForm() {
    if (this.conteneurData) {
      this.modificationForm.patchValue({
        nomChauffeur: this.conteneurData.nomChauffeur || '',
        phoneChauffeur: this.conteneurData.phoneChauffeur || '',
        permisChauffeur: this.conteneurData.permisChauffeur || '',
        immatriculation: this.conteneurData.immatriculation || '',
        commune: this.conteneurData.commune || '',
        destination: this.conteneurData.destination || ''
      });
    }
  }

  sauvegarder() {
    if (this.conteneurData?.status === true) {
      alert('Modification impossible : ce conteneur est déjà sorti');
      return;
    }
    
    if (this.modificationForm.valid) {
      this.isLoading = true;
      
      const donneesModifiees = {
        uuid: this.conteneurData.uuid,
        nomcompletDriver: this.modificationForm.get('nomChauffeur')?.value,
        phoneDriver: this.modificationForm.get('phoneChauffeur')?.value,
        permitDriver: this.modificationForm.get('permisChauffeur')?.value,
        immarticulation: this.modificationForm.get('immatriculation')?.value,
        commune: this.modificationForm.get('commune')?.value,
        destination: this.modificationForm.get('destination')?.value
      };

      this.conteneurService.modifierChauffeur(donneesModifiees).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.activeModal.close(response);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur lors de la modification:', error);
          
          if (error.error && error.error.includes('déjà sorti')) {
            alert('Erreur : Ce conteneur est déjà sorti et ne peut plus être modifié.');
          } else {
            alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
          }
        }
      });
    } else {
      Object.keys(this.modificationForm.controls).forEach(key => {
        this.modificationForm.get(key)?.markAsTouched();
      });
    }
  }
   // ✅ MÉTHODE POUR ÉVITER LES DOUBLONS DANS LE TEMPLATE
  trackByNumero(index: number, conteneur: any): string {
    return conteneur.numeroConteneur || conteneur.numero || index.toString();
  }

  // ✅ MÉTHODE POUR COMPTER LES CONTENEURS SÉLECTIONNÉS
  getSelectedCount(): number {
    if (!this.conteneurData?.conteneurs) return 0;
    
    return this.conteneurData.conteneurs.filter((conteneur: any) => 
      conteneur.selected || conteneur.seleted
    ).length;
  }

  // ✅ MÉTHODE POUR OBTENIR LA LISTE DES CONTENEURS UNIQUES
  getUniqueConteneurs(): any[] {
    if (!this.conteneurData?.conteneurs) return [];
    
    const seen = new Set();
    return this.conteneurData.conteneurs.filter((conteneur: any) => {
      const key = conteneur.numeroConteneur || conteneur.numero;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  loadDetailConteneurAffectation(): void {
    this.detailConteneurService.getDetailConteneurAffectation(this.conteneurData.uuid).subscribe((res: any) => {
      this.detailAffectationConteneurDtos = res;
      console.log(this.detailAffectationConteneurDtos);
    });
  }

}








