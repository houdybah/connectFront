import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import {BonSortie} from "../../../../models/BonSortie";
import {Declaration} from "../../../../models/Declaration";
import {BonSortie_1} from "../../../../models/BonSortie_1";
import {DetailBonSortie_1} from "../../../../models/DetailBonSortie_1";
import {Declaration_1} from "../../../../models/Declaration_1";
import {Utilisateur} from "../../../../models/Utilisateur";
import {DetailBonSortie} from "../../../../models/DetailBonSortie";
import {ScheduleService} from "../../../../services/schedule.service";
import {DeclarationService} from "../../../../services/declaration.service";
import {UtilisateurService} from "../../../../services/utilisateur.service";

@Component({
  selector: 'app-Declaration-form',
  templateUrl: './Declaration-form.component.html',
  styleUrl: './Declaration-form.component.scss',
  providers: [DatePipe]
})
export class DeclarationFormComponent {
 BonSortie = new BonSortie();
 bonSortie_1 = new BonSortie_1();
 detailBonSortie_1 = new DetailBonSortie_1();
  declarationForm: FormGroup;
  declaration_1 = new Declaration_1();
  utilisateur = new Utilisateur();
  detailBonSorties: DetailBonSortie[] = [];

  offices = ["GNB01","GNB02","GNB03","GNB04","GNB05","GNB06","GNB07","GNB08",
    "GNB09","GNB10","GNB11","GNB12","GNB13","GNB14","GNB15","GNB16","GNB17",
    "GNB18","GNB19","GNB20","GNB21","GNB22","GNB43","GNB48","GNB49"];


