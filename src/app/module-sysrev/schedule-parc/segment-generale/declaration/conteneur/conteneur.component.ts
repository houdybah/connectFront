import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface Conteneur {
  id: string;
  nom: string;
  contenu: string;
  destination: string;
  selectionne: boolean;
  ordre: number;
}


@Component({
  selector: 'app-conteneur',
  templateUrl: './conteneur.component.html',
  styleUrl: './conteneur.component.scss'
})
export class ConteneurComponent {
  chauffeurForm: FormGroup;
  conteneurs: Conteneur[] = [];
  destinations: string[] = ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Lille', 'Strasbourg', 'Nantes'];
  maxConteneurs = 2;
  erreurSelection = false;

  constructor(private fb: FormBuilder) {
    this.chauffeurForm = this.fb.group({
      nomChauffeur: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}\s?)?\d{9,10}$/)]],
      numPermis: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialisation des conteneurs
    this.conteneurs = [
      { id: 'C001', nom: 'Conteneur C-001', contenu: 'Meubles', destination: '', selectionne: false, ordre: 0 },
      { id: 'C002', nom: 'Conteneur C-002', contenu: 'Électronique', destination: '', selectionne: false, ordre: 1 },
      { id: 'C003', nom: 'Conteneur C-003', contenu: 'Vêtements', destination: '', selectionne: false, ordre: 2 },
      { id: 'C004', nom: 'Conteneur C-004', contenu: 'Produits alimentaires', destination: '', selectionne: false, ordre: 3 },
      { id: 'C005', nom: 'Conteneur C-005', contenu: 'Matériaux de construction', destination: '', selectionne: false, ordre: 4 },
      { id: 'C006', nom: 'Conteneur C-006', contenu: 'Pièces automobiles', destination: '', selectionne: false, ordre: 5 }
    ];
  }

  toggleSelection(conteneur: Conteneur) {
    // Si le conteneur est déjà sélectionné, on le désélectionne simplement
    if (conteneur.selectionne) {
      conteneur.selectionne = false;
      conteneur.destination = '';
      this.reordonnerConteneurs();
      return;
    }

    // Vérifier si on a déjà atteint le maximum de conteneurs
    const nombreConteneurSelectionnes = this.conteneurs.filter(c => c.selectionne).length;
    
    if (nombreConteneurSelectionnes >= this.maxConteneurs) {
      // Afficher le message d'erreur
      this.erreurSelection = true;
      setTimeout(() => this.erreurSelection = false, 3000);
      return;
    }

    // Sélectionner le conteneur
    conteneur.selectionne = true;
    
    // Réorganiser les conteneurs
    this.reordonnerConteneurs();
  }

  reordonnerConteneurs() {
    // Trier les conteneurs: sélectionnés en premier, puis par ordre initial
    this.conteneurs.sort((a, b) => {
      if (a.selectionne && !b.selectionne) return -1;
      if (!a.selectionne && b.selectionne) return 1;
      return a.ordre - b.ordre;
    });
  }

  validerFormulaire() {
    if (this.chauffeurForm.invalid) {
      Object.keys(this.chauffeurForm.controls).forEach(key => {
        this.chauffeurForm.get(key)?.markAsTouched();
      });
      return;
    }

    const conteneursSelectionnes = this.conteneurs.filter(c => c.selectionne);
    
    // Vérifier qu'au moins un conteneur est sélectionné
    if (conteneursSelectionnes.length === 0) {
      alert('Veuillez sélectionner au moins un conteneur');
      return;
    }

    // Vérifier que tous les conteneurs sélectionnés ont une destination
    const destinationManquante = conteneursSelectionnes.some(c => !c.destination);
    if (destinationManquante) {
      alert('Veuillez sélectionner une destination pour chaque conteneur');
      return;
    }

    // Préparer les données à envoyer
    const donneesFormulaire = {
      Chauffeur: this.chauffeurForm.value,
      conteneurs: conteneursSelectionnes.map(c => ({
        id: c.id,
        contenu: c.contenu,
        destination: c.destination
      }))
    };

    // Afficher les données pour démonstration
    console.log('Données à envoyer:', donneesFormulaire);
    alert('Affectation enregistrée avec succès!');
    
    // En production, on enverrait ces données à une API
    // this.service.enregistrerAffectation(donneesFormulaire).subscribe(...);
  }
}



