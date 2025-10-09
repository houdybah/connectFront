import { Component, Host, Input, OnInit } from '@angular/core';
import { Profile } from "../../../models/Profile";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "../../../services/profile.service";
import { EnumService } from "../../../services/enum.service";
import Swal from "sweetalert2";
import { ProfileListComponent } from "../profile-list/profile-list.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent implements OnInit {

  @Input() innerProfile = new Profile();

  profileForm: FormGroup = Object.create(null);
  profileList!: ProfileListComponent;
  profile!: Profile;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted = false;

  // Rôles disponibles à afficher dans la colonne de gauche
  availableRoles: string[] = [];

  // Rôles attribués à afficher dans la colonne de droite
  assignedRoles: string[] = [];

  // Tous les rôles récupérés du service (pour référence)
  allRoles: string[] = [];

  showSuccess = false;

  constructor(
      public profileService: ProfileService,
      public enumService: EnumService,
      private fb: FormBuilder,
      @Host() profileList: ProfileListComponent
  ) {
    this.profileList = profileList;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
  }

  /**
   * Initialise le formulaire avec les validateurs
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      profileName: ["", [Validators.required, Validators.minLength(2)]],
      profileDescription: ["", [Validators.required, Validators.minLength(5)]],
      enabled: [false]
    });
  }

  /**
   * Charge les rôles depuis le service
   */
  private loadRoles(): void {
    this.enumService.getRoles().subscribe({
      next: (data: string[]) => {
        console.log('Rôles chargés:', data);
        this.allRoles = [...data];
        // Appel de setupProfile après le chargement des rôles
        this.setupProfile();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rôles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les rôles disponibles'
        });
      }
    });
  }

  /**
   * Configure le profil selon le mode (création/édition)
   */
  private setupProfile(): void {
    if (this.innerProfile && this.innerProfile.uuid) {
      // Mode édition
      this.isEdit = true;
      this.isEnable = false;
      this.profileForm.disable();
      this.profile = { ...this.innerProfile };
      this.displayProfile(this.profile);
    } else {
      // Mode création
      this.isEdit = false;
      this.isEnable = true;
      this.profileForm.enable();
      this.profile = new Profile();
      this.assignedRoles = [];
      // Initialiser les rôles disponibles avec tous les rôles
      this.availableRoles = [...this.allRoles];
    }
  }

  /**
   * Affiche les données du profil dans le formulaire
   */
  private displayProfile(profileDisplay: Profile): void {
    console.log('Affichage du profil:', profileDisplay);

    // Mise à jour du formulaire
    this.profileForm.patchValue({
      profileName: profileDisplay.profileName || '',
      profileDescription: profileDisplay.profileDescription || '',
      enabled: profileDisplay.enabled || false
    });

    // Gestion des rôles - S'assurer que les rôles du profil sont bien copiés
    this.assignedRoles = profileDisplay.roles ? [...profileDisplay.roles] : [];
    console.log('Rôles attribués:', this.assignedRoles);

    // Mettre à jour les rôles disponibles
    this.updateAvailableRoles();
  }

  /**
   * Met à jour la liste des rôles disponibles en excluant ceux déjà attribués
   */
  private updateAvailableRoles(): void {
    this.availableRoles = this.allRoles.filter(role =>
        !this.assignedRoles.includes(role)
    );
    console.log('Rôles disponibles mis à jour:', this.availableRoles);
    console.log('Rôles attribués:', this.assignedRoles);
  }

  /**
   * Active le mode édition
   */
  activer(event: Event): void {
    event.preventDefault();
    this.isEnable = true;
    this.profileForm.enable();
  }

  /**
   * Sauvegarde le profil
   */
  Onsave(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Veuillez corriger les erreurs avant de continuer'
      });
      return;
    }

    const profileData = {
      ...this.profile,
      ...this.profileForm.value,
      roles: [...this.assignedRoles]
    };

    if (this.isEdit) {
      this.updateProfile(profileData);
    } else {
      this.createProfile(profileData);
    }
  }

  /**
   * Met à jour un profil existant
   */
  private updateProfile(profileData: Profile): void {
    this.profileService.updateProfile(profileData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Modification effectuée avec succès!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.closeModalAndRefresh();
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la modification du profil'
        });
      }
    });
  }

  /**
   * Crée un nouveau profil
   */
  private createProfile(profileData: Profile): void {
    this.profileService.newProfile(profileData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Profil créé avec succès!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.closeModalAndRefresh();
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la création du profil'
        });
      }
    });
  }

  /**
   * Supprime le profil
   */
  delete(profile: Profile): void {
    if (!profile.uuid) {
      Swal.fire({
        icon: 'error',
        text: 'Impossible de supprimer ce profil'
      });
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.profileService.deleteProfile(profile.uuid).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Suppression effectuée avec succès',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.closeModalAndRefresh();
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer ce profil'
            });
          }
        });
      }
    });
  }

  /**
   * Gestion du drag & drop
   */
  onDrop(event: CdkDragDrop<string[]>): void {
    if (!this.isEnable) return;

    if (event.previousContainer === event.container) {
      // Réorganisation au sein de la même liste
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Déplacement entre listes
      transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
      );

      // Forcer la détection des changements en recréant les tableaux
      this.availableRoles = [...this.availableRoles];
      this.assignedRoles = [...this.assignedRoles];

      this.showSuccessMessage();
    }
  }

  /**
   * Ajoute un rôle à la liste des rôles attribués
   */
  addRole(roleId: string): void {
    if (!this.isEnable) return;

    const roleIndex = this.availableRoles.findIndex(role => role === roleId);
    if (roleIndex !== -1) {
      // Retirer le rôle des rôles disponibles
      this.availableRoles.splice(roleIndex, 1);
      // Ajouter le rôle aux rôles attribués
      this.assignedRoles.push(roleId);

      // Forcer la détection des changements en recréant les tableaux
      this.availableRoles = [...this.availableRoles];
      this.assignedRoles = [...this.assignedRoles];

      console.log('Rôle ajouté:', roleId);
      console.log('Rôles disponibles après ajout:', this.availableRoles);
      console.log('Rôles attribués après ajout:', this.assignedRoles);

      this.showSuccessMessage();
    }
  }

  /**
   * Retire un rôle de la liste des rôles attribués
   */
  removeRole(roleId: string): void {
    if (!this.isEnable) return;

    const roleIndex = this.assignedRoles.findIndex(role => role === roleId);
    if (roleIndex !== -1) {
      // Retirer le rôle des rôles attribués
      this.assignedRoles.splice(roleIndex, 1);
      // Ajouter le rôle aux rôles disponibles
      this.availableRoles.push(roleId);

      // Forcer la détection des changements en recréant les tableaux
      this.availableRoles = [...this.availableRoles];
      this.assignedRoles = [...this.assignedRoles];

      console.log('Rôle retiré:', roleId);
      console.log('Rôles disponibles après retrait:', this.availableRoles);
      console.log('Rôles attribués après retrait:', this.assignedRoles);

      this.showSuccessMessage();
    }
  }

  /**
   * Affiche le message de succès temporaire
   */
  private showSuccessMessage(): void {
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  /**
   * Marque tous les champs du formulaire comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Ferme la modal et rafraîchit la liste
   */
  private closeModalAndRefresh(): void {
    if (this.profileList) {
      this.profileList.closeModal();
      this.profileList.getProfiles();
    }
  }

  /**
   * TrackBy function pour optimiser les performances des *ngFor
   */
  trackByRole(index: number, role: string): string {
    return role;
  }

  /**
   * Getters pour faciliter l'accès aux contrôles du formulaire dans le template
   */
  get profileNameControl() {
    return this.profileForm.get('profileName');
  }

  get profileDescriptionControl() {
    return this.profileForm.get('profileDescription');
  }

  get enabledControl() {
    return this.profileForm.get('enabled');
  }

  /**
   * Vérifie si un champ a une erreur spécifique
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  /**
   * Obtient le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName === 'profileName' ? 'Le nom' : 'La description'} est requis`;
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${fieldName === 'profileName' ? 'Le nom' : 'La description'} doit contenir au moins ${requiredLength} caractères`;
      }
    }
    return '';
  }
}







