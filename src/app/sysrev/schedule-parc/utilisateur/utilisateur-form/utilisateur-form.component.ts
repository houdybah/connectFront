import { Component, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilisateur } from '../../../models/Utilisateur';
import { UtilisateurService } from '../../../services/utilisateur.service';


@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.component.html',
  styleUrl: './utilisateur-form.component.scss'
})
export class UtilisateurFormComponent {
  @Input() title: string = 'Utilisateur';
   
  // NOUVELLES PROPRIÉTÉS À AJOUTER
  @Input() isEditMode: boolean = false;
  @Input() userToEdit: Utilisateur | null = null;

  // Vos propriétés existantes...
  Utilisateur = new Utilisateur
  
  userForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  submitting = false;
  errorMessage: string | null = null;
  
  constructor(
  private fb: FormBuilder,
  private userService: UtilisateurService,
  public activeModal: NgbModal,
) {
  this.userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    prenom: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    telephone: ['', [
      Validators.required, 
      Validators.pattern(/^\d{9}$/), 
      Validators.minLength(9),       
      Validators.maxLength(9)        
    ]],
    codeDeclarant: [''],
    role: ['', [Validators.required]],
    photo: [null],
    password: ['', [Validators.minLength(6)]]
  });
}

  // En mode création, garder la validation obligatoire (déjà définie dans le constructeur)
  
 
  ngOnInit(): void {
  // Définir les validateurs selon le mode
  if (this.isEditMode) {
    // En mode édition, le rôle n'est pas obligatoire
    this.userForm.get('role')?.clearValidators();
    this.userForm.get('role')?.updateValueAndValidity();
    
    if (this.userToEdit) {
      this.populateFormForEdit();
    }
  } else {
    // En mode création, s'assurer que le rôle est obligatoire
    this.userForm.get('role')?.setValidators([Validators.required]);
    this.userForm.get('role')?.updateValueAndValidity();
  }
}

 private populateFormForEdit(): void {
  if (this.userToEdit) {
    console.log('Utilisateur à éditer:', this.userToEdit);
    
    // Récupérer le premier rôle valide
    let userRole = '';
    if (this.userToEdit.roles && this.userToEdit.roles.length > 0) {
      userRole = this.userToEdit.roles[0];
    }
    
    this.userForm.patchValue({
      username: this.userToEdit.username || '',
      email: this.userToEdit.email || '',
      prenom: this.userToEdit.prenom || '',
      nom: this.userToEdit.nom || '',
      telephone: this.userToEdit.telephone || '',
      codeDeclarant: this.userToEdit.codeDeclarant || '',
      role: userRole,
      password: '' // Laisser vide par défaut
    });
    
    // Mettre à jour l'objet Utilisateur
    this.Utilisateur = { ...this.userToEdit };
    
    // Forcer la mise à jour des validateurs après un court délai
    setTimeout(() => {
      this.displayDeclarant();
      this.userForm.updateValueAndValidity();
    }, 50);
  }
}
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  // NOUVELLE MÉTHODE À AJOUTER
onSubmitEdit(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }
  
  this.submitting = true;
  this.errorMessage = null;
  
  // Préparer les données pour la modification
  const updatedUser = new Utilisateur();
  updatedUser.username = this.userForm.get('username')!.value;
  updatedUser.email = this.userForm.get('email')!.value;
  updatedUser.prenom = this.userForm.get('prenom')!.value;
  updatedUser.nom = this.userForm.get('nom')!.value;
  updatedUser.telephone = this.userForm.get('telephone')!.value;
  updatedUser.codeDeclarant = this.userForm.get('codeDeclarant')!.value;
  
  // Ajouter le mot de passe si fourni
  const newPassword = this.userForm.get('password')!.value;
  if (newPassword && newPassword.trim()) {
    updatedUser.password = newPassword;
  }
  
  // CORRECTION : Validation du rôle
  let role = this.userForm.get('role')!.value;
  if (!role || role.trim() === '') {
    this.errorMessage = 'Le rôle est obligatoire';
    this.submitting = false;
    return;
  }
  
  updatedUser.roles = [role.trim()]; // S'assurer qu'il n'y a pas d'espaces
  
  // Conserver les propriétés existantes
  updatedUser.enabled = this.userToEdit?.enabled ?? true;
  updatedUser.nonExpired = this.userToEdit?.nonExpired ?? true;
  updatedUser.nonLocked = this.userToEdit?.nonLocked ?? true;
  updatedUser.photoUrl = this.userToEdit?.photoUrl ?? "N/A";
  
  if (role === 'Declarant') {
    updatedUser.declarantDto.codeDeclarant = this.userForm.get('codeDeclarant')!.value;
  }
  
  console.log('Données pour modification:', updatedUser);
  
  this.userService.update(this.userToEdit!.uuid, updatedUser).subscribe(
    () => {
      this.submitting = false;
      this.activeModal.dismissAll();
    },
    (error: any) => {
      this.submitting = false;
      this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la modification de l\'Utilisateur';
      console.error('Erreur lors de la modification de l\'Utilisateur', error);
    }
  );
}  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    this.errorMessage = null;
    
    const formData = new Utilisateur();
    
    // Ajouter les champs du formulaire
    // formData.append('username', this.userForm.get('username')!.value);
    // formData.append('email', this.userForm.get('email')!.value);
    // formData.append('firstName', this.userForm.get('firstName')!.value);
    // formData.append('lastName', this.userForm.get('lastName')!.value);
    
    // Ajouter la photo si présente
    // if (this.selectedFile) {
    //   formData.append('photo', this.selectedFile, this.selectedFile.name);
    // }

    this.Utilisateur.username = this.userForm.get('username')!.value;
    this.Utilisateur.email = this.userForm.get('email')!.value;
    this.Utilisateur.prenom = this.userForm.get('prenom')!.value;
    this.Utilisateur.nom = this.userForm.get('nom')!.value;
    this.Utilisateur.telephone = this.userForm.get('telephone')!.value;
    this.Utilisateur.codeDeclarant = this.userForm.get('codeDeclarant')!.value;
    let role  =this.userForm.get('role')!.value;
    this.Utilisateur.roles.push(role)
    this.Utilisateur.enabled = true;
    this.Utilisateur.nonExpired = true;
    this.Utilisateur.nonLocked = true;
    this.Utilisateur.declarantDto.codeDeclarant = this.userForm.get('codeDeclarant')!.value;
    console.log(role);
    this.Utilisateur.photoUrl = "N/A";
    
    console.log(this.Utilisateur)
    this.userService.addUser(this.Utilisateur).subscribe(
      () => {
        this.submitting = false;
        this.activeModal.dismissAll()
      },
      (error: any) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la création de l\'Utilisateur';
        console.error('Erreur lors de l\'ajout de l\'Utilisateur', error);
      }
    );
  }



  displayDeclarant(): boolean {
  const roleValue = this.userForm.get('role')?.value;
  const isDeclarant = roleValue === 'Declarant';
  
  // Ajouter ou supprimer la validation du codeDeclarant selon le rôle
  const codeDeclarantControl = this.userForm.get('codeDeclarant');
  if (isDeclarant) {
    codeDeclarantControl?.setValidators([Validators.required]);
  } else {
    codeDeclarantControl?.clearValidators();
    codeDeclarantControl?.setValue(''); // Vider le champ si pas déclarant
  }
  codeDeclarantControl?.updateValueAndValidity();
  
  return isDeclarant;
}
  // Validateur personnalisé pour accepter seulement les lettres
  lettersOnlyValidator(control: AbstractControl): {[key: string]: any} | null {
    const lettersPattern = /^[a-zA-ZÀ-ÿ\s]*$/; // Inclut les accents et espaces
    if (control.value && !lettersPattern.test(control.value)) {
      return { 'lettersOnly': true };
    }
    return null;
  }

  // Méthode pour empêcher la saisie de caractères non autorisés
  onKeyPress(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.which);
    const lettersPattern = /^[a-zA-ZÀ-ÿ\s]$/;
    
    if (!lettersPattern.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  // Limiter la longueur pendant la saisie
  onInput(event: any): void {
    const maxLength = 100;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
      this.userForm.get('prenom')?.setValue(event.target.value);
      this.userForm.get('nom')?.setValue(event.target.value);
    }
  }


  // Méthode pour ne permettre que les chiffres
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Permettre les touches de contrôle (backspace, delete, tab, etc.)
    if (charCode === 8 || charCode === 9 || charCode === 46 || 
        charCode === 37 || charCode === 39 || charCode === 35 || charCode === 36) {
      return true;
    }
    
    // Vérifier si c'est un chiffre (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    
    // Vérifier la longueur maximale
    const input = event.target as HTMLInputElement;
 
     // return false;
    
    
    return true;
  }

  // Méthode pour gérer le collage
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text') || '';
    
    // Vérifier si le texte collé contient seulement des chiffres
    if (!/^\d+$/.test(clipboardData)) {
      event.preventDefault();
      return;
    }
    
    // Vérifier la longueur
   
     // event.preventDefault();
      return;
   // }
  }


  close(){
    this.activeModal.dismissAll();
  }

  
}









