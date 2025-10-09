import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Entreprise } from '../../../../../src/models/entreprise';
import { RechargementSolde } from '../../../../../src/models/rechargement-solde';
import { Utilisateur } from '../../../../../src/models/Utilisateur';
import { EntrepriseService } from '../../../../../src/services/entreprise.service';
import { NifUtilisateurService } from '../../../../../src/services/nif-utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rechargement-form',
  // standalone: true,
  // imports: [],
  templateUrl: './rechargement-form.component.html',
  styleUrl: './rechargement-form.component.scss'
})
export class RechargementFormComponent implements OnInit {
  entrepriseForm: FormGroup;
  formSubmitted = false;
  //EnumRoleList: EnumRole[] = [];
  nifControl = new FormControl('', Validators.required);
  showUserList = false;
  nifList: Entreprise[] = [];

  @Input() isAdmin: boolean = false;

  nifNotFound = false;
    filterednif!: Observable<Entreprise[]>;
  @Input() rechargementSoldePassed: RechargementSolde | null = null;
 
  constructor(
      private router: Router ,
     private nifUtilisateurService: NifUtilisateurService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private entrepriseService: EntrepriseService
  ) {
    this.entrepriseForm = this.formBuilder.group({
      //email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]],

     // email: ['', [Validators.required, Validators.email]],
      montant: ['', Validators.required],
      nif: [''],
   
     // roles: ['', Validators.required],
    });
  }

  


get nifControlValue(): string {
  return this.nifControl?.value ?? '';
}



    isMarketeur(): boolean {
    return this.entrepriseForm.get('roles')?.value === 'marketeur';
  }

  populateForm(utilisateur: Utilisateur): void {
    this.entrepriseForm.patchValue({
      email: utilisateur.email,
      password: utilisateur.password,
      nif: utilisateur.nif,
      roles: utilisateur.roles?.[0] || '', // si un seul rôle
    });
  }


  


  
  showUsersList(): void {
    this.showUserList = true;
  }

  
    initFilter(): void {
      this.filterednif = this.nifControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (typeof value === 'string') {
            return this.filterUsers(value);
          }
          return this.filterUsers('');
        })
      );
    }


  
    private filterUsers(value: string): Entreprise[] {
      const filterValue = value.toLowerCase();
      return this.nifList.filter(user => user.nif.toLowerCase().includes(filterValue));
    }
 


  setSelectedUser(nifUtilisateur: Entreprise): void {
  this.entrepriseForm.patchValue({ nif: nifUtilisateur.nif });
  this.nifControl.setValue(nifUtilisateur.nif);
  this.showUserList = false;
  this.nifNotFound = false; 
}











ngOnInit(): void {
  this.entrepriseForm = this.formBuilder.group({
    nif: ['', Validators.required],
   // token: ['', Validators.required],
    montant: ['', Validators.required]
  });

  // autocomplete comme avant…
  this.filterednif = this.nifControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (value && typeof value === 'string' && value.length >= 2) {
        return this.nifUtilisateurService.getAllds(value);
      } else {
        return of([]);
      }
    })
  );
}

saveRechargementSolde(): void {
  if (this.entrepriseForm.invalid) {
    return;
  }

  const entrepriseToSave: Entreprise = {
    ...this.entrepriseForm.value
  };

  this.entrepriseService.recharger(entrepriseToSave).subscribe(
    () => {
      Swal.fire('Succès', 'Le solde a été rechargé avec succès.', 'success')
        .then(() => this.activeModal.close());
    },
    (error: any) => {
      Swal.fire('Erreur', 'Une erreur est survenue lors du rechargement.', 'error');
      console.error('Erreur lors du rechargement', error);
    }
  );
}

}











