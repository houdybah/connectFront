import {Component, Host, Input} from '@angular/core';
import {Unite} from "../../../models/Unite";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UniteService} from "../../../services/unite.service";
import {EnumService} from "../../../services/enum.service";
import Swal from "sweetalert2";
import {UniteOrganigrammeComponent} from "../unite-organigramme/unite-organigramme.component";

@Component({
  selector: 'app-unite-tabs',
  templateUrl: './unite-tabs.component.html',
  styleUrl: './unite-tabs.component.scss'
})
export class UniteTabsComponent {
  @Input() innerUnite!: Unite | null;

  uniteForm: FormGroup = Object.create(null);
  uniteOrganigrammeComponent!: UniteOrganigrammeComponent;
  unite!: Unite;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted = false;
  activeSelected = 1;
  disabled = true;
  currentJustify = 'start';
  active = 1;
  activev = 'top';
  activeKeep = 1;
  typesUnites: string[] = [];
  unites: Unite[] = [];
  isRootUnit: boolean = false;

  constructor(
      public uniteService: UniteService,
      public enumService: EnumService,
      private fb: FormBuilder,
      @Host() uniteOrganigrammeComponent: UniteOrganigrammeComponent
  ) {
    this.uniteOrganigrammeComponent = uniteOrganigrammeComponent;
  }

  ngOnInit(): void {
    this.initForm();
    this.getCombos();

    if (this.innerUnite != null) {
      this.isEdit = true;
      this.isEnable = false;
      this.uniteForm.disable();
      this.unite = this.innerUnite;

      this.isRootUnit = !this.unite.uuidUnitePere;

      this.display(this.unite);
    } else {
      this.isEdit = false;
      this.isEnable = true;
      this.uniteForm.enable();
      this.unite = new Unite();
      this.display(this.unite);
    }
  }

  initForm(): void {
    this.uniteForm = this.fb.group({
      codeUnite: ['', Validators.required],
      nomUnite: ['', Validators.required],
      typeUnite: ['', Validators.required],
      uuidUnitePere: ['', Validators.required],
    });
  }

  getCombos(): void {
    this.enumService.getTypesUnite().subscribe((data) => {
      this.typesUnites = data;
    });

    this.uniteService.getAllUnite().subscribe((pagedData: any) => {
      this.unites = pagedData.data;
    });
  }

  myValue: string = '';
  myValue2: string = '';

  onInputChange(): void {
    const codeUniteControl = this.uniteForm.get('codeUnite');
    if (codeUniteControl) {
      const value = codeUniteControl.value;
      if (value) {
        codeUniteControl.setValue(value.toUpperCase(), { emitEvent: false });
      }
    }
  }

  onInputChanges(): void {
    this.myValue2 = this.myValue2.toUpperCase();
  }

  clearError(): void {
    const descriptionControl = this.uniteForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e: any): void {
    e.preventDefault();
    this.isEnable = true;
    this.uniteForm.enable();

    // Si c'est une unité racine, on empêche la modification du parent
    if (this.isRootUnit) {
      this.uniteForm.get('uuidUnitePere')?.disable();
    }
  }

  display(unitedisplay: Unite): void {
    this.unite = unitedisplay;
    this.uniteForm.patchValue({
      codeUnite: this.unite.codeUnite,
      nomUnite: this.unite.nomUnite,
      typeUnite: this.unite.typeUnite,
      uuidUnitePere: this.unite.uuidUnitePere
    });
  }

  Onsave(): void {
    this.submitted = true;

    if (this.uniteForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les validations
      Object.keys(this.uniteForm.controls).forEach(key => {
        this.uniteForm.get(key)?.markAsTouched();
      });
      return;
    }

    const uniteAdd = { ...this.unite, ...this.uniteForm.value };

    console.log(uniteAdd);

    if (this.isRootUnit) {
      uniteAdd.uuidUnitePere = this.unite.uuidUnitePere;
    }

    if (this.isEdit) {
      this.uniteService.updateUnite(uniteAdd).subscribe(
          () => {
            this.showSuccessMessage('Modification effectuée avec succès!');
          },
          (error) => {
            this.showErrorMessage('Une erreur est survenue lors de la modification.');
          }
      );
    } else {
      this.uniteService.newUnite(uniteAdd).subscribe(
          () => {
            this.showSuccessMessage('Enregistrement effectué avec succès!');
          },
          (error) => {
            this.showErrorMessage('Veuillez vérifier vos champs avant de valider.');
          }
      );
    }
  }

  delete(unite: Unite): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'De vouloir supprimer cet élément!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.uniteService.deleteUnite(unite.uuid).subscribe(
            () => {
              this.showSuccessMessage('Suppression effectuée avec succès.');
            },
            () => {
              this.showErrorMessage('Vous ne pouvez pas supprimer cet élément.');
            }
        );
      }
    });
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.uniteOrganigrammeComponent?.closeModal();
      this.uniteOrganigrammeComponent?.loadData();
    });
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message
    }).then(() => {
      this.uniteOrganigrammeComponent?.closeModal();
      this.uniteOrganigrammeComponent?.loadData();
    });
  }


}








