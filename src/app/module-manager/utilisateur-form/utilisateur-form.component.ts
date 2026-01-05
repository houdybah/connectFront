import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../services/utilisateur.service';
import { ProfileService } from '../services/profile.service';
import { Utilisateur } from '../models/Utilisateur';
import { Profile } from '../models/Profile';
import { UserProfile } from '../models/UserProfile';
import { Role, RoleOptions } from '../models/role.enum';
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilisateurService: UtilisateurService,
    private readonly profileService: ProfileService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProfiles();
    
    if (this.userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(this.userToEdit);
      // Initialiser userProfileDtos si non défini
      if (!this.userToEdit.userProfileDtos) {
        this.userToEdit.userProfileDtos = [];
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

  getRoleDescription(role: Role | null): string {
    if (!role) return '';
    const roleOption = this.roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.description : '';
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
      return;
    }
    
    console.log('[updateAvailableProfiles] ✅ Profils totaux:', this.profiles.length);
    
    if (!this.userToEdit) {
      console.log('[updateAvailableProfiles] ⚠️ Pas d\'utilisateur à éditer - Tous les profils disponibles');
      this.availableProfiles = [...this.profiles];
      console.log('[updateAvailableProfiles] availableProfiles:', this.availableProfiles.length);
      return;
    }
    
    if (!this.userToEdit.userProfileDtos || this.userToEdit.userProfileDtos.length === 0) {
      console.log('[updateAvailableProfiles] ✅ Aucun profil autorisé - Tous sont disponibles');
      this.availableProfiles = [...this.profiles];
      console.log('[updateAvailableProfiles] availableProfiles:', this.availableProfiles.length);
      return;
    }
    
    // Filtrer les profils déjà autorisés
    const authorizedProfileUuids = this.userToEdit.userProfileDtos.map(up => up.uuidProfile);
    console.log('[updateAvailableProfiles] 📋 Profils autorisés (UUID):', authorizedProfileUuids);
    console.log('[updateAvailableProfiles] 📋 Profils autorisés (noms):', this.userToEdit.userProfileDtos.map(up => up.nomProfile));
    
    this.availableProfiles = this.profiles.filter(profile => profile.uuid && !authorizedProfileUuids.includes(profile.uuid));
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
    });
  }

  revokeProfileAccess(userProfile: UserProfile): void {
    console.log('[revokeProfileAccess] ========== DEBUT ==========');
    console.log('[revokeProfileAccess] userProfile à retirer:', userProfile);
    console.log('[revokeProfileAccess] userProfile.uuidProfile:', userProfile.uuidProfile);
    console.log('[revokeProfileAccess] userProfile.nomProfile:', userProfile.nomProfile);
    console.log('[revokeProfileAccess] userProfileDtos AVANT:', this.userToEdit?.userProfileDtos);
    
    if (!this.userToEdit) return;

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
}
