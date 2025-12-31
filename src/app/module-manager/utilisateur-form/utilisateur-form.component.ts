import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../services/utilisateur.service';
import { ApplicationService } from '../services/application.service';
import { Utilisateur } from '../models/Utilisateur';
import { Application } from '../models/application';
import { UserAppDtos } from '../models/UserAppDtos';
import { Role, RoleOptions } from '../models/role.enum';
import Swal from 'sweetalert2';

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
  
  applications: Application[] = [];
  availableApplications: Application[] = [];
  roleOptions = RoleOptions;  // Options pour le select des rôles

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilisateurService: UtilisateurService,
    private readonly applicationService: ApplicationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadApplications();
    
    if (this.userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(this.userToEdit);
      // Initialiser userAppDtos si non défini
      if (!this.userToEdit.userAppDtos) {
        this.userToEdit.userAppDtos = [];
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[ngOnChanges] Changes détectés:', changes);
    // Mettre à jour les applications disponibles quand userToEdit change
    if (changes['userToEdit']) {
      console.log('[ngOnChanges] userToEdit a changé');
      console.log('[ngOnChanges] firstChange:', changes['userToEdit'].firstChange);
      console.log('[ngOnChanges] previousValue:', changes['userToEdit'].previousValue);
      console.log('[ngOnChanges] currentValue:', changes['userToEdit'].currentValue);
      
      if (this.userToEdit && !this.userToEdit.userAppDtos) {
        console.log('[ngOnChanges] Initialisation de userAppDtos à []');
        this.userToEdit.userAppDtos = [];
      }
      this.updateAvailableApplications();
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

  loadApplications(): void {
    console.log('[loadApplications] Début du chargement des applications');
    this.applicationService.getAllApplication().subscribe({
      next: (appsPaged) => {
        console.log('[loadApplications] Applications reçues:', appsPaged.data);
        console.log('[loadApplications] Nombre d\'applications:', appsPaged.data?.length || 0);
        this.applications = appsPaged.data;
        // Mettre à jour les applications disponibles après le chargement
        this.updateAvailableApplications();
      },
      error: (error) => {
        console.error('[loadApplications] Erreur chargement applications:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formData = this.userForm.value;

    if (this.isEditMode && this.userToEdit) {
      console.log('[onSubmit] ========== SOUMISSION ==========');
      console.log('[onSubmit] userToEdit.userAppDtos:', this.userToEdit.userAppDtos);
      console.log('[onSubmit] Nombre d\'applications autorisées:', this.userToEdit.userAppDtos?.length || 0);
      
      const utilisateur: Utilisateur = { 
        uuid: this.userToEdit.uuid,
        password: this.userToEdit.password,
        userAppDtos: this.userToEdit.userAppDtos || [],
        ...formData
      };
      
      console.log('[onSubmit] Objet utilisateur à envoyer:', utilisateur);
      console.log('[onSubmit] userAppDtos envoyés:', utilisateur.userAppDtos);
      
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
        userAppDtos: [],
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
  trackByCodeApp(index: number, item: UserAppDtos): string {
    return item.codeApp || item.uuidApp;
  }

  trackByUuid(index: number, item: Application): string {
    return item.uuid;
  }

  getRoleDescription(role: Role | null): string {
    if (!role) return '';
    const roleOption = this.roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.description : '';
  }

  updateAvailableApplications(): void {
    console.log('[updateAvailableApplications] ========== DEBUT ==========');
    console.log('[updateAvailableApplications] applications:', this.applications);
    console.log('[updateAvailableApplications] applications.length:', this.applications?.length);
    console.log('[updateAvailableApplications] userToEdit:', this.userToEdit);
    console.log('[updateAvailableApplications] userToEdit.userAppDtos:', this.userToEdit?.userAppDtos);
    
    // Si pas d'applications chargées, ne rien faire
    if (!this.applications || this.applications.length === 0) {
      console.log('[updateAvailableApplications] ❌ Pas d\'applications chargées');
      this.availableApplications = [];
      return;
    }
    
    console.log('[updateAvailableApplications] ✅ Applications totales:', this.applications.length);
    
    if (!this.userToEdit) {
      console.log('[updateAvailableApplications] ⚠️ Pas d\'utilisateur à éditer - Toutes les applications disponibles');
      this.availableApplications = [...this.applications];
      console.log('[updateAvailableApplications] availableApplications:', this.availableApplications.length);
      return;
    }
    
    if (!this.userToEdit.userAppDtos || this.userToEdit.userAppDtos.length === 0) {
      console.log('[updateAvailableApplications] ✅ Aucune application autorisée - Toutes sont disponibles');
      this.availableApplications = [...this.applications];
      console.log('[updateAvailableApplications] availableApplications:', this.availableApplications.length);
      return;
    }
    
    // Filtrer les applications déjà autorisées
    const authorizedAppUuids = this.userToEdit.userAppDtos.map(ua => ua.uuidApp);
    console.log('[updateAvailableApplications] 📋 Applications autorisées (UUID):', authorizedAppUuids);
    console.log('[updateAvailableApplications] 📋 Applications autorisées (noms):', this.userToEdit.userAppDtos.map(ua => ua.nomApp));
    
    this.availableApplications = this.applications.filter(app => !authorizedAppUuids.includes(app.uuid));
    console.log('[updateAvailableApplications] ✅ Applications disponibles:', this.availableApplications.length);
    console.log('[updateAvailableApplications] 📋 Applications disponibles (noms):', this.availableApplications.map(app => app.nom));
    console.log('[updateAvailableApplications] ========== FIN ==========');
  }

  grantAppAccess(application: Application): void {
    if (!this.userToEdit) return;

    Swal.fire({
      title: 'Autoriser l\'accès',
      text: `Voulez-vous autoriser l'accès à ${application.nom} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, autoriser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#0d6846',
      heightAuto: false,
      backdrop: true
    } as any).then((result) => {
      if (result.isConfirmed) {
        // Créer un nouveau UserAppDto avec toutes les propriétés requises
        const newUserApp = new UserAppDtos();
        newUserApp.uuid = '';  // Sera généré par le backend
        newUserApp.uuidUtilisateur = this.userToEdit!.uuid;
        newUserApp.emailUtilisateur = this.userToEdit!.email;
        newUserApp.telephoneUtilisateur = this.userToEdit!.telephone || '';
        newUserApp.uuidApp = application.uuid;
        newUserApp.codeApp = application.code;
        newUserApp.nomApp = application.nom;
        newUserApp.dependances = application.dependances || '';
        newUserApp.hasAccess = true;
        newUserApp.enabled = true;
        newUserApp.nonLocked = true;
        newUserApp.nonExpired = true;

        // Ajouter à la liste
        if (!this.userToEdit!.userAppDtos) {
          this.userToEdit!.userAppDtos = [];
        }
        this.userToEdit!.userAppDtos.push(newUserApp);

        // Mettre à jour les applications disponibles
        this.updateAvailableApplications();
        
        // Forcer la détection de changement
        this.cdr.detectChanges();

        Swal.fire({
          title: 'Succès !',
          text: 'Accès autorisé. N\'oubliez pas de sauvegarder.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false,
          backdrop: true
        } as any);
      }
    });
  }

  revokeAppAccess(userApp: any): void {
    console.log('[revokeAppAccess] ========== DEBUT ==========');
    console.log('[revokeAppAccess] userApp à retirer:', userApp);
    console.log('[revokeAppAccess] userApp.codeApp:', userApp.codeApp);
    console.log('[revokeAppAccess] userApp.uuidApp:', userApp.uuidApp);
    console.log('[revokeAppAccess] userAppDtos AVANT:', this.userToEdit?.userAppDtos);
    
    if (!this.userToEdit) return;

    Swal.fire({
      title: 'Retirer l\'accès',
      text: `Voulez-vous retirer l'accès à ${userApp.nomApp} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545',
      heightAuto: false,
      backdrop: true
    } as any).then((result) => {
      if (result.isConfirmed) {
        console.log('[revokeAppAccess] Confirmation reçue');
        console.log('[revokeAppAccess] userAppDtos AVANT le retrait:', JSON.stringify(this.userToEdit!.userAppDtos!.map(ua => ({code: ua.codeApp, nom: ua.nomApp}))));
        
        // Filtrer pour retirer l'application en créant un nouveau tableau
        const newUserAppDtos = this.userToEdit!.userAppDtos!.filter(ua => {
          const keepIt = ua.codeApp !== userApp.codeApp && ua.uuidApp !== userApp.uuidApp;
          if (!keepIt) {
            console.log('[revokeAppAccess] 🗑️ Retrait de:', ua.nomApp, '(codeApp:', ua.codeApp, ')');
          }
          return keepIt;
        });
        
        console.log('[revokeAppAccess] Nouveau tableau créé avec', newUserAppDtos.length, 'éléments');
        
        // Assigner le nouveau tableau
        this.userToEdit!.userAppDtos = newUserAppDtos;
        
        console.log('[revokeAppAccess] userAppDtos APRES le retrait:', JSON.stringify(this.userToEdit!.userAppDtos!.map(ua => ({code: ua.codeApp, nom: ua.nomApp}))));
        console.log('[revokeAppAccess] Nombre restant:', this.userToEdit!.userAppDtos!.length);
        console.log('[revokeAppAccess] Référence du tableau changée:', newUserAppDtos !== this.userToEdit!.userAppDtos);

        // Mettre à jour les applications disponibles
        this.updateAvailableApplications();
        
        // Forcer la détection de changement d'Angular
        console.log('[revokeAppAccess] Force la détection de changement...');
        this.cdr.detectChanges();
        console.log('[revokeAppAccess] Détection de changement terminée');

        Swal.fire({
          title: 'Succès !',
          text: 'Accès retiré. N\'oubliez pas de sauvegarder.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          heightAuto: false,
          backdrop: true
        } as any);
      }
      console.log('[revokeAppAccess] ========== FIN ==========');
    });
  }
}
