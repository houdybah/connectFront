import { Component, ElementRef, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { SignatureService, SignatureHistory } from '../../services/signature.service';
import { Signature } from '../../models/signature';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('testSignatureModal') testSignatureModal!: TemplateRef<any>;
  @ViewChild('testResultModal') testResultModal!: TemplateRef<any>;
  @ViewChild('validationModal') validationModal!: TemplateRef<any>;
  @ViewChild('previewModal') previewModal!: TemplateRef<any>;
  
  // États du composant
  isLoading: boolean = false;
  isAdmin: boolean = false;
  formSubmitted: boolean = false;
  isEditMode: boolean = false;
  showPreview: boolean = false;
  showHelp: boolean = false;
  showAdvancedFilters: boolean = false;
  
  // Messages
  errorMessage: string = '';
  successMessage: string = '';
  
  // Formulaires
  signatureForm: FormGroup;
  testForm: FormGroup;
  validationForm: FormGroup;
  filterForm: FormGroup;
  
  // Données
  signatures: Signature[] = [];
  filteredSignatures: Signature[] = [];
  selectedSignature: Signature | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  selectedImageUrl: string | null = null;
  testResult: any = null;
  validationResult: boolean | null = null;
  
  // Pour le stockage des abonnements
  private subscriptions: Subscription[] = [];
  
  // Bureaux de douane (à remplacer par votre liste réelle)
  bureaux: {code: string, nom: string}[] = [
    { code: 'GNB02', nom: 'Conakry Port' },
    { code: 'GNB04', nom: 'Hydrocarbure' },
    { code: 'GNB10', nom: 'Bureau-Véhicule' },

  ];
  
  // Filtres avancés
  currentFilterOffice: string = '';
  currentFilterDate: Date | null = null;
  currentSearchTerm: string = '';
  
  constructor(
    private fb: FormBuilder,
    private signatureService: SignatureService,
    private authService: AuthenticationService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.signatureForm = this.initForm();
    this.testForm = this.initTestForm();
    this.validationForm = this.initValidationForm();
    this.filterForm = this.initFilterForm();
  }

  ngOnInit(): void {
    // Vérifier le rôle de l'utilisateur
    const role = sessionStorage.getItem("role");
    this.isAdmin = role?.includes("admin") ?? false;
    
    // Charger les signatures
    this.loadSignatures();
  }

  ngOnDestroy(): void {
    // Nettoyer les abonnements et libérer les ressources
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Révoquer les URLs d'objets pour éviter les fuites de mémoire
    this.revokeAllUrls();
  }

  /**
   * Initialise le formulaire principal
   */
  initForm(): FormGroup {
    return this.fb.group({
      uuid: [''],
      signatoryName: ['', [Validators.required, Validators.minLength(3)]],
      position: ['', [Validators.required]],
      ideCuoCod: ['', [Validators.required]],
      validFrom: [null],
      validTo: [null]
    }, { validators: this.dateRangeValidator });
  }

  /**
   * Initialise le formulaire de test
   */
  initTestForm(): FormGroup {
    return this.fb.group({
      ideCuoCod: ['', [Validators.required]],
      testDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      testType: ['latest', [Validators.required]] // latest, current, priority
    });
  }

  /**
   * Initialise le formulaire de validation
   */
  initValidationForm(): FormGroup {
    return this.fb.group({
      signatureUuid: ['', [Validators.required]],
      validationDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]]
    });
  }

  /**
   * Initialise le formulaire de filtrage
   */
  initFilterForm(): FormGroup {
    return this.fb.group({
      filterOffice: [''],
      filterDate: [null],
      searchTerm: [''],
      showOnlyValid: [false],
      showOnlyExpiring: [false]
    });
  }

  /**
   * Validateur personnalisé pour s'assurer que la date de fin est après la date de début
   */
  dateRangeValidator(group: FormGroup) {
    const start = group.get('validFrom')?.value;
    const end = group.get('validTo')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  // =====================================
  // MÉTHODES POUR LES SIGNATURES VALIDES
  // =====================================

  /**
   * Récupère la signature actuelle valide pour un bureau
   */
  getCurrentValidSignature(customsOfficeCode: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getCurrentValidSignature(customsOfficeCode).subscribe({
      next: (data: SignatureHistory) => {
        this.selectedSignature = Signature.fromSignatureHistory(data);
        this.isLoading = false;
        this.successMessage = `Signature actuelle trouvée pour ${customsOfficeCode}`;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération de la signature actuelle', error);
        this.errorMessage = `Aucune signature actuelle valide trouvée pour ${customsOfficeCode}`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Récupère la dernière signature valide à une date donnée
   */
  getLatestValidSignature(customsOfficeCode: string, date?: Date): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getLatestValidSignature(customsOfficeCode, date).subscribe({
      next: (data: SignatureHistory) => {
        this.selectedSignature = Signature.fromSignatureHistory(data);
        this.isLoading = false;
        this.successMessage = `Dernière signature valide trouvée pour ${customsOfficeCode}`;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération de la dernière signature valide', error);
        this.errorMessage = `Aucune signature valide trouvée pour ${customsOfficeCode}`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Récupère toutes les signatures valides triées
   */
  getAllValidSignaturesSorted(customsOfficeCode: string, date?: Date): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getAllValidSignaturesSorted(customsOfficeCode, date).subscribe({
      next: (data: SignatureHistory[]) => {
        this.signatures = data.map(item => Signature.fromSignatureHistory(item));
        this.applyFilters();
        this.isLoading = false;
        this.successMessage = `${this.signatures.length} signatures valides trouvées pour ${customsOfficeCode}`;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des signatures valides triées', error);
        this.errorMessage = `Erreur lors du chargement des signatures pour ${customsOfficeCode}`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Ouvre la modale de validation de signature
   */
  openValidationModal(): void {
    this.validationForm.reset({
      validationDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
    this.validationResult = null;
    this.modalService.open(this.validationModal, { centered: true });
  }

  /**
   * Valide une signature à une date donnée
   */
  validateSignature(): void {
    if (this.validationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValues = this.validationForm.value;
      const validationDate = new Date(formValues.validationDate);
      
      const sub = this.signatureService.isSignatureValidAtDate(formValues.signatureUuid, validationDate).subscribe({
        next: (isValid: boolean) => {
          this.validationResult = isValid;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de la validation de la signature', error);
          this.errorMessage = "Erreur lors de la validation de la signature.";
          this.isLoading = false;
        }
      });
      
      this.subscriptions.push(sub);
    }
  }

  // =====================================
  // MÉTHODES DE TEST AMÉLIORÉES
  // =====================================

  /**
   * Affiche ou masque la section d'aide
   */
  toggleHelpSection(): void {
    this.showHelp = !this.showHelp;
  }

  /**
   * Affiche ou masque les filtres avancés
   */
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  /**
   * Ouvre la modale de test de sélection de signature
   */
  testSignatureSelection(): void {
    this.testForm.reset({
      testDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      testType: 'latest'
    });
    this.modalService.open(this.testSignatureModal, { centered: true });
  }

  /**
   * Soumet le formulaire de test avec différents types
   */
  submitTestForm(): void {
    if (this.testForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValues = this.testForm.value;
      const testDate = new Date(formValues.testDate);
      const customsOfficeCode = formValues.ideCuoCod;
      const testType = formValues.testType;
      
      let serviceCall;
      
      switch (testType) {
        case 'current':
          serviceCall = this.signatureService.getCurrentValidSignature(customsOfficeCode);
          break;
        case 'priority':
          serviceCall = this.signatureService.getLatestValidSignatureWithPriority(customsOfficeCode, testDate);
          break;
        case 'latest':
        default:
          serviceCall = this.signatureService.getLatestValidSignature(customsOfficeCode, testDate);
          break;
      }
      
      const sub = serviceCall.subscribe({
        next: (result: SignatureHistory) => {
          this.testResult = {
            testType: testType,
            testDate: testDate,
            customsOfficeCode: customsOfficeCode,
            signature: Signature.fromSignatureHistory(result),
            success: true
          };
          this.isLoading = false;
          
          // Fermer la modale de test et ouvrir celle des résultats
          this.modalService.dismissAll();
          this.modalService.open(this.testResultModal, { centered: true, size: 'lg' });
        },
        error: (error: any) => {
          console.error('Erreur lors du test de sélection de signature', error);
          this.testResult = {
            testType: testType,
            testDate: testDate,
            customsOfficeCode: customsOfficeCode,
            signature: null,
            success: false,
            error: error.message || "Aucune signature trouvée"
          };
          this.isLoading = false;
          
          // Ouvrir quand même la modale des résultats pour montrer l'erreur
          this.modalService.dismissAll();
          this.modalService.open(this.testResultModal, { centered: true, size: 'lg' });
        }
      });
      
      this.subscriptions.push(sub);
    }
  }

  // =====================================
  // MÉTHODES DE FILTRAGE AMÉLIORÉES
  // =====================================

  /**
   * Applique les filtres sur les signatures
   */
  applyFilters(): void {
    this.filteredSignatures = [...this.signatures];
    
    const filterValues = this.filterForm.value;
    
    // Filtre par bureau
    if (filterValues.filterOffice) {
      this.filteredSignatures = this.filteredSignatures.filter(sig => 
        sig.customs_office_code === filterValues.filterOffice
      );
    }
    
    // Filtre par terme de recherche
    if (filterValues.searchTerm && filterValues.searchTerm.trim()) {
      const term = filterValues.searchTerm.toLowerCase();
      this.filteredSignatures = this.filteredSignatures.filter(sig => 
        sig.signatory_name.toLowerCase().includes(term) ||
        sig.position.toLowerCase().includes(term) ||
        sig.customs_office_code.toLowerCase().includes(term)
      );
    }
    
    // Filtre par validité à une date
    if (filterValues.filterDate) {
      const filterDate = new Date(filterValues.filterDate);
      this.filteredSignatures = this.filteredSignatures.filter(sig => 
        sig.isValidAtDate(filterDate)
      );
    }
    
    // Filtre : seulement les signatures valides actuellement
    if (filterValues.showOnlyValid) {
      this.filteredSignatures = this.filteredSignatures.filter(sig => 
        sig.isCurrentlyValid()
      );
    }
    
    // Filtre : signatures qui expirent bientôt
    if (filterValues.showOnlyExpiring) {
      this.filteredSignatures = this.filteredSignatures.filter(sig => 
        sig.isExpiringWithin(30) // 30 jours
      );
    }
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.filteredSignatures = [...this.signatures];
  }

  /**
   * Charge les signatures d'un bureau spécifique ou toutes
   */
  loadSignaturesByFilter(): void {
    const filterValues = this.filterForm.value;
    
    if (filterValues.filterOffice) {
      this.loadSignaturesByBureau(filterValues.filterOffice, filterValues.filterDate);
    } else {
      this.loadSignatures();
    }
  }

  // =====================================
  // MÉTHODES EXISTANTES ADAPTÉES AU SERVICE
  // =====================================

  /**
   * Rafraîchit le cache des signatures
   */
  refreshSignatureCache(): void {
    if (!confirm("Voulez-vous rafraîchir le cache des signatures ? Cette opération peut prendre quelques instants.")) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.refreshCache().subscribe({
      next: (response: string) => {
        this.successMessage = "Cache des signatures rafraîchi avec succès.";
        this.loadSignatures(); // Recharger après rafraîchissement
        this.isLoading = false;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors du rafraîchissement du cache', error);
        this.errorMessage = "Une erreur est survenue lors du rafraîchissement du cache.";
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Charge toutes les signatures
   */

  loadSignatures(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.getAllSignatures().subscribe({
      next: (data: any[]) => { // ← Changé en any[]
        console.log('🔍 Données reçues:', data);
        
        // Création manuelle sans fromSignatureHistory
        this.signatures = data.map(item => {
          console.log('🔧 Item brut:', item);
          
          // Récupération manuelle de l'UUID
          const uuid = item.uuid || item.UUID || item.id || '';
          console.log('🔧 UUID extrait:', uuid);
          
          return new Signature(
            uuid,
            item.signatoryName || '',
            item.position || '',
            item.ideCuoCod || '',
            item.validFrom ? new Date(item.validFrom) : null,
            item.validTo ? new Date(item.validTo) : null,
            null // signatureImage pour l'instant
          );
        });
        
        console.log('✅ Signatures créées:', this.signatures);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Erreur:', error);
        this.errorMessage = "Une erreur est survenue lors du chargement des signatures.";
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

 /* loadSignatures(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.getAllSignatures().subscribe({
      next: (data: SignatureHistory[]) => {
        this.signatures = data.map(item => Signature.fromSignatureHistory(item));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des signatures', error);
        this.errorMessage = "Une erreur est survenue lors du chargement des signatures.";
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }
*/
  /**
   * Charge les signatures d'un bureau spécifique (surcharge adaptée au service)
   */
  loadSignaturesByBureau(event: Event): void;
  loadSignaturesByBureau(bureauCode: string, filterDate?: Date): void;
  loadSignaturesByBureau(eventOrCode: Event | string, filterDate?: Date): void {
    let bureauCode: string;
    
    if (typeof eventOrCode === 'string') {
      bureauCode = eventOrCode;
    } else {
      const select = eventOrCode.target as HTMLSelectElement;
      bureauCode = select?.value || '';
    }
    
    if (!bureauCode) {
      this.loadSignatures();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    let serviceCall;
    
    if (filterDate) {
      // Si une date de filtre est spécifiée, charger seulement les signatures valides à cette date
      serviceCall = this.signatureService.getAllValidSignaturesSorted(bureauCode, filterDate);
    } else {
      // Sinon, charger toutes les signatures du bureau
      serviceCall = this.signatureService.getSignaturesByBureau(bureauCode);
    }
    
    const sub = serviceCall.subscribe({
      next: (data: SignatureHistory[]) => {
        this.signatures = data.map(item => Signature.fromSignatureHistory(item));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(`Erreur lors du chargement des signatures pour le bureau ${bureauCode}`, error);
        this.errorMessage = `Une erreur est survenue lors du chargement des signatures pour le bureau ${bureauCode}.`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Filtre les signatures par terme de recherche (méthode conservée pour compatibilité)
   */
  filterSignatures(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input?.value || '';
    
    this.filterForm.patchValue({ searchTerm: searchTerm });
    this.applyFilters();
  }

  /**
   * Gère le changement de fichier
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Vérifier le type de fichier
      if (!this.selectedFile.type.startsWith('image/')) {
        this.errorMessage = "Veuillez sélectionner un fichier image valide.";
        this.selectedFile = null;
        this.previewUrl = null;
        this.clearMessages(5000);
        return;
      }
      
      // Créer la prévisualisation
      this.createPreview();
    }
  }

  /**
   * Crée une URL de prévisualisation pour l'image sélectionnée
   */
  createPreview(): void {
    if (this.selectedFile) {
      // Libérer l'ancienne URL si elle existe
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
      }
      
      // Créer une nouvelle URL
      this.previewUrl = URL.createObjectURL(this.selectedFile);
      this.showPreview = true;
    }
  }

  /**
   * Récupère l'URL d'image pour une signature
   */
  getImageUrl(signature: Signature): string {
    return signature.getImageUrl();
  }

  /**
   * Sélectionne une signature pour l'édition
   */
  editSignature(signature: Signature): void {
    this.selectedSignature = signature;
    this.isEditMode = true;
    
    // Réinitialiser le fichier sélectionné et l'aperçu
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    // Créer l'URL de l'image actuelle
    if (signature.signatureImage) {
      this.selectedImageUrl = signature.getImageUrl();
      this.showPreview = true;
    }
    
    // Reformater les dates pour l'affichage
    const validFrom = signature.validFrom ? new Date(signature.validFrom) : null;
    const validTo = signature.validTo ? new Date(signature.validTo) : null;
    
    // Pré-remplir le formulaire
    this.signatureForm.patchValue({
      uuid: signature.uuid,
      signatoryName: signature.signatory_name,
      position: signature.position,
      ideCuoCod: signature.customs_office_code,
      validFrom: validFrom ? this.datePipe.transform(validFrom, 'yyyy-MM-dd') : null,
      validTo: validTo ? this.datePipe.transform(validTo, 'yyyy-MM-dd') : null
    });
  }

  /**
   * Annule l'édition et réinitialise le formulaire
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Soumet le formulaire pour ajout ou mise à jour (adapté au service)
   */
  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.signatureForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.signatureForm.controls).forEach(key => {
        const control = this.signatureForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      this.clearMessages(5000);
      return;
    }
    
    // En mode ajout, un fichier est requis
    if (!this.isEditMode && !this.selectedFile) {
      this.errorMessage = "Veuillez sélectionner une image de signature.";
      this.clearMessages(5000);
      return;
    }
    
    this.isLoading = true;
    
    // Récupérer les valeurs du formulaire
    const formValue = this.signatureForm.value;
    
    // Créer l'objet pour le FormData
    const signatureData = {
      signatoryName: formValue.signatoryName,
      position: formValue.position,
      ideCuoCod: formValue.ideCuoCod,
      validFrom: formValue.validFrom ? new Date(formValue.validFrom) : null,
      validTo: formValue.validTo ? new Date(formValue.validTo) : null
    };
    
    if (this.isEditMode) {
      // Mise à jour avec FormData adapté
      const formData = this.signatureService.createUpdateSignatureFormData(
        signatureData,
        this.selectedFile || undefined
      );
      
      const sub = this.signatureService.updateSignature(formValue.uuid, formData).subscribe({
        next: (response: SignatureHistory) => {
          this.successMessage = "Signature mise à jour avec succès.";
          this.handleSuccess();
        },
        error: (error: any) => this.handleError(error)
      });
      
      this.subscriptions.push(sub);
    } else {
      // Ajout avec FormData adapté (fichier obligatoire)
      const formData = this.signatureService.createSignatureFormData(
        signatureData,
        this.selectedFile!
      );
      
      const sub = this.signatureService.addSignature(formData).subscribe({
        next: (response: SignatureHistory) => {
          this.successMessage = "Nouvelle signature ajoutée avec succès.";
          this.handleSuccess();
        },
        error: (error: any) => this.handleError(error)
      });
      
      this.subscriptions.push(sub);
    }
  }

  /**
   * Gère le succès après ajout/mise à jour
   */
  private handleSuccess(): void {
    // Recharger les signatures
    this.loadSignatures();
    
    // Réinitialiser le formulaire et l'état
    this.resetForm();
    
    this.isLoading = false;
    this.clearMessages(3000);
    
    // Rafraîchir le cache
    setTimeout(() => {
      this.refreshSignatureCache();
    }, 1000);
  }

  /**
   * Gère les erreurs d'API
   */
  private handleError(error: any): void {
    console.error('Erreur lors de l\'enregistrement de la signature', error);
    this.errorMessage = "Une erreur est survenue lors de l'enregistrement de la signature.";
    this.isLoading = false;
    this.clearMessages(5000);
  }

  /**
   * Supprime une signature
   */
  deleteSignature(uuid: string): void {
    console.log('UUID reçu pour suppression:', uuid);
    console.log('Type de UUID:', typeof uuid);

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment supprimer cette signature ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        const sub = this.signatureService.deleteSignature(uuid).subscribe({
          next: (response: any) => {
            // Afficher un message de succès avec SweetAlert
            Swal.fire({
              title: 'Supprimé !',
              text: 'La signature a été supprimée avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
            // Recharger les signatures
            this.loadSignatures();
            
            // Si la signature supprimée était en cours d'édition, réinitialiser le formulaire
            if (this.selectedSignature?.uuid === uuid) {
              this.resetForm();
            }
            
            this.isLoading = false;
            
            // Rafraîchir le cache
            setTimeout(() => {
              this.refreshSignatureCache();
            }, 1000);
          },
          error: (error: any) => {
            console.error('Erreur lors de la suppression de la signature', error);
            
            // Afficher un message d'erreur avec SweetAlert
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression de la signature.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            
            this.isLoading = false;
          }
        });
        
        this.subscriptions.push(sub);
      }
    });
  }
  /*deleteSignature(uuid: string): void {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette signature ?")) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.deleteSignature(uuid).subscribe({
      next: (response: any) => {
        this.successMessage = "Signature supprimée avec succès.";
        
        // Recharger les signatures
        this.loadSignatures();
        
        // Si la signature supprimée était en cours d'édition, réinitialiser le formulaire
        if (this.selectedSignature?.uuid === uuid) {
          this.resetForm();
        }
        
        this.isLoading = false;
        this.clearMessages(3000);
        
        // Rafraîchir le cache
        setTimeout(() => {
          this.refreshSignatureCache();
        }, 1000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression de la signature', error);
        this.errorMessage = "Une erreur est survenue lors de la suppression de la signature.";
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }
*/
  deleteSignatureById(uuid: string): void {
    // Confirmation avant suppression
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette signature sera supprimée définitivement !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel de la suppression
        this.signatureService.deleteSignature(uuid).subscribe({
          next: (response) => {
            // Succès
            Swal.fire({
              title: 'Supprimé !',
              text: 'La signature a été supprimée avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
            // Rafraîchir la liste ou rediriger
            this.loadSignatures(); // ou this.router.navigate(['/signatures']);
          },
          error: (error: any) => {
            // Erreur
            let errorMessage = 'Une erreur est survenue lors de la suppression.';
            
            if (error.status === 404) {
              errorMessage = 'Signature non trouvée ou déjà supprimée.';
            } else if (error.status === 500) {
              errorMessage = 'Erreur serveur lors de la suppression.';
            }
            
            Swal.fire({
              title: 'Erreur !',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  /**
   * Réinitialise le formulaire et l'état
   */
  resetForm(): void {
    this.signatureForm.reset();
    this.isEditMode = false;
    this.selectedSignature = null;
    this.selectedFile = null;
    this.formSubmitted = false;
    this.showPreview = false;
    
    // Libérer les ressources
    this.revokeAllUrls();
    
    // Réinitialiser le champ de fichier
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Libère toutes les URLs créées
   */
  private revokeAllUrls(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    if (this.selectedImageUrl) {
      URL.revokeObjectURL(this.selectedImageUrl);
      this.selectedImageUrl = null;
    }
  }

  /**
   * Efface automatiquement les messages après un délai
   */
  private clearMessages(delay: number = 3000): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, delay);
  }

  /**
   * Obtient la description de validité d'une signature
   */
  getValidityDescription(signature: Signature): string {
    return signature.getValidityPeriodDescription();
  }

  /**
   * Obtient le statut de validité d'une signature
   */
  getValidityStatus(signature: Signature): string {
    return signature.getValidityStatus();
  }

  /**
   * Vérifie si une signature est actuellement valide
   */
  isSignatureCurrentlyValid(signature: Signature): boolean {
    return signature.isCurrentlyValid();
  }

  /**
   * Vérifie si une signature expire bientôt
   */
  isSignatureExpiring(signature: Signature, days: number = 30): boolean {
    return signature.isExpiringWithin(days);
  }

  /**
   * Vérifie si une signature est en attente (date de début future)
   */
  isSignaturePending(signature: Signature): boolean {
    const now = new Date();
    return signature.validFrom !== null && signature.validFrom !== undefined && signature.validFrom > now;
  }

  /**
   * Vérifie si une signature a des signatures valides pour un bureau
   */
  hasValidSignatures(customsOfficeCode: string, date?: Date): void {
    this.isLoading = true;
    
    const sub = this.signatureService.hasValidSignatures(customsOfficeCode, date).subscribe({
      next: (hasValid: boolean) => {
        this.successMessage = hasValid 
          ? `Le bureau ${customsOfficeCode} a des signatures valides.`
          : `Le bureau ${customsOfficeCode} n'a aucune signature valide.`;
        this.isLoading = false;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la vérification des signatures valides', error);
        this.errorMessage = `Erreur lors de la vérification pour le bureau ${customsOfficeCode}.`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Récupère la meilleure signature pour un bureau (utilise getBestSignatureForOffice)
   */
  getBestSignatureForOffice(customsOfficeCode: string, date?: Date): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getBestSignatureForOffice(customsOfficeCode, date).subscribe({
      next: (data: SignatureHistory) => {
        this.selectedSignature = Signature.fromSignatureHistory(data);
        this.isLoading = false;
        this.successMessage = `Meilleure signature trouvée pour ${customsOfficeCode}`;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération de la meilleure signature', error);
        this.errorMessage = `Aucune signature optimale trouvée pour ${customsOfficeCode}`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Récupère le résumé des signatures pour un bureau
   */
  getSignatureSummary(customsOfficeCode: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getSignatureSummary(customsOfficeCode).subscribe({
      next: (data: SignatureHistory[]) => {
        this.signatures = data.map(item => Signature.fromSignatureHistory(item));
        this.applyFilters();
        this.isLoading = false;
        this.successMessage = `Résumé des signatures chargé pour ${customsOfficeCode}`;
        this.clearMessages(3000);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du résumé des signatures', error);
        this.errorMessage = `Erreur lors du chargement du résumé pour ${customsOfficeCode}`;
        this.isLoading = false;
        this.clearMessages(5000);
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Prévisualise une signature sélectionnée
   */
  previewSignature(signature: Signature): void {
    this.selectedSignature = signature;
    this.modalService.open(this.previewModal, { centered: true, size: 'lg' });
  }

  /**
   * Ferme la prévisualisation
   */
  closePreview(): void {
    this.showPreview = false;
    if (this.selectedImageUrl) {
      URL.revokeObjectURL(this.selectedImageUrl);
      this.selectedImageUrl = null;
    }
  }

  // =====================================
  // MÉTHODES UTILITAIRES SUPPLÉMENTAIRES
  // =====================================

  /**
   * Formate une date pour l'affichage
   */
  formatDate(date: Date | null | undefined): string {
    if (!date) return 'Non défini';
    return this.datePipe.transform(date, 'dd/MM/yyyy') || 'Date invalide';
  }

  /**
   * Obtient la classe CSS pour le statut d'une signature
   */
  getStatusClass(signature: Signature): string {
    if (!signature.isCurrentlyValid()) {
      return 'bg-danger';
    }
    if (signature.isExpiringWithin(30)) {
      return 'bg-warning';
    }
    if (this.isSignaturePending(signature)) {
      return 'bg-info';
    }
    return 'bg-success';
  }

  /**
   * Obtient l'icône pour le statut d'une signature
   */
  getStatusIcon(signature: Signature): string {
    if (!signature.isCurrentlyValid()) {
      return 'fa-times-circle';
    }
    if (signature.isExpiringWithin(30)) {
      return 'fa-exclamation-triangle';
    }
    if (this.isSignaturePending(signature)) {
      return 'fa-clock';
    }
    return 'fa-check-circle';
  }

  /**
   * Vérifie si une signature est spécifique à un bureau
   */
  isBureauSpecific(signature: Signature): boolean {
    return signature.isBureauSpecific();
  }

  /**
   * Obtient le nom complet d'un bureau par son code
   */
  getBureauName(code: string): string {
    if (code === 'ALL') return 'Tous les bureaux';
    const bureau = this.bureaux.find(b => b.code === code);
    return bureau ? `${bureau.code} - ${bureau.nom}` : code;
  }

  /**
   * Trie les signatures par critère
   */
  sortSignatures(criteria: 'name' | 'bureau' | 'validFrom' | 'validTo' | 'status'): void {
    switch (criteria) {
      case 'name':
        this.filteredSignatures.sort((a, b) => a.signatory_name.localeCompare(b.signatory_name));
        break;
      case 'bureau':
        this.filteredSignatures.sort((a, b) => a.customs_office_code.localeCompare(b.customs_office_code));
        break;
      case 'validFrom':
        this.filteredSignatures.sort((a, b) => {
          const dateA = a.validFrom ? a.validFrom.getTime() : 0;
          const dateB = b.validFrom ? b.validFrom.getTime() : 0;
          return dateB - dateA; // Plus récent en premier
        });
        break;
      case 'validTo':
        this.filteredSignatures.sort((a, b) => {
          const dateA = a.validTo ? a.validTo.getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.validTo ? b.validTo.getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB; // Expire plus tôt en premier
        });
        break;
      case 'status':
        this.filteredSignatures.sort((a, b) => {
          const statusA = a.isCurrentlyValid() ? (a.isExpiringWithin(30) ? 1 : 0) : 2;
          const statusB = b.isCurrentlyValid() ? (b.isExpiringWithin(30) ? 1 : 0) : 2;
          return statusA - statusB; // Valides d'abord, puis expirant, puis invalides
        });
        break;
    }
  }

  /**
   * Exporte les signatures au format CSV
   */
  exportSignatures(): void {
    const headers = ['UUID', 'Nom du Signataire', 'Poste', 'Bureau', 'Valide du', 'Valide au', 'Statut'];
    const rows = this.filteredSignatures.map(sig => [
      sig.uuid,
      sig.signatory_name,
      sig.position,
      sig.customs_office_code,
      sig.validFrom ? this.formatDate(sig.validFrom) : '',
      sig.validTo ? this.formatDate(sig.validTo) : '',
      sig.getValidityStatus()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `signatures_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Réinitialise toutes les données et recharge depuis le serveur
   */
  fullRefresh(): void {
    if (!confirm("Voulez-vous rafraîchir complètement les données ? Cela rechargera toutes les signatures depuis le serveur.")) {
      return;
    }
    
    // Réinitialiser l'état
    this.signatures = [];
    this.filteredSignatures = [];
    this.selectedSignature = null;
    this.resetForm();
    this.resetFilters();
    
    // Recharger les données
    this.refreshSignatureCache();
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
/*import { Component, ElementRef, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { SignatureService } from '../../services/signature.service';
import { Signature } from '../../models/signature';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Assurez-vous d'avoir installé ng-bootstrap

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('testSignatureModal') testSignatureModal!: TemplateRef<any>;
  @ViewChild('testResultModal') testResultModal!: TemplateRef<any>;
  
  // États du composant
  isLoading: boolean = false;
  isAdmin: boolean = false;
  formSubmitted: boolean = false;
  isEditMode: boolean = false;
  showPreview: boolean = false;
  showHelp: boolean = false; // Pour afficher/masquer l'aide
  
  // Messages
  errorMessage: string = '';
  successMessage: string = '';
  
  // Formulaires
  signatureForm: FormGroup;
  testForm: FormGroup; // Nouveau formulaire pour le test de signature
  
  // Données
  signatures: Signature[] = [];
  selectedSignature: Signature | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  selectedImageUrl: string | null = null;
  testResult: any = null; // Résultat du test de signature
  
  // Pour le stockage des abonnements
  private subscriptions: Subscription[] = [];
  
  // Bureaux de douane (à remplacer par votre liste réelle)
  /*  bureaux: {code: string, nom: string}[] = [
      { code: 'CKY', nom: 'Conakry Port' },
      { code: 'KKN', nom: 'Kankan' },
      { code: 'CKYA', nom: 'Conakry Aéroport' },
      { code: 'NZRK', nom: 'N\'Zérékoré' }
    ];
  
  bureaux!: string;
  validFrom: Date | null = null;
  validTo: Date | null = null;
  
  constructor(
    private fb: FormBuilder,
    private signatureService: SignatureService,
    private authService: AuthenticationService,
    private datePipe: DatePipe,
    private modalService: NgbModal // Ajout du service de modal
  ) {
    this.signatureForm = this.initForm();
    this.testForm = this.initTestForm(); // Initialisation du formulaire de test
  }

  ngOnInit(): void {
    // Vérifier le rôle de l'utilisateur
    const role = sessionStorage.getItem("role");
    this.isAdmin = role?.includes("admin") ?? false;
    
    // Charger les signatures
    this.loadSignatures();
  }

  ngOnDestroy(): void {
    // Nettoyer les abonnements et libérer les ressources
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Révoquer les URLs d'objets pour éviter les fuites de mémoire
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    
    if (this.selectedImageUrl) {
      URL.revokeObjectURL(this.selectedImageUrl);
    }
  }

  /**
   * Initialise le formulaire principal
   
  initForm(): FormGroup {
    return this.fb.group({
      uuid: [''],
      signatoryName: ['', [Validators.required, Validators.minLength(3)]],
      position: ['', [Validators.required]],
      ideCuoCod: ['', [Validators.required]],
      validFrom: [null],
      validTo: [null],
      isActive: [true]
    }, { validators: this.dateRangeValidator });
  }

  /**
   * Initialise le formulaire de test
   
  initTestForm(): FormGroup {
    return this.fb.group({
      ideCuoCod: ['', [Validators.required]],
      testDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]]
    });
  }

  /**
   * Validateur personnalisé pour s'assurer que la date de fin est après la date de début
  
  dateRangeValidator(group: FormGroup) {
    const start = group.get('validFrom')?.value;
    const end = group.get('validTo')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  /**
   * Affiche ou masque la section d'aide
   
  toggleHelpSection(): void {
    this.showHelp = !this.showHelp;
  }

  /**
   * Ouvre la modale de test de sélection de signature
   
  testSignatureSelection(): void {
    this.testForm.reset({
      testDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
    this.modalService.open(this.testSignatureModal, { centered: true });
  }

  /**
   * Soumet le formulaire de test
   
  submitTestForm(): void {
    if (this.testForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValues = this.testForm.value;
      const testDate = new Date(formValues.testDate);
      
      const sub = this.signatureService.testSignatureSelection(formValues.ideCuoCod, testDate).subscribe({
        next: (result) => {
          this.testResult = result;
          this.isLoading = false;
          
          // Fermer la modale de test et ouvrir celle des résultats
          this.modalService.dismissAll();
          this.modalService.open(this.testResultModal, { centered: true, size: 'lg' });
        },
        error: (error: any) => {
          console.error('Erreur lors du test de sélection de signature', error);
          this.errorMessage = "Une erreur est survenue lors du test de sélection.";
          this.isLoading = false;
        }
      });
      
      this.subscriptions.push(sub);
    }
  }

  /**
   * Rafraîchit le cache des signatures
   
  refreshSignatureCache(): void {
    if (!confirm("Voulez-vous rafraîchir le cache des signatures ? Cette opération peut prendre quelques instants.")) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.refreshSignatures().subscribe({
      next: (response) => {
        this.successMessage = "Cache des signatures rafraîchi avec succès.";
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du rafraîchissement du cache', error);
        this.errorMessage = "Une erreur est survenue lors du rafraîchissement du cache.";
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  // Méthodes existantes inchangées
  
  /**
   * Charge toutes les signatures
  
  loadSignatures(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.getAllSignatures().subscribe({
      next: (data) => {
        this.signatures = data.map(item => Signature.fromJson(item));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des signatures', error);
        this.errorMessage = "Une erreur est survenue lors du chargement des signatures.";
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Charge les signatures d'un bureau spécifique
   * @param event Événement de changement du select
   
  loadSignaturesByBureau(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const bureauCode = select?.value || '';
    
    if (!bureauCode) {
      this.loadSignatures();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.signatureService.getSignaturesByBureau(bureauCode).subscribe({
      next: (data) => {
        this.signatures = data.map(item => Signature.fromJson(item));
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(`Erreur lors du chargement des signatures pour le bureau ${bureauCode}`, error);
        this.errorMessage = `Une erreur est survenue lors du chargement des signatures pour le bureau ${bureauCode}.`;
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Gère le changement de fichier
   
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Vérifier le type de fichier
      if (!this.selectedFile.type.startsWith('image/')) {
        this.errorMessage = "Veuillez sélectionner un fichier image valide.";
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }
      
      // Créer la prévisualisation
      this.createPreview();
    }
  }

  /**
   * Crée une URL de prévisualisation pour l'image sélectionnée
  
  createPreview(): void {
    if (this.selectedFile) {
      // Libérer l'ancienne URL si elle existe
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
      }
      
      // Créer une nouvelle URL
      this.previewUrl = URL.createObjectURL(this.selectedFile);
      this.showPreview = true;
    }
  }

  /**
   * Récupère l'URL d'image pour une signature
  
  getImageUrl(signature: Signature): string {
    if (!signature.signatureImage || signature.signatureImage.length === 0) {
      return '';
    }
    
    const blob = new Blob([signature.signatureImage], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }

  /**
   * Sélectionne une signature pour l'édition
  
  editSignature(signature: Signature): void {
    this.selectedSignature = signature;
    this.isEditMode = true;
    
    // Réinitialiser le fichier sélectionné et l'aperçu
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    // Créer l'URL de l'image actuelle
    if (signature.signatureImage) {
      this.selectedImageUrl = this.getImageUrl(signature);
      this.showPreview = true;
    }
    
    // Reformater les dates pour l'affichage
    const validFrom = signature.validFrom ? new Date(signature.validFrom) : null;
    const validTo = signature.validTo ? new Date(signature.validTo) : null;
    
    // Pré-remplir le formulaire
    this.signatureForm.patchValue({
      uuid: signature.uuid,
      signatoryName: signature.signatoryName,
      position: signature.position,
      ideCuoCod: signature.ideCuoCod,
      validFrom: validFrom ? this.datePipe.transform(validFrom, 'yyyy-MM-dd') : null,
      validTo: validTo ? this.datePipe.transform(validTo, 'yyyy-MM-dd') : null,
      isActive: signature.isActive
    });
  }

  /**
   * Annule l'édition et réinitialise le formulaire
   
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Soumet le formulaire pour ajout ou mise à jour
  
  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.signatureForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.signatureForm.controls).forEach(key => {
        const control = this.signatureForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }
    
    // En mode ajout, un fichier est requis
    if (!this.isEditMode && !this.selectedFile) {
      this.errorMessage = "Veuillez sélectionner une image de signature.";
      return;
    }
    
    this.isLoading = true;
    
    // Récupérer les valeurs du formulaire
    const formValue = this.signatureForm.value;
    
    // Créer l'objet pour le FormData
    const signatureData = {
      signatoryName: formValue.signatoryName,
      position: formValue.position,
      ideCuoCod: formValue.ideCuoCod,
      validFrom: formValue.validFrom ? new Date(formValue.validFrom) : null,
      validTo: formValue.validTo ? new Date(formValue.validTo) : null
    };
    
    // Créer le FormData
    const formData = this.signatureService.createSignatureFormData(
      signatureData,
      this.selectedFile || undefined
    );
    
    if (this.isEditMode) {
      // Mise à jour
      const sub = this.signatureService.updateSignature(formValue.uuid, formData).subscribe({
        next: (response) => {
          this.successMessage = "Signature mise à jour avec succès.";
          this.handleSuccess();
          // Rafraîchir le cache après une mise à jour
          this.refreshSignatureCache();
        },
        error: (error: any) => this.handleError(error)
      });
      
      this.subscriptions.push(sub);
    } else {
      // Ajout
      const sub = this.signatureService.addSignature(formData).subscribe({
        next: (response) => {
          this.successMessage = "Nouvelle signature ajoutée avec succès.";
          this.handleSuccess();
          // Rafraîchir le cache après un ajout
          this.refreshSignatureCache();
        },
        error: (error: any) => this.handleError(error)
      });
      
      this.subscriptions.push(sub);
    }
  }

  /**
   * Gère le succès après ajout/mise à jour
   
  private handleSuccess(): void {
    // Recharger les signatures
    this.loadSignatures();
    
    // Réinitialiser le formulaire et l'état
    this.resetForm();
    
    this.isLoading = false;
  }

  /**
   * Gère les erreurs d'API
   
  private handleError(error: any): void {
    console.error('Erreur lors de l\'enregistrement de la signature', error);
    this.errorMessage = "Une erreur est survenue lors de l'enregistrement de la signature.";
    this.isLoading = false;
  }

  /**
   * Supprime une signature
   
  deleteSignature(uuid: string): void {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette signature ?")) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const sub = this.signatureService.deleteSignature(uuid).subscribe({
      next: () => {
        this.successMessage = "Signature supprimée avec succès.";
        
        // Recharger les signatures
        this.loadSignatures();
        
        // Si la signature supprimée était en cours d'édition, réinitialiser le formulaire
        if (this.selectedSignature?.uuid === uuid) {
          this.resetForm();
        }
        
        // Rafraîchir le cache après une suppression
        this.refreshSignatureCache();
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression de la signature', error);
        this.errorMessage = "Une erreur est survenue lors de la suppression de la signature.";
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  /**
   * Réinitialise le formulaire et l'état
   
  resetForm(): void {
    this.signatureForm.reset({isActive: true});
    this.isEditMode = false;
    this.selectedSignature = null;
    this.selectedFile = null;
    this.formSubmitted = false;
    this.showPreview = false;
    
    // Libérer les ressources
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    if (this.selectedImageUrl) {
      URL.revokeObjectURL(this.selectedImageUrl);
      this.selectedImageUrl = null;
    }
    
    // Réinitialiser le champ de fichier
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Filtre les signatures par terme de recherche
   
  filterSignatures(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input?.value || '';
    
    if (!searchTerm || searchTerm.trim() === '') {
      this.loadSignatures();
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filtrer les signatures déjà chargées
    const originalSignatures = [...this.signatures];
    this.signatures = originalSignatures.filter(sig => 
      sig.signatoryName.toLowerCase().includes(term) ||
      sig.position.toLowerCase().includes(term) ||
      sig.ideCuoCod.toLowerCase().includes(term)
    );
  }

  getValidityPeriodDescription(): string {
  if (!this.validFrom && !this.validTo) {
    return 'Indéfinie';
  }
  if (this.validFrom && !this.validTo) {
    return `Valide à partir du ${this.formatDate(this.validFrom)}`;
  }
  if (!this.validFrom && this.validTo) {
    return `Valide jusqu'au ${this.formatDate(this.validTo)}`;
  }
  return `Valide du ${this.formatDate(this.validFrom!)} au ${this.formatDate(this.validTo!)}`;
}

private formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR'); // Format français
}
}
*/




