import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../services/utilisateur.service';
import { ProfileService } from '../services/profile.service';
import { Utilisateur } from '../models/Utilisateur';
import { Profile } from '../models/Profile';
import { UserProfile } from '../models/UserProfile';
import { Attribut } from '../models/Attribut';
import { Role, RoleOptions } from '../models/role.enum';
import { AdminAccessService, AdminAccess } from '../../core/services/admin-access.service';
import Swal from 'sweetalert2';

interface ProfilesByApp {
  applicationNom: string;
  applicationUuid: string;
  profiles: Profile[];
}

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.scss']
})
export class UtilisateurFormComponent implements OnInit, OnChanges {
  @Input() userToEdit: Utilisateur | null = null;
  @Output() onClose = new EventEmitter<boolean>();
  
  userForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  profiles: Profile[] = [];
  availableProfiles: Profile[] = [];
  profilesByApplication: ProfilesByApp[] = [];
  roleOptions = RoleOptions;  // Options pour le select des rôles

  // Périmètre d'administration de l'utilisateur courant (celui qui édite ce formulaire) :
  // un administrateur d'application ne doit pouvoir accorder/retirer des profils que pour
  // les applications qu'il administre lui-même. Un SUPER_USER n'est pas restreint.
  adminAccess: AdminAccess | null = null;

  // Attributs de l'utilisateur
  newAttributCle: string = '';
  newAttributValeur: string = '';
  editingAttributIndex: number = -1;

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilisateurService: UtilisateurService,
    private readonly profileService: ProfileService,
    private readonly adminAccessService: AdminAccessService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.adminAccess = await this.adminAccessService.getAccess();
    this.loadProfiles();

    if (this.userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(this.userToEdit);
      // Initialiser userProfileDtos si non défini
      if (!this.userToEdit.userProfileDtos) {
        this.userToEdit.userProfileDtos = [];
      }
      // Initialiser userAttributDtos si non défini
      if (!this.userToEdit.userAttributDtos) {
        this.userToEdit.userAttributDtos = [];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[ngOnChanges] Changes détectés:', changes);
    // Mettre à jour les profils disponibles quand userToEdit change
    if (changes['userToEdit']) {
      console.log('[ngOnChanges] userToEdit a changé');
      console.log('[ngOnChanges] firstChange:', changes['userToEdit'].firstChange);
      console.log('[ngOnChanges] previousValue:', changes['userToEdit'].previousValue);
      console.log('[ngOnChanges] currentValue:', changes['userToEdit'].currentValue);
      
      if (this.userToEdit && !this.userToEdit.userProfileDtos) {
        console.log('[ngOnChanges] Initialisation de userProfileDtos à []');
        this.userToEdit.userProfileDtos = [];
      }
      this.updateAvailableProfiles();
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      service: [''],
      fonction: [''],
      role: [null],  // Rôle de type enum
      active: [true],  // Champ pour activer/désactiver le compte utilisateur
      password: [''],  // Champ pour définir/modifier le mot de passe
      enabled: [true]  // Champ pour les droits d'accès aux applications
    });
  }