  options = [
    { value: '', label: '' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
  value:any;
  parentProperty: any;
  bonSorties: BonSortie[]= [];

  // Etat de chargement pour la liquidation
  isLoadingLiquidation: boolean = false;
  private liquidationPendingRequests: number = 0;

  // Etat de soumission pour empêcher le double-clic et afficher un spinner
  isSubmitting: boolean = false;
  get canValidate(): boolean { return this.detailBonSorties && this.detailBonSorties.length > 0; }

  // États des étapes de validation
  step1Completed: boolean = false; // Année + Bureau validés
  step2Completed: boolean = false; // Liquidation chargée
  step3Completed: boolean = false; // Bon de sortie sélectionné
  step4Completed: boolean = false; // Conteneurs chargés
  isLoadingContainers: boolean = false;

  constructor(private fb: FormBuilder,private ScheduleService: ScheduleService,private DeclarationService:DeclarationService,private router:Router, private modalService: NgbModal,private utilisateurService:UtilisateurService,private datePipe: DatePipe) {
    this.declarationForm = this.fb.group({
      codeDeclarant: [{value: '', disabled: true}, Validators.required],
      codeNif: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      libelleDeclarant: [{value: '', disabled: true}, Validators.required],
      anneeDeclaration: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      codeBureau: ['', Validators.required],
      numeroBl: ['', Validators.required],
      bureau: [{value: '', disabled: true}, Validators.required],
      reference: [{value: '', disabled: true}, Validators.required],
      montantLiquidation: [{value: '', disabled: true}, [Validators.required, Validators.min(0)]],
      numeroQuittance: [{value: '', disabled: true}, Validators.required,],
      statusSortie: [{value: '', disabled: true}, Validators.required],
      numeroBonSortie: ['',Validators.required],
      dateEmission: [{ value: '2025-02-05', disabled: true }]
    });

    // this.ScheduleService.getBonSortie(reference).subscribe(res => {
    //   this.BonSortie = res
    // })
  }
  ngOnInit(): void {
    //this.getDeclarationEnMemory();
    this.getLogin()
  }


  getLogin(){
    this.utilisateurService.currentLogin().subscribe(res => {
      this.utilisateur = res
    })
  }

  /**
   * Gestion du changement d'année
   */
  onAnneeChange(): void {
    const annee = this.declarationForm.get('anneeDeclaration')?.value;
    if (annee && annee.toString().length === 4) {
      // Réinitialiser les étapes suivantes
      this.resetStepsFrom(2);
    }
  }

  /**
   * Gestion du changement de bureau
   */
  onBureauChange(): void {
    const bureau = this.declarationForm.get('codeBureau')?.value;
    if (bureau) {
      // Réinitialiser les étapes suivantes
      this.resetStepsFrom(2);
    }
  }


  onNumeroBlChange(): void {
    const numeroBl = this.declarationForm.get('numeroBl')?.value;
    if (numeroBl) {
      // Réinitialiser les étapes suivantes
      this.resetStepsFrom(2);
    }
  }

  /**
   * Validation des paramètres (année + bureau)
   */
  validateParameters(): void {
    const annee = this.declarationForm.get('anneeDeclaration')?.value;
    const bureau = this.declarationForm.get('codeBureau')?.value;
    const numeroBl = this.declarationForm.get('numeroBl')?.value;
    if (annee && bureau && numeroBl) {
      this.step1Completed = true;
      // Activer le champ liquidation
      //this.declarationForm.get('numeroBl')?.enable();
      
      this.getDeclaration()
    }
  }

  /**
   * Réinitialiser les étapes à partir d'un certain niveau
   */
  private resetStepsFrom(step: number): void {
    if (step <= 1) this.step1Completed = false;
    if (step <= 2) {
      this.step2Completed = false;
    }
    if (step <= 3) {
      this.step3Completed = false;
      this.declarationForm.patchValue({ numeroBonSortie: '' });
      this.bonSorties = [];
    }
    if (step <= 4) {
      this.step4Completed = false;
      this.detailBonSorties = [];
      this.bonSortie_1.detailBonSortieSidonyaDtos = [];
    }
  }

  /**
   * TrackBy function pour les conteneurs
   */
  trackByContainer(index: number, Container: any): string {
    return Container.numeroConteneur || index.toString();
  }

  // Gestion du clic sur le bouton de validation
  onValidateClick(): void {
    if (!this.canValidate) {
      Swal.fire({
        icon: 'info',
        title: 'Informations incomplètes',
        text: 'Veuillez d\'abord sélectionner un bon de sortie pour charger les conteneurs.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.onSubmit();
  }

  onSubmit() {
    if (this.declarationForm.valid) {
      this.procederEnregistrement();
    } else {
      this.afficherErreurFormulaire();
      this.isSubmitting = false;
    }
  }
  procederEnregistrement(): void {
   this.declaration_1.annee = this.declarationForm.value.anneeDeclaration;
      this.declaration_1.numbl = this.declarationForm.value.numeroBl;
      this.declaration_1.codeOffice = this.declarationForm.value.codeBureau
      // this.declaration_1.bonSortieSydoniaDto.dateEmission = this.bonSortie_1.dateEmission
       this.declaration_1.bonSortieSydoniaDto.dateSortie = this.declarationForm.value.dateEmission
       this.declaration_1.bonSortieSydoniaDto.refbonsortie = this.declarationForm.value.numeroBonSortie
   
       this.declaration_1.bonSortieSydoniaDto.detailBonSortieSidonyaDtos = this.bonSortie_1.detailBonSortieSidonyaDtos;
      console.log('Formulaire soumis :', this.declaration_1);

     
    
    console.log('Formulaire soumis :', this.declaration_1);

    // Afficher un loader pendant l'enregistrement
    Swal.fire({
      title: 'Enregistrement en cours...',
      html: 'Veuillez patienter',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.DeclarationService.createDeclaration(this.declaration_1)
      .pipe(finalize(() => { this.isSubmitting = false; }))
      .subscribe({
     
      next: (res) => {
        console.log('Formulaire soumis :', this.declaration_1);
        Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'La déclaration a été enregistrée avec succès',
          confirmButtonColor: '#28a745',
          timer: 2000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        }).then(() => {
          this.removeItem('reference');
          this.removeItem('anneeDeclaration');
          this.removeItem('codeBureau');
          this.removeItem('numeroBl');
          this.router.navigate(['/douane/segment-general']);
        });
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
        
        // Analyser le message d'erreur du backend
        const errorMessage = error.error?.message || error.error || error.message || '';
        const statusCode = error.status;
        
        // Gérer l'erreur de doublon (DuplicateResourceException)
        if (statusCode === 409 || errorMessage.includes('déjà utilisé')) {
          // Parser le message pour extraire les détails
          let titre = 'Doublon détecté !';
          let icone = 'error';
          let detailsHtml = '';
          
          // Extraire les informations du message d'erreur
          const matchBonSortie = errorMessage.match(/Le bon de sortie '(.+?)' est déjà utilisé/);
          const matchDeclaration = errorMessage.match(/déclaration '(.+?)'/);
          const matchDeclarant = errorMessage.match(/Déclarant: (.+?)\)/);
          
          if (matchBonSortie) {
            detailsHtml = `
              <div class="text-center">
                <div class="mb-3">
                  <i class="ri-file-copy-line text-danger" style="font-size: 4rem;"></i>
                </div>
                <div class="alert alert-danger">
                  <h5 class="mb-3">Bon de sortie déjà utilisé</h5>
                  <p class="mb-2"><strong>Numéro:</strong> ${matchBonSortie[1]}</p>
                  ${matchDeclaration ? `<p class="mb-2"><strong>Déclaration existante:</strong> ${matchDeclaration[1]}</p>` : ''}
                  ${matchDeclarant ? `<p class="mb-0"><strong>Déclarant:</strong> ${matchDeclarant[1]}</p>` : ''}
                </div>
                <p class="mt-3 text-muted">Veuillez sélectionner un autre bon de sortie pour cette déclaration.</p>
              </div>
            `;
          } else {
            // Message générique si le format n'est pas reconnu
            detailsHtml = `
              <div class="text-center">
                <div class="mb-3">
                  <i class="ri-error-warning-line text-danger" style="font-size: 4rem;"></i>
                </div>
                <p>${errorMessage}</p>
              </div>
            `;
          }
          
          Swal.fire({
            icon: icone as any,
            title: titre,
            html: detailsHtml,
            confirmButtonText: 'Compris',
            confirmButtonColor: '#dc3545',
            width: '600px',
            showClass: {
              popup: 'animate__animated animate__shakeX'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          }).then(() => {
            // Réinitialiser le champ bon de sortie
            this.declarationForm.patchValue({
              numeroBonSortie: '',
              dateEmission: ''
            });
            this.detailBonSorties = [];
            this.bonSortie_1.detailBonSortieSidonyaDtos = [];
          });
        }
        // Gérer l'erreur si le bon de sortie n'existe pas (ResourceNotFoundException)
        else if (statusCode === 404 || errorMessage.includes('n\'existe pas')) {
          const matchBonSortie = errorMessage.match(/bon de sortie '(.+?)'/);
          
          Swal.fire({
            icon: 'warning',
            title: 'Bon de sortie introuvable',
            html: `
              <div class="text-center">
                <div class="mb-3">
                  <i class="ri-search-eye-line text-warning" style="font-size: 4rem;"></i>
                </div>
                <div class="alert alert-warning">
                  ${matchBonSortie ? `<p class="mb-0">Le bon de sortie <strong>${matchBonSortie[1]}</strong> n'existe pas dans Sydonia.</p>` : `<p class="mb-0">${errorMessage}</p>`}
                </div>
                <p class="mt-3 text-muted">Veuillez vérifier le numéro ou contacter l'administrateur.</p>
              </div>
            `,
            confirmButtonColor: '#ffc107',
            confirmButtonText: 'D\'accord'
          });
        }
        // Gérer les erreurs de validation
        else if (statusCode === 400 || errorMessage.includes('validation')) {
          Swal.fire({
            icon: 'warning',
            title: 'Erreur de validation',
            html: `
              <div class="text-center">
                <div class="mb-3">
                  <i class="ri-alert-line text-warning" style="font-size: 4rem;"></i>
                </div>
                <p>${errorMessage}</p>
              </div>
            `,
            confirmButtonColor: '#ffc107'
          });
        }
        // Gérer les erreurs d'autorisation
        else if (statusCode === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Accès refusé',
            text: 'Vous n\'avez pas les droits nécessaires pour effectuer cette opération.',
            confirmButtonColor: '#dc3545'
          });
        }
        // Gérer les erreurs serveur
        else if (statusCode >= 500) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur serveur',
            html: `
              <div class="text-center">
                <div class="mb-3">
                  <i class="ri-server-line text-danger" style="font-size: 4rem;"></i>
                </div>
                <p>Une erreur technique est survenue. Veuillez réessayer plus tard.</p>
                <small class="text-muted">Code erreur: ${statusCode}</small>
              </div>
            `,
            confirmButtonColor: '#dc3545'
          });
        }
        // Erreur générique
        else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage || 'Une erreur inattendue est survenue lors de l\'enregistrement.',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    });
  }
  afficherErreurFormulaire(): void {
    const champsInvalides: string[] = [];
    Object.keys(this.declarationForm.controls).forEach(key => {
      const control = this.declarationForm.get(key);
      if (control && control.errors && control.enabled) {
        champsInvalides.push(this.obtenirNomChamp(key));
      }
    });

    Swal.fire({
      icon: 'warning',
      title: 'Formulaire incomplet',
      html: `
        <p>Veuillez remplir les champs obligatoires suivants :</p>
        <ul class="text-start">
          ${champsInvalides.map(champ => `<li>${champ}</li>`).join('')}
        </ul>
      `,
      confirmButtonColor: '#ffc107',
      confirmButtonText: 'Compris'
    });
  }
  // ✅ NOUVEAU: Méthode helper pour obtenir les noms de champs lisibles
  obtenirNomChamp(key: string): string {
    const noms: { [key: string]: string } = {
      'anneeDeclaration': 'Année de déclaration',
      'codeBureau': 'Code bureau',
      'numeroBl': 'Numéro BL',
      'numeroBonSortie': 'Numéro bon de sortie',
      'codeDeclarant': 'Code déclarant',
      'codeNif': 'Code NIF',
      'reference': 'Référence',
      'montantLiquidation': 'Montant liquidation',
      'numeroQuittance': 'Numéro quittance'
    };
    return noms[key] || key;
  }


  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false; // Bloque les caractères non numériques
    }
    return true; // Autorise les caractères numériques
  }


  // ✅ MODIFIÉ: Simplifié - plus de vérification de doublon côté frontend
  getDeclaration(){
    this.removeItem('reference');
    let reference = this.declarationForm.value.anneeDeclaration+this.declarationForm.value.codeBureau+"L"+this.declarationForm.value.numeroBl;
    
    sessionStorage.setItem('reference', JSON.stringify(reference)); 
    sessionStorage.setItem('anneeDeclaration', JSON.stringify(this.declarationForm.value.anneeDeclaration)); 
    sessionStorage.setItem('codeBureau', JSON.stringify(this.declarationForm.value.codeBureau)); 
    sessionStorage.setItem('numeroBl', JSON.stringify(this.declarationForm.value.numeroBl)); 
    
    let ref = sessionStorage.getItem('reference');
    console.log(ref)
    this.getLogin();

    // Démarrer l'indicateur de chargement pour la liquidation
    this.isLoadingLiquidation = true;
    this.liquidationPendingRequests = 0;
    
    if (ref) {
      const value = JSON.parse(ref);
      console.log(value);
      
      this.liquidationPendingRequests++;
      this.ScheduleService.getDeclaration(value)
        .pipe(finalize(() => {
          this.liquidationPendingRequests--;
          if (this.liquidationPendingRequests === 0) this.isLoadingLiquidation = false;
        }))
        .subscribe(res => {
        console.log(res)
        
        if(this.utilisateur.codeDeclarant == res.codeDeclarant){
          this.Declaration(res)
          
          this.declarationForm.patchValue({
            codeDeclarant: res.codeDeclarant,
            codeNif: res.codeEntreprise,
            libelleDeclarant: res.office,
            bureau: res.codeOffice,
            reference: res.refLiquidation,
            montantLiquidation: res.montant,
            numeroQuittance: res.numeroQuittance,
            statusSortie: ''
          })
          
          // Marquer l'étape 2 comme complétée
          this.step2Completed = true;
        } else {
          this.declarationForm.patchValue({
            codeDeclarant: '',
            codeNif: '',
            libelleDeclarant: '',
            bureau: '',
            reference: '',
            montantLiquidation: '',
            numeroQuittance: '',
            statusSortie: ''
          })

          Swal.fire({
            icon: 'error',
            title: 'Accès refusé !',
            text: 'Vous n\'êtes pas autorisé à accéder à cette déclaration',
            confirmButtonColor: '#dc3545',
            timer: 5000,
            timerProgressBar: true
          }).then(() => {
            this.removeItem('reference')
            this.router.navigate(['/douane/segment-general-form'])
          })
        }  
      })

      this.liquidationPendingRequests++;
      this.ScheduleService.getBonSortie(value)
        .pipe(finalize(() => {
          this.liquidationPendingRequests--;
          if (this.liquidationPendingRequests === 0) this.isLoadingLiquidation = false;
        }))
        .subscribe(res => {
        console.log(res)
        this.bonSorties = res;
      })
    }
  }

  getDeclarationEnMemory(){
    let ref = sessionStorage.getItem('reference');
   console.log(ref)

   if (ref) {
     const value = JSON.parse(ref);
     console.log(value);
      this.ScheduleService.getDeclaration(value).subscribe(res => {

      this.Declaration(res);
     // console.log(res)
      this.declarationForm.patchValue({
        codeDeclarant: res.codeDeclarant,
        codeNif: res.codeEntreprise,
        libelleDeclarant: res.office,
        bureau: res.codeOffice,
        reference: res.refLiquidation,
        montantLiquidation: res.montant,
        numeroQuittance: res.numeroQuittance,
        numeroBonSortie: [{ value: 'BS2024001', disabled: true }],
        dateEmission: [{ value: '2025-02-05', disabled: true }],
        statusSortie: ''
      })
     })
     
     this.ScheduleService.getBonSortie(value).subscribe(res => {
      console.log(res)
      this.bonSorties = res;
    })

   }
  }


  Declaration(res:Declaration){
    console.log(res)
    this.declaration_1.quitance = res.numeroQuittance;
    this.declaration_1.refDeclarant = res.refLiquidation;
    this.declaration_1.montant = res.montant;
    this.declaration_1.office = res.office;
    this.declaration_1.codeOffice = res.codeOffice;
    this.declaration_1.dateLiquidation = res.dateLiquidation;
    this.declaration_1.dateQuittance = res.dateQuittance;

  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }


 
  formatDateForDateInput(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      // Check if it's a valid date
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      // Add leading zero if month/day is single digit
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }




  openModalContainer(content:any){
    // this.ScheduleService.getDetailBonSortie(this.declaration_1.refDeclarant).subscribe(res => {
     
    //   res.map(detail => {
    //     this.detailBonSortie_1.numConteneur = detail.numeroConteneur;
    //     this.detailBonSortie_1.poidNet = detail.poids;
    //    // this.detailBonSortie_1.refBonsortie = this.bonSortie_1.numeroBon;
    //     this.detailBonSortie_1.typecolis = detail.typeColis;
    //     this.detailBonSortie_1.nombreColis = detail.nbreColis;
    //     this.detailBonSortie_1.naturecolis = detail.natureColis;
    //     this.detailBonSortie_1.refmanifeste = detail.refManifest;
    //     this.detailBonSortie_1.titreTransport = detail.titre;
    //     this.detailBonSortie_1.mark_1 = detail.mark_1;
    //     this.detailBonSortie_1.mark_2 = detail.mark_2;
    //     this.bonSortie_1.detailBonSortieSidonyaDtos.push(this.detailBonSortie_1);
    //     this.detailBonSortie_1 = new DetailBonSortie_1();
    //   })

    //   console.log(this.bonSortie_1)
    // })
    console.log(this.declaration_1)
    this.parentProperty = this.bonSortie_1;
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }


 getDetailBonSortie(numeroBon:String){
    console.log(this.declarationForm.controls['reference'].value)
    
    // Marquer l'étape 3 comme complétée
    this.step3Completed = true;
    
    // Démarrer le chargement des conteneurs
    this.isLoadingContainers = true;
    this.step4Completed = false;
    
    setTimeout(() => {
      this.ScheduleService.getBonSortie(this.declarationForm.controls['reference'].value).subscribe(res => {

        res.map(bon => {
          if(bon.numeroBonSortie == numeroBon){
            this.declarationForm.patchValue({
              dateEmission: this.formatDate(bon.dateSortie)
            })
          }
        })
    
        this.ScheduleService.getDetailBonSortie(this.declarationForm.controls['reference'].value,numeroBon).subscribe(res => {
          this.detailBonSorties = res;
          
          // Réinitialiser la liste des détails
          this.bonSortie_1.detailBonSortieSidonyaDtos = [];
          
          if(res && res.length > 0){
            res.map((detail: any) => {
              const newDetail = new DetailBonSortie_1();
              newDetail.numConteneur = detail.numeroConteneur;
              newDetail.titreTransport = detail.titre;
              newDetail.typeConteneur = detail.type || detail.typeColis;
              this.bonSortie_1.detailBonSortieSidonyaDtos.push(newDetail);
            })
            
            // Marquer l'étape 4 comme complétée
            this.step4Completed = true;
          } else {
            this.step4Completed = false;
          }

          // Arrêter le chargement
          this.isLoadingContainers = false;
          console.log(this.bonSortie_1.detailBonSortieSidonyaDtos)
        }, error => {
          this.isLoadingContainers = false;
          this.step4Completed = false;
          console.error('Erreur lors du chargement des conteneurs:', error);
        })

       
           // console.log(this.formatDate(.dateSortie))
        })
        console.log(numeroBon)
    },500)
  }

  formatDate(date: string): any {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}







