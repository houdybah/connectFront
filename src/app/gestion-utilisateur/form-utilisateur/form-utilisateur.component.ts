import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from 'src/services/utilisateur.service';
import { ListUtilisateurComponent } from '../list-utilisateur/list-utilisateur.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-utilisateur',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './form-utilisateur.component.html',
  styleUrl: './form-utilisateur.component.scss'
})
export class FormUtilisateurComponent implements OnInit {
  utilisateurListFather: ListUtilisateurComponent | undefined;
  utilisateur : Utilisateur | undefined ;
  @Input() utilisateurPassed: Utilisateur | null = null;
  utilisateurForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private utilisateurService: UtilisateurService
   ) { }


  ngOnInit(): void {
    if (this.utilisateurPassed) {
      this.populateForm(this.utilisateurPassed);
    }
  }

  populateForm(utilisateur: Utilisateur): void {
    this.utilisateurForm.patchValue({
      email: utilisateur.email,
      password: utilisateur.password,
    });
  }

 

  saveCategorie(): void {
    const categorieToSave: Utilisateur = {
      ...this.utilisateurPassed,
      ...this.utilisateurForm.value,
    };
  
    if (categorieToSave.uuid) {
      this.utilisateurService.update(categorieToSave).subscribe(
        () => {
          Swal.fire({
            title: 'Succès',
            text: 'La caractéristique a été mise à jour avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.activeModal.close(); // Fermeture du modal après confirmation
          });
        },
        (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la mise à jour de la caractéristique.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    } else {
      this.utilisateurService.create(categorieToSave).subscribe(
        () => {
          Swal.fire({
            title: 'Succès',
            text: 'La caractéristique a été ajoutée avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.activeModal.close(); // Fermeture du modal après confirmation
          });
        },
        (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de la caractéristique.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          console.error('Erreur lors de l\'ajout', error);
        }
      );
    }
  }



}
