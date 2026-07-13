import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

 // Login Form
 loginForm!: UntypedFormGroup;
 submitted = false;
 fieldTextType!: boolean;
 error = '';
 returnUrl!: string;

 toast!: false;

 // set the current year
 year: number = new Date().getFullYear();
 messageError: string = "";

 constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService,private router: Router,
   private authFackservice: AuthfakeauthenticationService, private route: ActivatedRoute, public toastService: ToastService,
   private store: Store,private tokenStorageService: TokenStorageService) {
     // redirect to home if already logged in
     if (this.authenticationService.currentUserValue) {
       this.router.navigate(['/']);
     }
    }

 ngOnInit(): void {
   if(sessionStorage.getItem('currentUser')) {
     this.router.navigate(['/']);
   }
    this.loginForm = this.formBuilder.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required]],
   });
 }

 // convenience getter for easy access to form fields
 get f() { return this.loginForm.controls; }

 /**
  * Form submit
  */
  onSubmit() {
    this.submitted = true;
    this.messageError = ''; // Réinitialiser le message d'erreur
    
    this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe(
     async (data:any) => {
     if(data.token != null){
       sessionStorage.setItem('toast', 'true');

       // Sauvegarde du token (chiffré côté serveur) de manière cryptée dans sessionStorage 'dConnect'
       this.tokenStorageService.saveToken(data.token);

       // Le token est chiffré (AES-256-GCM) : il faut le déchiffrer avant de pouvoir lire ses claims
       const claims = await this.tokenStorageService.getDecryptedClaims();
       sessionStorage.setItem('currentUser', JSON.stringify(claims?.sub));

       // Redirection uniquement en cas de succès
       this.router.navigate(['']);
     } else {
       // Rester sur la page et afficher le message d'erreur
       this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
       this.submitted = false; // Permettre une nouvelle tentative
     }
    },
    (error: any) => {
       // Rester sur la page de login en cas d'erreur
       console.error('Erreur d\'authentification:', error);
       if(error === "Login failed"){
         this.messageError = "Nom d'utilisateur ou mot de passe incorrect";
       } else {
         this.messageError = "Erreur lors de la connexion. Veuillez réessayer.";
       }
       this.submitted = false; // Permettre une nouvelle tentative
    });
  }

 /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
   this.fieldTextType = !this.fieldTextType;
 }

}
