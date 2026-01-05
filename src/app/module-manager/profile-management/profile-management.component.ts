import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application } from '../models/application';
import { Profile } from '../models/Profile';
import { Privilege } from '../models/Privilege';
import { ProfileService } from '../services/profile.service';
import { PrivilegeService } from '../services/privilege.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {

  @Input() application!: Application;
  @Output() closeModal = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<void>();

  profiles: Profile[] = [];
  allPrivileges: Privilege[] = [];
  selectedProfile: Profile | null = null;
  availablePrivileges: Privilege[] = [];
  isLoading: boolean = false;
  isCreatingProfile: boolean = false;
  isEditingProfile: boolean = false;
  newProfile: Profile = new Profile();
  editingProfile: Profile = new Profile();

  constructor(
    private profileService: ProfileService,
    private privilegeService: PrivilegeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (!this.application || !this.application.uuid) {
      console.error('Application non définie');
      return;
    }

    this.isLoading = true;

    // Charger les profils et les privilèges en parallèle
    Promise.all([
      this.profileService.getProfilesByApplication(this.application.uuid).toPromise(),
      this.privilegeService.getPrivilegesByApplication(this.application.uuid).toPromise()
    ]).then(([profiles, privileges]) => {
      this.profiles = profiles || [];
      this.allPrivileges = privileges || [];
      console.log('Profils chargés:', this.profiles);
      console.log('Privilèges chargés:', this.allPrivileges);
      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement:', error);
      Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      this.isLoading = false;
    });
  }

  selectProfile(profile: Profile): void {
    console.log('🎯 Sélection du profil:', profile);
    this.selectedProfile = profile;
    this.isEditingProfile = false;
    this.updateAvailablePrivileges();
  }

  updateAvailablePrivileges(): void {
    if (!this.selectedProfile) {
      this.availablePrivileges = [];
      return;
    }

    console.log('🔄 Mise à jour des privilèges disponibles');
    console.log('  - Privilèges attribués:', this.selectedProfile.privilegesAttributed);
    console.log('  - Tous les privilèges:', this.allPrivileges);

    const assignedPrivilegeUuids = (this.selectedProfile.privilegesAttributed || []).map(p => p.uuid);
    this.availablePrivileges = this.allPrivileges.filter(p => !assignedPrivilegeUuids.includes(p.uuid));
    
    console.log('  - Privilèges disponibles après filtre:', this.availablePrivileges);
  }

  grantPrivilege(privilege: Privilege): void {
    console.log('➕ Ajout du privilège:', privilege.nom);
    console.log('  - Profil sélectionné:', this.selectedProfile?.nom);
    console.log('  - UUID Profil:', this.selectedProfile?.uuid);
    console.log('  - UUID Privilège:', privilege.uuid);

    if (!this.selectedProfile || !this.selectedProfile.uuid || !privilege.uuid) {
      console.error('❌ Impossible d\'ajouter: profil ou privilège manquant');
      return;
    }

    this.profileService.addPrivilegeToProfile(this.selectedProfile.uuid, privilege.uuid).subscribe({
      next: (updatedProfile: Profile) => {
        console.log('✅ Privilège ajouté avec succès. Profil mis à jour:', updatedProfile);
        
        // Mettre à jour le profil dans la liste
        const index = this.profiles.findIndex(p => p.uuid === updatedProfile.uuid);
        if (index !== -1) {
          this.profiles[index] = updatedProfile;
          this.selectedProfile = updatedProfile;
        }
        this.updateAvailablePrivileges();
        this.profileUpdated.emit();
        
        Swal.fire({
          icon: 'success',
          title: 'Privilège ajouté',
          text: `Le privilège "${privilege.nom}" a été ajouté au profil`,
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false
        });
      },
      error: (error: any) => {
        console.error('❌ Erreur lors de l\'ajout du privilège:', error);
        Swal.fire('Erreur', 'Impossible d\'ajouter le privilège', 'error');
      }
    });
  }

  revokePrivilege(privilege: Privilege): void {
    console.log('➖ Retrait du privilège:', privilege.nom);
    console.log('  - Profil sélectionné:', this.selectedProfile?.nom);
    
    if (!this.selectedProfile) {
      console.error('❌ Aucun profil sélectionné');
      return;
    }

    Swal.fire({
      title: 'Retirer le privilège',
      text: `Retirer le privilège "${privilege.nom}" de ce profil ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6846',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed && this.selectedProfile && this.selectedProfile.uuid && privilege.uuid) {
        console.log('🗑️ Confirmation du retrait. Appel API...');
        
        this.profileService.removePrivilegeFromProfile(this.selectedProfile.uuid, privilege.uuid).subscribe({
          next: (updatedProfile: Profile) => {
            console.log('✅ Privilège retiré avec succès. Profil mis à jour:', updatedProfile);
            
            const index = this.profiles.findIndex(p => p.uuid === updatedProfile.uuid);
            if (index !== -1) {
              this.profiles[index] = updatedProfile;
              this.selectedProfile = updatedProfile;
            }
            this.updateAvailablePrivileges();
            this.profileUpdated.emit();
            
            Swal.fire({
              icon: 'success',
              title: 'Privilège retiré',
              timer: 2000,
              showConfirmButton: false,
              heightAuto: false
            });
          },
          error: (error: any) => {
            console.error('❌ Erreur lors du retrait du privilège:', error);
            Swal.fire('Erreur', 'Impossible de retirer le privilège', 'error');
          }
        });
      }
    });
  }

  startCreateProfile(): void {
    this.isCreatingProfile = true;
    this.newProfile = new Profile();
    this.newProfile.uuidApplication = this.application.uuid;
    this.newProfile.privilegesAttributed = [];
  }

  cancelCreateProfile(): void {
    this.isCreatingProfile = false;
    this.newProfile = new Profile();
  }

  saveNewProfile(): void {
    if (!this.newProfile.nom || !this.newProfile.description) {
      Swal.fire('Attention', 'Veuillez remplir tous les champs', 'warning');
      return;
    }

    this.newProfile.uuidApplication = this.application.uuid;

    this.profileService.createProfile(this.newProfile).subscribe({
      next: (created: Profile) => {
        this.profiles.push(created);
        Swal.fire('Succès', 'Profil créé avec succès', 'success');
        this.cancelCreateProfile();
        this.profileUpdated.emit();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        Swal.fire('Erreur', 'Impossible de créer le profil', 'error');
      }
    });
  }

  startEditProfile(profile: Profile): void {
    console.log('✏️ Début de l\'édition du profil:', profile);
    this.isEditingProfile = true;
    this.editingProfile = { ...profile };
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.editingProfile = new Profile();
  }

  saveEditProfile(): void {
    if (!this.editingProfile.nom || !this.editingProfile.description) {
      Swal.fire('Attention', 'Veuillez remplir tous les champs', 'warning');
      return;
    }

    console.log('💾 Sauvegarde de l\'édition du profil:', this.editingProfile);

    this.profileService.updateProfile(this.editingProfile).subscribe({
      next: (updated: Profile) => {
        console.log('✅ Profil mis à jour avec succès:', updated);
        
        const index = this.profiles.findIndex(p => p.uuid === updated.uuid);
        if (index !== -1) {
          this.profiles[index] = updated;
          if (this.selectedProfile?.uuid === updated.uuid) {
            this.selectedProfile = updated;
          }
        }
        
        Swal.fire('Succès', 'Profil modifié avec succès', 'success');
        this.cancelEditProfile();
        this.profileUpdated.emit();
      },
      error: (error: any) => {
        console.error('❌ Erreur lors de la modification:', error);
        Swal.fire('Erreur', 'Impossible de modifier le profil', 'error');
      }
    });
  }

  deleteProfile(profile: Profile): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer le profil "${profile.nom}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed && profile.uuid) {
        this.profileService.deleteProfile(profile.uuid).subscribe({
          next: () => {
            this.profiles = this.profiles.filter(p => p.uuid !== profile.uuid);
            if (this.selectedProfile?.uuid === profile.uuid) {
              this.selectedProfile = null;
            }
            Swal.fire('Supprimé', 'Le profil a été supprimé', 'success');
            this.profileUpdated.emit();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire('Erreur', 'Impossible de supprimer le profil', 'error');
          }
        });
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  trackByPrivilegeUuid(index: number, privilege: Privilege): string {
    return privilege.uuid || index.toString();
  }

  trackByProfileUuid(index: number, profile: Profile): string {
    return profile.uuid || index.toString();
  }
}

