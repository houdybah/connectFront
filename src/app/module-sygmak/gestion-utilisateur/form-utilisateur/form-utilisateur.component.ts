import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models/Utilisateur';
import { EnumRole } from '../../models/enum-role';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { NifUtilisateurService } from '../../services/nif-utilisateur.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-utilisateur',
  templateUrl: './form-utilisateur.component.html',
  styleUrl: './form-utilisateur.component.scss'
})
export class FormUtilisateurComponent implements OnInit {
  utilisateurForm: FormGroup;
  formSubmitted = false;
  EnumRoleList: EnumRole[] = [];
  nifControl = new FormControl('', Validators.required);
  showUserList = false;
  nifList: Utilisateur[] = [];

  @Input() isAdmin: boolean = false;

  nifNotFound = false;
    filterednif!: Observable<Utilisateur[]>;
  @Input() utilisateurPassed: Utilisateur | null = null;
 
  constructor(
      private router: Router ,
     private nifUtilisateurService: NifUtilisateurService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private utilisateurService: UtilisateurService
  ) {
    this.utilisateurForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]],

     // email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nif: [''],
   
      roles: ['', Validators.required],
    });
  }

  


ngOnInit(): void {
  this.formSubmitted = true;

if (!this.isAdmin) {
    // Si ce n’est pas admin, on désactive tous les champs sauf mot de passe (exemple)
    this.utilisateurForm.get('email')?.disable();
    this.utilisateurForm.get('roles')?.disable();
    this.utilisateurForm.get('nif')?.disable();
    // etc.
  }


  this.utilisateurService.getAllEnum().subscribe(
    (list) => {
      this.EnumRoleList = list;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération des rôles:', error);
    }
  );

  if (this.utilisateurPassed) {
    this.populateForm(this.utilisateurPassed);
  }

  const rolesControl = this.utilisateurForm.get('roles');
  const nifControl = this.utilisateurForm.get('nif');

  rolesControl?.valueChanges.subscribe(role => {
    if (role === 'marketeur') {
      nifControl?.setValidators([Validators.required]);
      nifControl?.updateValueAndValidity();
    } else {
      nifControl?.clearValidators();
      nifControl?.updateValueAndValidity();
    }
  });

  // ⚠️ Nouvelle logique pour vérifier si le NIF existe
  this.nifControl.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 6) {
          return this.nifUtilisateurService.getAlld(value);
        } else {
          this.nifNotFound = false;
          return of([]);
        }
      })
    )
    .subscribe(results => {
      this.nifNotFound = results.length === 0;
    });

  // Votre autocomplétion
  this.filterednif = this.nifControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (value && typeof value === 'string' && value.length >= 2) {
        return this.nifUtilisateurService.getAlld(value);
      } else {
        return of([]);
      }
    })
  );
}
get nifControlValue(): string {
  return this.nifControl?.value ?? '';
}



    isMarketeur(): boolean {
    return this.utilisateurForm.get('roles')?.value === 'marketeur';
  }

  populateForm(utilisateur: Utilisateur): void {
    this.utilisateurForm.patchValue({
      email: utilisateur.email,
      password: utilisateur.password,
      nif: utilisateur.nif,
      roles: utilisateur.roles?.[0] || '', // si un seul rôle
    });
  }


  saveUtilisateur(): void {
    const utilisateurToSave: Utilisateur = {
      ...this.utilisateurPassed,
      ...this.utilisateurForm.value,
      roles: [this.utilisateurForm.get('roles')?.value] // s'assurer que c'est un tableau
    };

    if (utilisateurToSave.uuid) {
      // Mode édition
      this.utilisateurService.update(utilisateurToSave).subscribe(
        () => {
          Swal.fire('Succès', 'L\'utilisateur a été mis à jour avec succès.', 'success').then(() => {
            this.activeModal.close();
          });
        },
        (error: any) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour.', 'error');
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    } else {
      // Mode création
      this.utilisateurService.create(utilisateurToSave).subscribe(
        () => {
          Swal.fire('Succès', 'L\'utilisateur a été ajouté avec succès.', 'success').then(() => {
            this.activeModal.close();
          });
        },
        (error: any) => {
          Swal.fire('Erreur', 'Cet utilisateur existe déjà.', 'error');
          console.error('Erreur lors de l\'ajout', error);
        }
      );
    }
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


  
    private filterUsers(value: string): Utilisateur[] {
      const filterValue = value.toLowerCase();
      return this.nifList.filter(user => user.nif.toLowerCase().includes(filterValue));
    }
 


  setSelectedUser(nifUtilisateur: Utilisateur): void {
  this.utilisateurForm.patchValue({ nif: nifUtilisateur.nif });
  this.nifControl.setValue(nifUtilisateur.nif);
  this.showUserList = false;
  this.nifNotFound = false; 
}

}





