import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceAbonnement } from '../../../../../src/models/reference-abonnement';
import { ReferenceAbonnementService } from '../../../../../src/services/reference-abonnement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reference-abonnement-form',
  //standalone: true,
  //imports: [],
  templateUrl: './reference-abonnement-form.component.html',
  styleUrl: './reference-abonnement-form.component.scss'
})
export class ReferenceAbonnementFormComponent implements OnInit {
  @Input() referenceAbonnementPassed: ReferenceAbonnement | null = null;
  referenceAbonnementForm: FormGroup;
  referenceAbonnementList: ReferenceAbonnement[] = [];
  showUserList = false;
    formSubmitted = false;
  constructor(
   public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private referenceAbonnementService: ReferenceAbonnementService,
 
  ) {
    this.referenceAbonnementForm = this.formBuilder.group({


  enumAbonnement: ['', Validators.required],
  montant: ['', Validators.required],
  dureeJours: ['', Validators.required],
  actif: [false], 
            
    });
  }

  ngOnInit(): void {
  



    
  }



 

  

  showUsersList(): void {
    this.showUserList = true;
  }

 


saveReferenceAbonnementForm(): void {
  this.formSubmitted = true;

  if (this.referenceAbonnementForm.invalid) {
    Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
    return;
  }

  const referenceData: ReferenceAbonnement = {
    ...this.referenceAbonnementPassed,
    ...this.referenceAbonnementForm.value,
  };

  if (referenceData.uuid) {
    // Mode édition
    this.referenceAbonnementService.updateNif(referenceData).subscribe(
      () => {
        Swal.fire('Succès', 'La caractéristique a été mise à jour avec succès.', 'success').then(() => {
          this.activeModal.close();
        });
      },
      (error: any) => {
        const message = error?.error || 'Une erreur est survenue lors de la mise à jour.';
        Swal.fire('Erreur', message, 'error');
      }
    );
  } else {
    // Mode création
    this.referenceAbonnementService.create(referenceData).subscribe(
      () => {
        Swal.fire('Succès', 'L\'abonnement a été ajouté avec succès.', 'success').then(() => {
          this.activeModal.close();
        });
      },
      (error: any) => {
        // Vérifie si le message d’erreur est bien retourné par le backend
        let errorMessage = 'Une erreur est survenue lors de l\'ajout.';
        if (typeof error?.error === 'string') {
          errorMessage = error.error;
        }
        Swal.fire('Erreur', errorMessage, 'error');
      }
    );
  }
}




}







