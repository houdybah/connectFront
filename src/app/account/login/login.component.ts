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
import { jwtDecode } from "jwt-decode";
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
    this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe(
     (data:any) => {
     if(data.token != null){
       sessionStorage.setItem('toast', 'true');
       const decodedHeader = jwtDecode(data.token);
      // console.log(decodedHeader)
       sessionStorage.setItem('currentUser', JSON.stringify(decodedHeader.sub));
       //this.tokenStorageService.saveRole(decodedHeader.aud);
       sessionStorage.setItem('token', data.token);
       this.router.navigate(['']);
     } else {
       this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
     }
    },
    (error: any) => {
       this.router.navigate(['']);
         if(error ==="Login failed"){
           this.messageError="username ou mot de passe incorrect";
         }
    });
  }

 /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
   this.fieldTextType = !this.fieldTextType;
 }

}
