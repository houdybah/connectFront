import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Entreprise } from '../../../../../src/models/entreprise';
import { Utilisateur } from '../../../../../src/models/Utilisateur';
import { EntrepriseService } from '../../../../../src/services/entreprise.service';
import { NifUtilisateurService } from '../../../../../src/services/nif-utilisateur.service';
import { UtilisateurService } from '../../../../../src/services/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entreprise-form',
  //standalone: true,
  //imports: [],
  templateUrl: './entreprise-form.component.html',
  styleUrl: './entreprise-form.component.scss'
})
export class EntrepriseFormComponent implements OnInit {
  @Input() entreprisePassed: Entreprise | null = null;
  entrepriseForm: FormGroup;
  utilisateurList: Utilisateur[] = [];
  utilisateurControl = new FormControl('', Validators.required);
  filteredUtilisateurs!: Observable<Utilisateur[]>;
  showUserList = false;
    formSubmitted = false;
    //nifControl = new FormControl('', Validators.required);
  filterednif!: Observable<Entreprise[]>;
     // filterednif!: Observable<Utilisateur[]>;
  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  constructor(
     private nifUtilisateurService: NifUtilisateurService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private entrepriseService: EntrepriseService,
    private utilisateurService: UtilisateurService
  ) {
    this.entrepriseForm = this.formBuilder.group({
     nif: ['',  Validators.required],
     //utilisateur_uuid: ['', Validators.required],
        nomEntreprise: ['',  Validators.required],
         adresse: ['',  Validators.required],
          telephone: ['',  Validators.required],
           sigle: ['',  Validators.required],
            solde: ['',  Validators.required],
       //nomEntreprise: ['', [Validators.required, Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.entreprisePassed) {
      this.populateForm(this.entreprisePassed);
    }
    this.getAllUtilisateurs();

    // Fermer la liste si on clique à l'extérieur
    document.addEventListener('click', this.closeUserList.bind(this));





        this.filterednif = this.entrepriseForm.get('nif')!.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(value => {
    if (value && typeof value === 'string' && value.length >= 2) {
      return this.nifUtilisateurService.getAlless(value);
    } else {
      return of([]);
    }
  })
);

    
  }

  populateForm(nifUtilisateur: Entreprise): void {
    this.entrepriseForm.patchValue({
      nif: nifUtilisateur.nif,
      utilisateur_uuid: nifUtilisateur.utilisateur_uuid,
    });
    const user = this.utilisateurList.find(u => u.uuid === nifUtilisateur.utilisateur_uuid);
    this.utilisateurControl.setValue(user?.email || '');
  }

  getAllUtilisateurs(): void {
    const page = { pageNumber: 0, size: 1000, totalElements: 0, totalPages: 0 };
    this.utilisateurService.getAll(page, '').subscribe(
      (result: any) => {
        this.utilisateurList = result.content || [];
        this.initFilter();
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  initFilter(): void {
    this.filteredUtilisateurs = this.utilisateurControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsers(value || ''))
    );
  }

  private filterUsers(value: string): Utilisateur[] {
    const filterValue = value.toLowerCase();
    return this.utilisateurList.filter(user => user.email.toLowerCase().includes(filterValue));
  }

  showUsersList(): void {
    this.showUserList = true;
  }

  setSelectedUser(utilisateur: Utilisateur): void {
    this.entrepriseForm.patchValue({ utilisateur_uuid: utilisateur.uuid });
    this.utilisateurControl.setValue(utilisateur.email);
    this.showUserList = false;
  }

 

  closeUserList(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
  }





saveEntreprise(): void {
  this.formSubmitted = true;

  if (this.entrepriseForm.invalid) {
    Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
    return;
  }

  const entrepriseData: Entreprise = {
    ...this.entreprisePassed,
    ...this.entrepriseForm.value,
  };

  if (entrepriseData.uuid) {
    this.entrepriseService.updateNif(entrepriseData).subscribe(
      () => {
        Swal.fire('Succès', 'La caractéristique a été mise à jour avec succès.', 'success').then(() => {
          this.activeModal.close();
        });
      },
      (error: any) => {
        Swal.fire('Erreur', error.error || 'Une erreur est survenue lors de la mise à jour.', 'error');
      }
    );
  } else {
    this.entrepriseService.create(entrepriseData).subscribe(
      () => {
        Swal.fire('Succès', 'L\'entreprise a été ajoutée avec succès.', 'success').then(() => {
          this.activeModal.close();
        });
      },
      (error: any) => {
        // Affiche le message d'erreur renvoyé par le backend
        let errorMessage = 'Une erreur est survenue lors de l\'ajout.';
        if (error.error) {
          errorMessage = error.error;
        }
        Swal.fire('Erreur', errorMessage, 'error');
      }
    );
  }
}


setSelectedUsers(nif: any) {
  
  this.entrepriseForm.patchValue({
    nif: nif.nif,                
    nomEntreprise: nif.nifNom   ,
    adresse: nif.adresse  
  });


  this.showUserList = false;
}




 isMarketeur(): boolean {
    return this.entrepriseForm.get('roles')?.value === 'marketeur';
  }
    

    
}





