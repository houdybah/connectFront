import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NifUtilisateurService } from '../../../../../src/services/nif-utilisateur.service';
import { UtilisateurService } from '../../../../../src/services/utilisateur.service';
import { Utilisateur } from '../../../../../src/models/Utilisateur';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NifUtilisateur } from '../../../../../src/models/nif-utilisateur';

@Component({
  selector: 'app-nif-form',
  templateUrl: './nif-form.component.html',
  styleUrls: ['./nif-form.component.scss'] // Correction ici
})
export class NifFormComponent implements OnInit {
  @Input() nifUtilisateurPassed: NifUtilisateur | null = null;
  nifUtilisateurForm: FormGroup;
  utilisateurList: Utilisateur[] = [];
  utilisateurControl = new FormControl('', Validators.required);
  filteredUtilisateurs!: Observable<Utilisateur[]>;
  showUserList = false;

  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private nifUtilisateurService: NifUtilisateurService,
    private utilisateurService: UtilisateurService
  ) {
    this.nifUtilisateurForm = this.formBuilder.group({
      nif: ['', [Validators.required, Validators.required]],
      utilisateur_uuid: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.nifUtilisateurPassed) {
      this.populateForm(this.nifUtilisateurPassed);
    }
    this.getAllUtilisateurs();

    // Fermer la liste si on clique à l'extérieur
    document.addEventListener('click', this.closeUserList.bind(this));
  }

  populateForm(nifUtilisateur: NifUtilisateur): void {
    this.nifUtilisateurForm.patchValue({
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
    this.nifUtilisateurForm.patchValue({ utilisateur_uuid: utilisateur.uuid });
    this.utilisateurControl.setValue(utilisateur.email);
    this.showUserList = false;
  }

  closeUserList(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
  }




  saveNifUtilisateur(): void {
    if (this.nifUtilisateurForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
      return;
    }
    
    // Vérifier le doublon avant de sauvegarder
    const nif = this.nifUtilisateurForm.get('nif')?.value;
    const utilisateurUuid = this.nifUtilisateurForm.get('utilisateur_uuid')?.value;
  
    if (nif && utilisateurUuid) {
      this.nifUtilisateurService.checkNifExists(nif, utilisateurUuid).subscribe(
        (exists: boolean) => {
          if (exists) {
            // Affichage d'un message d'erreur si le NIF existe déjà pour cet utilisateur
            Swal.fire('Erreur', 'Ce NIF existe déjà pour cet utilisateur.', 'error');
          } else {
            // Si le NIF n'existe pas, soumettre le formulaire pour le POST
            const nifUtilisateurData: NifUtilisateur = {
              ...this.nifUtilisateurPassed,
              ...this.nifUtilisateurForm.value,
            };
  
            if (nifUtilisateurData.uuid) {
              this.nifUtilisateurService.updateNif(nifUtilisateurData).subscribe(
                () => {
                  Swal.fire({
                    title: 'Succès',
                    text: 'La caractéristique a été mise à jour avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.activeModal.close();
                  });
                },
                (error: any) => {
                  Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la mise à jour.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              );
            } else {
              this.nifUtilisateurService.create(nifUtilisateurData).subscribe(
                () => {
                  Swal.fire({
                    title: 'Succès',
                    text: 'La caractéristique a été ajoutée avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.activeModal.close();
                  });
                },
                (error: any) => {
                  Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'ajout.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              );
            }
          }
        },
        (error: any) => {
          console.error('Erreur lors de la vérification du doublon', error);
        }
      );
    }
  }
  
  

}





