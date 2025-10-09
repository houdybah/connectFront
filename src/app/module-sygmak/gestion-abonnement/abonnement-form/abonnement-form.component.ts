import {
  Component, ElementRef, Input, OnInit, ViewChild
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime, distinctUntilChanged, Observable, of, switchMap
} from 'rxjs';
import { Abonnement } from '../../../../../src/models/abonnement';
import { AbonnementService } from '../../../../../src/services/abonnement.service';
import { NifUtilisateurService } from '../../../../../src/services/nif-utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonnement-form',
  templateUrl: './abonnement-form.component.html',
  styleUrls: ['./abonnement-form.component.scss']
})
export class AbonnementFormComponent implements OnInit {
  abonnementForm: FormGroup;
  @Input() abonnementPassed: Abonnement | null = null;
  filterednif!: Observable<{ nif: string }[]>;
  showUserList = false;
  formSubmitted = false;
  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private nifUtilisateurService: NifUtilisateurService,
    private abonnementService: AbonnementService,
    public activeModal: NgbActiveModal
  ) {
    this.abonnementForm = this.formBuilder.group({
      nif: ['', Validators.required],
      enumAbonnement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    document.addEventListener('click', this.closeUserList.bind(this));

    this.filterednif = this.abonnementForm.get('nif')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        value && value.length >= 2
        
          ? this.nifUtilisateurService.getAllesss(value)
          : of([])
      )
    );
  }

  showUsersList(): void {
    this.showUserList = true;
  }

  setSelectedUsers(nifObj: { nif: string }): void {
    this.abonnementForm.patchValue({ nif: nifObj.nif });
    this.showUserList = false;
  }

  closeUserList(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
  }

  saveAbonnement(): void {
    this.formSubmitted = true;

    if (this.abonnementForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
      return;
    }

    const { nif, enumAbonnement } = this.abonnementForm.value;



this.abonnementService.souscrire(nif, enumAbonnement).subscribe({
  next: (res) => {
    Swal.fire('Succès', res.message, 'success').then(() => {
      this.activeModal.close();
    });
  },
  error: (err) => {
    const errorMessage =
      typeof err.error === 'string'
        ? err.error
        : 'Une erreur est survenue lors de la souscription.';
    Swal.fire('Erreur', errorMessage, 'error');
  }
});

  }
}