  loadProfiles(): void {
    console.log('[loadProfiles] Début du chargement des profils');
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        console.log('[loadProfiles] Profils reçus:', profiles);
        console.log('[loadProfiles] Nombre de profils:', profiles?.length || 0);
        this.profiles = profiles;
        // Mettre à jour les profils disponibles après le chargement
        this.updateAvailableProfiles();
      },
      error: (error) => {
        console.error('[loadProfiles] Erreur chargement profils:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formData = this.userForm.value;

    if (this.isEditMode && this.userToEdit) {
      console.log('[onSubmit] ========== SOUMISSION ==========');
      console.log('[onSubmit] userToEdit.userProfileDtos:', this.userToEdit.userProfileDtos);
      console.log('[onSubmit] Nombre de profils autorisés:', this.userToEdit.userProfileDtos?.length || 0);
      
      const utilisateur: Utilisateur = { 
        uuid: this.userToEdit.uuid,
        password: this.userToEdit.password,
        userProfileDtos: this.userToEdit.userProfileDtos || [],
        userAttributDtos: this.userToEdit.userAttributDtos || [],
        ...formData
      };
      
      console.log('[onSubmit] Objet utilisateur à envoyer:', utilisateur);
      console.log('[onSubmit] userProfileDtos envoyés:', utilisateur.userProfileDtos);
      
      this.utilisateurService.updateUtilisateur(utilisateur).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès !',
            text: 'L\'utilisateur a été mis à jour avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.onClose.emit(true);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur !',
            text: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.',
            icon: 'error',
            confirmButtonColor: '#0d6846'
          });
        }
      });
    } else {
      const utilisateur: Utilisateur = { 
        uuid: '',
        password: '',
        userProfileDtos: [],
        userAttributDtos: [],
        ...formData
      };
      this.utilisateurService.newUtilisateur(utilisateur).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès !',
            text: 'L\'utilisateur a été créé avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.onClose.emit(true);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur !',
            text: 'Une erreur est survenue lors de la création de l\'utilisateur.',
            icon: 'error',
            confirmButtonColor: '#0d6846'
          });
        }
      });
    }
  }

  cancel(): void {
    this.onClose.emit(false);
  }

  // Fonction trackBy pour optimiser le ngFor et forcer la détection de changement
  trackByUuidProfile(index: number, item: UserProfile): string {
    return item.uuidProfile || item.uuid || '';
  }

  trackByUuid(index: number, item: Profile): string {
    return item.uuid || '';
  }

  trackByAttributUuid(index: number, item: Attribut): string {
    return item.uuid || index.toString();
  }

  getRoleDescription(role: Role | null): string {
    if (!role) return '';
    const roleOption = this.roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.description : '';
  }

  /**
   * true si l'utilisateur courant (celui qui édite ce formulaire) peut accorder ou retirer un
   * profil pour l'application donnée : un SUPER_USER peut tout, un administrateur d'application
   * uniquement pour les applications qu'il administre lui-même. Tant que le périmètre n'est pas
   * encore chargé, on refuse par prudence (aucune action de gestion tant que ce n'est pas certain).
   */
  canManageApplication(uuidApplication?: string): boolean {
    if (!this.adminAccess) {
      return false;
    }
    if (this.adminAccess.isSuperUser) {
      return true;
    }
    return !!uuidApplication && this.adminAccess.adminApplicationUuids.includes(uuidApplication);
  }

  updateAvailableProfiles(): void {
    console.log('[updateAvailableProfiles] ========== DEBUT ==========');
    console.log('[updateAvailableProfiles] profiles:', this.profiles);
    console.log('[updateAvailableProfiles] profiles.length:', this.profiles?.length);
    console.log('[updateAvailableProfiles] userToEdit:', this.userToEdit);
    console.log('[updateAvailableProfiles] userToEdit.userProfileDtos:', this.userToEdit?.userProfileDtos);

    // Si pas de profils chargés, ne rien faire
    if (!this.profiles || this.profiles.length === 0) {
      console.log('[updateAvailableProfiles] ❌ Pas de profils chargés');
      this.availableProfiles = [];
      this.profilesByApplication = [];
      return;
    }

    console.log('[updateAvailableProfiles] ✅ Profils totaux:', this.profiles.length);

    // Un administrateur d'application ne doit voir (et donc pouvoir accorder) que les profils
    // des applications qu'il administre lui-même ; un SUPER_USER voit tout. Tant que le périmètre
    // n'est pas encore chargé (adminAccess null), on n'affiche rien par prudence.
    const scopedProfiles = this.profiles.filter(profile => this.canManageApplication(profile.uuidApplication));
    console.log('[updateAvailableProfiles] 🔒 Profils dans le périmètre d\'administration:', scopedProfiles.length);

    if (!this.userToEdit) {
      console.log('[updateAvailableProfiles] ⚠️ Pas d\'utilisateur à éditer - Tous les profils du périmètre disponibles');
      this.availableProfiles = [...scopedProfiles];
      this.groupProfilesByApplication();
      console.log('[updateAvailableProfiles] availableProfiles:', this.availableProfiles.length);
      return;
    }

    if (!this.userToEdit.userProfileDtos || this.userToEdit.userProfileDtos.length === 0) {
      console.log('[updateAvailableProfiles] ✅ Aucun profil autorisé - Tous ceux du périmètre sont disponibles');
      this.availableProfiles = [...scopedProfiles];
      this.groupProfilesByApplication();
      console.log('[updateAvailableProfiles] availableProfiles:', this.availableProfiles.length);
      return;
    }

    // Filtrer les profils déjà autorisés
    const authorizedProfileUuids = this.userToEdit.userProfileDtos.map(up => up.uuidProfile);
    console.log('[updateAvailableProfiles] 📋 Profils autorisés (UUID):', authorizedProfileUuids);
    console.log('[updateAvailableProfiles] 📋 Profils autorisés (noms):', this.userToEdit.userProfileDtos.map(up => up.nomProfile));

    this.availableProfiles = scopedProfiles.filter(profile => profile.uuid && !authorizedProfileUuids.includes(profile.uuid));
    console.log('[updateAvailableProfiles] ✅ Profils disponibles:', this.availableProfiles.length);
    console.log('[updateAvailableProfiles] 📋 Profils disponibles (noms):', this.availableProfiles.map(profile => profile.nom));

    // Grouper les profils disponibles par application
    this.groupProfilesByApplication();

    console.log('[updateAvailableProfiles] ========== FIN ==========');
  }

  groupProfilesByApplication(): void {
    const grouped = new Map<string, ProfilesByApp>();
    
    this.availableProfiles.forEach(profile => {
      if (!profile.nomApplication || !profile.uuidApplication) {
        console.warn('Profil sans application:', profile);
        return;
      }
      
      if (!grouped.has(profile.uuidApplication)) {
        grouped.set(profile.uuidApplication, {
          applicationNom: profile.nomApplication,
          applicationUuid: profile.uuidApplication,
          profiles: []
        });
      }
      
      grouped.get(profile.uuidApplication)!.profiles.push(profile);
    });
    
    this.profilesByApplication = Array.from(grouped.values());
    
    console.log('[groupProfilesByApplication] Groupes créés:', this.profilesByApplication.length);
    this.profilesByApplication.forEach(group => {
      console.log(`  - ${group.applicationNom}: ${group.profiles.length} profil(s)`);
    });
  }

  grantProfileAccess(profile: Profile): void {
    if (!this.userToEdit) return;

    // Un administrateur d'application ne peut accorder l'accès qu'aux applications qu'il
    // administre lui-même (le bouton n'est normalement même pas affiché dans ce cas).
    if (!this.canManageApplication(profile.uuidApplication)) {
      Swal.fire({
        title: 'Action non autorisée',
        text: `Vous n'administrez pas l'application ${profile.nomApplication}.`,
        icon: 'error',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    // Validation: Vérifier si l'utilisateur a déjà un profil pour cette application
    const existingProfileForApp = this.userToEdit.userProfileDtos?.find(
      up => up.uuidApplication === profile.uuidApplication && up.hasAccess
    );

    if (existingProfileForApp) {
      Swal.fire({
        title: 'Attention !',
        html: `L'utilisateur a déjà le profil <strong>"${existingProfileForApp.nomProfile}"</strong> pour l'application <strong>${profile.nomApplication}</strong>.<br><br>Un utilisateur ne peut avoir qu'un seul profil par application.<br><br>Voulez-vous remplacer ce profil par <strong>"${profile.nom}"</strong> ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, remplacer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#0d6846',
        cancelButtonColor: '#dc3545',
        heightAuto: false,
        backdrop: true
      } as any).then((result) => {
        if (result.isConfirmed) {
          // Retirer l'ancien profil
          this.userToEdit!.userProfileDtos = this.userToEdit!.userProfileDtos!.filter(
            up => up.uuidProfile !== existingProfileForApp.uuidProfile
          );
          // Ajouter le nouveau profil
          this.addNewProfile(profile);
        }
      });
      return;
    }

    Swal.fire({
      title: 'Autoriser l\'accès',
      text: `Voulez-vous autoriser le profil "${profile.nom}" pour ${profile.nomApplication} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, autoriser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#0d6846',
      heightAuto: false,
      backdrop: true
    } as any).then((result) => {
      if (result.isConfirmed) {
        this.addNewProfile(profile);
      }
    });
  }

  private addNewProfile(profile: Profile): void {
    if (!this.userToEdit) return;
        // Créer un nouveau UserProfile avec toutes les propriétés requises
        const newUserProfile: UserProfile = {
          uuid: '',  // Sera généré par le backend
          uuidUtilisateur: this.userToEdit!.uuid,
          emailUtilisateur: this.userToEdit!.email,
          nomUtilisateur: this.userToEdit!.nom,
          prenomUtilisateur: this.userToEdit!.prenom,
          uuidProfile: profile.uuid!,
          nomProfile: profile.nom,
          descriptionProfile: profile.description,
          uuidApplication: profile.uuidApplication,
          codeApplication: profile.codeApplication,
          nomApplication: profile.nomApplication,
          hasAccess: true,
          enabled: true,
          nonLocked: true,
          nonExpired: true
        };

        // Ajouter à la liste
        if (!this.userToEdit!.userProfileDtos) {
          this.userToEdit!.userProfileDtos = [];
        }
        this.userToEdit!.userProfileDtos.push(newUserProfile);

        // Mettre à jour les profils disponibles
        this.updateAvailableProfiles();
        
        // Forcer la détection de changement
        this.cdr.detectChanges();

        Swal.fire({
          title: 'Succès !',
          text: 'Profil autorisé. N\'oubliez pas de sauvegarder.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false,
          backdrop: true
        } as any);
  }

  revokeProfileAccess(userProfile: UserProfile): void {
    console.log('[revokeProfileAccess] ========== DEBUT ==========');
    console.log('[revokeProfileAccess] userProfile à retirer:', userProfile);
    console.log('[revokeProfileAccess] userProfile.uuidProfile:', userProfile.uuidProfile);
    console.log('[revokeProfileAccess] userProfile.nomProfile:', userProfile.nomProfile);
    console.log('[revokeProfileAccess] userProfileDtos AVANT:', this.userToEdit?.userProfileDtos);

    if (!this.userToEdit) return;

    // Un administrateur d'application ne peut retirer l'accès que pour les applications qu'il
    // administre lui-même (le bouton n'est normalement même pas affiché dans ce cas).
    if (!this.canManageApplication(userProfile.uuidApplication)) {
      Swal.fire({
        title: 'Action non autorisée',
        text: `Vous n'administrez pas l'application ${userProfile.nomApplication}.`,
        icon: 'error',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    Swal.fire({
      title: 'Retirer l\'accès',
      text: `Voulez-vous retirer le profil "${userProfile.nomProfile}" pour ${userProfile.nomApplication} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545',
      heightAuto: false,
      backdrop: true
    } as any).then((result) => {
      if (result.isConfirmed) {
        console.log('[revokeProfileAccess] Confirmation reçue');
        console.log('[revokeProfileAccess] userProfileDtos AVANT le retrait:', JSON.stringify(this.userToEdit!.userProfileDtos!.map(up => ({profile: up.nomProfile, app: up.nomApplication}))));
        
        // Filtrer pour retirer le profil en créant un nouveau tableau
        const newUserProfileDtos = this.userToEdit!.userProfileDtos!.filter(up => {
          const keepIt = up.uuidProfile !== userProfile.uuidProfile;
          if (!keepIt) {
            console.log('[revokeProfileAccess] 🗑️ Retrait de:', up.nomProfile, '(uuidProfile:', up.uuidProfile, ')');
          }
          return keepIt;
        });
        
        console.log('[revokeProfileAccess] Nouveau tableau créé avec', newUserProfileDtos.length, 'éléments');
        
        // Assigner le nouveau tableau
        this.userToEdit!.userProfileDtos = newUserProfileDtos;
        
        console.log('[revokeProfileAccess] userProfileDtos APRES le retrait:', JSON.stringify(this.userToEdit!.userProfileDtos!.map(up => ({profile: up.nomProfile, app: up.nomApplication}))));
        console.log('[revokeProfileAccess] Nombre restant:', this.userToEdit!.userProfileDtos!.length);
        console.log('[revokeProfileAccess] Référence du tableau changée:', newUserProfileDtos !== this.userToEdit!.userProfileDtos);

        // Mettre à jour les profils disponibles
        this.updateAvailableProfiles();
        
        // Forcer la détection de changement d'Angular
        console.log('[revokeProfileAccess] Force la détection de changement...');
        this.cdr.detectChanges();
        console.log('[revokeProfileAccess] Détection de changement terminée');

        Swal.fire({
          title: 'Succès !',
          text: 'Profil retiré. N\'oubliez pas de sauvegarder.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false,
          backdrop: true
        } as any);
      }
      console.log('[revokeProfileAccess] ========== FIN ==========');
    });
  }

  // ========== Gestion des Attributs ==========

  addAttribut(): void {
    if (!this.userToEdit || !this.newAttributCle.trim() || !this.newAttributValeur.trim()) {
      Swal.fire({
        title: 'Attention !',
        text: 'Veuillez remplir la clé et la valeur de l\'attribut.',
        icon: 'warning',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    // Vérifier si la clé existe déjà
    const existingAttribut = this.userToEdit.userAttributDtos?.find(
      attr => attr.cle === this.newAttributCle.trim()
    );

    if (existingAttribut) {
      Swal.fire({
        title: 'Attention !',
        text: 'Un attribut avec cette clé existe déjà.',
        icon: 'warning',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    // Initialiser userAttributDtos si nécessaire
    if (!this.userToEdit.userAttributDtos) {
      this.userToEdit.userAttributDtos = [];
    }

    // Ajouter le nouvel attribut
    const newAttribut = new Attribut({
      cle: this.newAttributCle.trim(),
      valeur: this.newAttributValeur.trim(),
      uuidUtilisateur: this.userToEdit.uuid
    });

    this.userToEdit.userAttributDtos.push(newAttribut);

    // Réinitialiser les champs
    this.newAttributCle = '';
    this.newAttributValeur = '';

    Swal.fire({
      title: 'Succès !',
      text: 'Attribut ajouté. N\'oubliez pas de sauvegarder.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      heightAuto: false
    } as any);
  }

  startEditAttribut(index: number): void {
    this.editingAttributIndex = index;
  }

  saveEditAttribut(index: number): void {
    if (!this.userToEdit || !this.userToEdit.userAttributDtos) return;

    const attribut = this.userToEdit.userAttributDtos[index];
    
    if (!attribut.cle.trim() || !attribut.valeur.trim()) {
      Swal.fire({
        title: 'Attention !',
        text: 'La clé et la valeur ne peuvent pas être vides.',
        icon: 'warning',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    // Vérifier si la clé n'est pas déjà utilisée par un autre attribut
    const duplicateAttribut = this.userToEdit.userAttributDtos.find(
      (attr, idx) => idx !== index && attr.cle === attribut.cle.trim()
    );

    if (duplicateAttribut) {
      Swal.fire({
        title: 'Attention !',
        text: 'Un autre attribut avec cette clé existe déjà.',
        icon: 'warning',
        confirmButtonColor: '#0d6846',
        heightAuto: false
      } as any);
      return;
    }

    this.editingAttributIndex = -1;

    Swal.fire({
      title: 'Succès !',
      text: 'Attribut modifié. N\'oubliez pas de sauvegarder.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      heightAuto: false
    } as any);
  }

  cancelEditAttribut(): void {
    this.editingAttributIndex = -1;
  }

  deleteAttribut(index: number): void {
    if (!this.userToEdit || !this.userToEdit.userAttributDtos) return;

    const attribut = this.userToEdit.userAttributDtos[index];

    Swal.fire({
      title: 'Supprimer l\'attribut',
      text: `Voulez-vous supprimer l'attribut "${attribut.cle}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545',
      heightAuto: false,
      backdrop: true
    } as any).then((result) => {
      if (result.isConfirmed) {
        this.userToEdit!.userAttributDtos!.splice(index, 1);

        Swal.fire({
          title: 'Succès !',
          text: 'Attribut supprimé. N\'oubliez pas de sauvegarder.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false
        } as any);
      }
    });
  }
}
