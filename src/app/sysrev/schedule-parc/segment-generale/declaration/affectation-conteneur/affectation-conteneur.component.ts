import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {DetailAffectationConteneur} from "../../../../models/DetailAffectationConteneur";
import {AffectationConteneur} from "../../../../models/AffectationConteneur";
import {CamionChauffeur} from "../../../../models/CamionChauffeur";
import {Chauffeur} from "../../../../models/Chauffeur";
import {ConteneurService} from "../../../../services/conteneur.service";
import {AffectationService} from "../../../../services/affectation.service";
import {AffectationRecu} from "../../../../models/conteneur.model";
import {RecuAffectationComponent} from "../recu-affectation/recu-affectation.component";

@Component({
  selector: 'app-affectation-conteneur',
  templateUrl: './affectation-conteneur.component.html',
  styleUrl: './affectation-conteneur.component.scss',
  animations: [
    trigger('moveToTop', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('highlightSelected', [
      transition(':enter', [
        style({ backgroundColor: '#fff9c4' }),
        animate('800ms ease-out', style({ backgroundColor: 'transparent' }))
      ])
    ])
  ]
})
export class AffectationConteneurComponent {
  referenceDeclaration:string = "";
  chauffeurForm!: FormGroup;
  conteneurs: DetailAffectationConteneur[] = [];
  selectedConteneurs: DetailAffectationConteneur[] = [];
  destinations: string[] = ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg', 'Nice'];
  generating = false;

  affectationConteneur = new AffectationConteneur();
  reference: any;
  affectationsCamionChauffeurs: CamionChauffeur[] = [];
  
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private AffectationService:ConteneurService,
    private route: ActivatedRoute,
    private camionChauffeurService: AffectationService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadConteneurs();

    this.reference = this.route.snapshot.paramMap.get('reference');
    this.getAffectationConteneur(this.reference);
    this.getAffectationCamionChauffeur();
  }

  initForm() {
    this.chauffeurForm = this.fb.group({
      nom: [''],
      telephone: [''],
      numeroPermis: [''],
      categoriePermis: [''],
      statutChauffeur: [''],
      immatriculation: [''],
      typeConteneur: [''],
      capacite: [''],
      camionChauffeurUuid: ['',Validators.required],
      destination: ['',Validators.required],
      commune: ['',Validators.required]
    });
  }

  loadConteneurs() {
    // Simulation de données
    // this.conteneurs = [
    //   { id: '1', reference: 'C-001', contenu: 'Meubles', poids: 2500, selected: false },
    //   { id: '2', reference: 'C-002', contenu: 'Électronique', poids: 1800, selected: false },
    //   { id: '3', reference: 'C-003', contenu: 'Vêtements', poids: 950, selected: false },
    //   { id: '4', reference: 'C-004', contenu: 'Produits alimentaires', poids: 3200, selected: false },
    //   { id: '5', reference: 'C-005', contenu: 'Matériaux de construction', poids: 4500, selected: false },
    //   { id: '6', reference: 'C-006', contenu: 'Pièces automobiles', poids: 2100, selected: false },
    //   { id: '7', reference: 'C-007', contenu: 'Produits pharmaceutiques', poids: 1200, selected: false },
    //   { id: '8', reference: 'C-008', contenu: 'Jouets', poids: 850, selected: false }
    // ];
  }

  toggleConteneurSelection(conteneur: DetailAffectationConteneur) {
    // Vérifier si le conteneur est déjà sélectionné
    if (conteneur.selected) {
      conteneur.selected = false;
      this.selectedConteneurs = this.selectedConteneurs.filter(c => c.numeroConteneur !== conteneur.numeroConteneur);
      
      // Réinitialiser les destinations dans le formulaire si nécessaire
      // if (this.selectedConteneurs.length < 2) {
      //   this.chauffeurForm.get('destination2')?.setValue('');
      // }
      // if (this.selectedConteneurs.length === 0) {
      //   this.chauffeurForm.get('destination1')?.setValue('');
      // }
    } else {
      // Vérifier si on n'a pas déjà 2 conteneurs sélectionnés
      if (this.selectedConteneurs.length  >= 2) {
       // alert('Vous ne pouvez pas sélectionner plus de deux conteneurs !');
        Swal.fire({
          icon: 'error',
          title: 'Vous ne pouvez pas sélectionner plus de deux conteneurs !',
          showConfirmButton: true,
        }).then(() => {
          conteneur.selected = false;
        })
        return;
      }
        conteneur.selected = true;
        this.selectedConteneurs.push(conteneur);
        
        // Réorganiser la liste pour mettre les conteneurs sélectionnés en haut
        this.organizeConteneurs();
      
      
   
    }
  }

  organizeConteneurs() {
    // Copier les conteneurs non sélectionnés
    const nonSelected = this.conteneurs.filter(c => !c.selected);
    
    // Créer une nouvelle liste avec les conteneurs sélectionnés en premier
    this.conteneurs = [...this.selectedConteneurs, ...nonSelected];
  }

  genererRecu() {
    if (!this.validateForm()) {
      return;
    }
    
    // Animation de génération
    this.generating = true;
    
    // Affecter les destinations aux conteneurs sélectionnés
    // if (this.selectedConteneurs.length >= 1) {
    //   this.selectedConteneurs[0].d = this.chauffeurForm.get('destination1')?.value;
    // }
    // if (this.selectedConteneurs.length >= 2) {
    //   this.selectedConteneurs[1].destination = this.chauffeurForm.get('destination2')?.value;
    // }
    
    // Créer l'objet Chauffeur
    const Chauffeur: any = {
      nom: this.chauffeurForm.get('nom')?.value,
      phone: this.chauffeurForm.get('telephone')?.value,
      permis: this.chauffeurForm.get('numeroPermis')?.value,
      destination:this.chauffeurForm.get('destination')?.value,
      conteneurs: [...this.selectedConteneurs]
    };
    
    // Créer le reçu
    const recu: AffectationRecu = {
      reference: 'RDV-' + new Date().getTime().toString().substr(-6),
      date: new Date(),
      chauffeur: Chauffeur,
      totalConteneurs: this.selectedConteneurs.length
    };
    this.affectationConteneur.destination = this.chauffeurForm.value.destination;
    this.affectationConteneur.nomcompletDriver = this.chauffeurForm.value.nom
    this.affectationConteneur.phoneDriver = this.chauffeurForm.value.telephone
    this.affectationConteneur.immarticulation = this.chauffeurForm.value.immmatriculation
    this.affectationConteneur.permitDriver = this.chauffeurForm.value.numeroPermis
    this.affectationConteneur.reference = recu.reference
    this.affectationConteneur.commune = this.chauffeurForm.value.commune
    this.affectationConteneur.numero = recu.reference
    this.affectationConteneur.camionChauffeurUuid = this.chauffeurForm.value.camionChauffeurUuid;
  
    console.log(this.affectationConteneur)

    this.AffectationService.addConteneur(this.affectationConteneur).subscribe(res => {
       setTimeout(() => {
      this.generating = false;
      
      // Ouvrir la modal avec le reçu
      const modalRef = this.modalService.open(RecuAffectationComponent, { 
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });
      
      // Passer les données à la modal
      modalRef.componentInstance.recu = recu;
      
      // Action après fermeture de la modal
      modalRef.result.then(
        (result) => {
          if (result === 'reset') {
            this.resetForm();
          }
        },
        () => {
          // Modal fermée sans action
        }
      );
    }, 1500);
    })

    
    
    // // Simuler un délai pour l'animation
   
  }

  validateForm(): boolean {
    // Vérifier si le formulaire est valide
    if (this.chauffeurForm.invalid) {
      //alert('Veuillez remplir correctement tous les champs obligatoires.');
      Swal.fire({
        icon: 'error',
        title: 'Veuillez remplir correctement tous les champs obligatoires',
        showConfirmButton: true,
        
      })
      return false;
    }
    
    // Vérifier si des conteneurs sont sélectionnés
    if (this.selectedConteneurs.length === 0) {
    //  alert('Veuillez sélectionner au moins un conteneur.');
      Swal.fire({
        icon: 'error',
        title: 'Veuillez sélectionner au moins un conteneur',
        showConfirmButton: true,
        
      })
      return false;
    }
    
    // Vérifier si les destinations sont sélectionnées
    // if (this.selectedConteneurs.length >= 1 && !this.chauffeurForm.get('destination1')?.value) {
    //   alert('Veuillez sélectionner une destination pour le premier conteneur.');
    //   return false;
    // }
    
    // if (this.selectedConteneurs.length >= 2 && !this.chauffeurForm.get('destination2')?.value) {
    //   alert('Veuillez sélectionner une destination pour le deuxième conteneur.');
    //   return false;
    // }
    
    return true;
  }

  resetForm() {
    this.chauffeurForm.reset();
    this.selectedConteneurs = [];
    this.conteneurs.forEach(c => c.selected = false);
    this.loadConteneurs(); // Recharger l'ordre initial
  }

  getAffectationConteneur(reference:string){
    this.AffectationService.getConteneeurByDeclaration(reference).subscribe(res =>{
       this.affectationConteneur = res
       console.log(this.affectationConteneur)
       this.conteneurs = res.detailAffectationConteneurDtos
    })
  }



  getAffectationCamionChauffeur(){
    this.camionChauffeurService.getAffectationsDisponibles().subscribe(res =>{
      console.log(res)
      this.affectationsCamionChauffeurs = res
    })
  }

  onChauffeurSelectionChange(event: any) {
    const selectedIndex = event.target.selectedIndex - 1; // -1 car la première option est "Sélectionner un Chauffeur"
    
    if (selectedIndex >= 0 && selectedIndex < this.affectationsCamionChauffeurs.length) {
      const selectedCamionChauffeur = this.affectationsCamionChauffeurs[selectedIndex];
      const Chauffeur = selectedCamionChauffeur.chauffeur;
      const Camion = selectedCamionChauffeur.camion;

      // Remplir les informations du Chauffeur
      this.chauffeurForm.patchValue({
        nom: `${Chauffeur?.nom} ${Chauffeur?.prenom}`,
        telephone: Chauffeur?.phone || '',
        numeroPermis: Chauffeur?.permis || '',
        categoriePermis: 'C', // Valeur par défaut car non disponible dans ce modèle
        statutChauffeur: 'ACTIF' // Valeur par défaut car non disponible dans ce modèle
      });

      // Remplir les informations du Camion
      this.chauffeurForm.patchValue({
        immatriculation: Camion?.immatriculation || '',
        typeConteneur: Camion?.typeConteneur || '',
        capacite: Camion?.capacite || ''
      });
    }
  }

}










