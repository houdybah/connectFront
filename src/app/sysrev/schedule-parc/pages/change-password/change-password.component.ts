// change-password.component.ts
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import {UtilisateurService} from "../../../services/utilisateur.service";
import {ToastService} from "../../../../account/login/toast-service";

@Component({
  selector: 'app-change-password',
  template: ` `,
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: UntypedFormGroup;
  submitted = false;
  isLoading = false;
  message = '';
  type = 'danger';
  showSuccessModal = false;
  countdown = 3;
  
  // Visibilité des mots de passe
  fieldTextTypeOld = false;
  fieldTextTypeNew = false;
  fieldTextTypeConfirm = false;

  private currentUserUuid: string | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private utilisateurService: UtilisateurService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCurrentUserUuid();
  }

  private initializeForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  // Récupérer l'UUID de l'utilisateur actuel
  private getCurrentUserUuid() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const email = JSON.parse(currentUser);
      
      // Utiliser votre service existant
      this.utilisateurService.getEmailOrPhone(email).subscribe({
        next: (user: any) => {
          this.currentUserUuid = user.uuid;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          this.message = 'Erreur lors du chargement des informations utilisateur';
          this.type = 'danger';
        }
      });
    }
  }

  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.changePasswordForm.valid && this.currentUserUuid && this.isFormValid()) {
      this.isLoading = true;
      this.message = '';

      const params = new HttpParams()
        .set('oldPassword', this.f['oldPassword'].value)
        .set('newPassword', this.f['newPassword'].value);

      // Appel direct à votre API existante
      this.http.put(`/api/utilisateurs/${this.currentUserUuid}/password`, params).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessAndRedirect();
        },
        error: (error) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    }
  }

  private handleError(error: any) {
    console.error('Erreur:', error);
    
    if (error.status === 400) {
      this.message = 'Mot de passe actuel incorrect';
    } else if (error.status === 422) {
      this.message = 'Le nouveau mot de passe ne respecte pas les critères de sécurité';
    } else {
      this.message = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
    }
    
    this.type = 'danger';
    
    // Aussi afficher un toast
    this.toastService.show(this.message, { classname: 'bg-danger text-white', delay: 5000 });
  }

  private showSuccessAndRedirect() {
    this.showSuccessModal = true;
    this.startCountdown();
    
    // Supprimer le flag de changement de mot de passe obligatoire
    sessionStorage.removeItem('requirePasswordChange');
    
    // Toast de succès
    this.toastService.show('Mot de passe modifié avec succès!', { classname: 'bg-success text-white', delay: 3000 });
  }

  private startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.redirectToDashboard();
      }
    }, 1000);
  }

  redirectNow() {
    this.redirectToDashboard();
  }

  private redirectToDashboard() {
    this.showSuccessModal = false;
    
    // Redirection selon le rôle (comme dans votre login)
    const role = this.tokenStorageService.getRole();
    
    if (role === "Declarant") {
      this.router.navigate(['/SysrevDashboard-dg']);
    } else if (role === "DG") {
      this.router.navigate(['/SysrevDashboard-dg']);
    } else if (role === "DOUANE") {
      this.router.navigate(['/douane/scanner']);
    } else if (role === "ADMIN") {
      this.router.navigate(['/douane/utilisateur']);
    } else {
      this.router.navigate(['/SysrevDashboard']);
    }
  }

  toggleFieldTextType(field: string) {
    switch (field) {
      case 'old':
        this.fieldTextTypeOld = !this.fieldTextTypeOld;
        break;
      case 'new':
        this.fieldTextTypeNew = !this.fieldTextTypeNew;
        break;
      case 'confirm':
        this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm;
        break;
    }
  }

  onPasswordChange() {
    // Déclencher la validation en temps réel
    this.f['newPassword'].markAsTouched();
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return this.changePasswordForm.valid && 
           !this.passwordMismatch() && 
           this.isPasswordStrong();
  }

  passwordMismatch(): boolean {
    const newPassword = this.f['newPassword'].value;
    const confirmPassword = this.f['confirmPassword'].value;
    return newPassword !== confirmPassword && confirmPassword !== '';
  }

  // Validation de la force du mot de passe
  getPasswordStrength(): number {
    const password = this.f['newPassword'].value || '';
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'Faible';
    if (strength <= 60) return 'Moyen';
    if (strength <= 80) return 'Fort';
    return 'Très fort';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'bg-danger';
    if (strength <= 60) return 'bg-warning';
    if (strength <= 80) return 'bg-info';
    return 'bg-success';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'text-danger';
    if (strength <= 60) return 'text-warning';
    if (strength <= 80) return 'text-info';
    return 'text-success';
  }

  isPasswordStrong(): boolean {
    return this.getPasswordStrength() >= 80;
  }

  // Vérifications individuelles des critères
  hasMinLength(): boolean {
    const password = this.f['newPassword'].value || '';
    return password.length >= 8;
  }

  hasUpperCase(): boolean {
    const password = this.f['newPassword'].value || '';
    return /[A-Z]/.test(password);
  }

  hasLowerCase(): boolean {
    const password = this.f['newPassword'].value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.f['newPassword'].value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.f['newPassword'].value || '';
    return /[@$!%*?&]/.test(password);
  }
}





