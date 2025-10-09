import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NifUtilisateur } from '../../models/nif-utilisateur';
import { Page } from '../../models/Page';
import { PagedData } from '../../models/paged-data';
import { SituationDeclaration } from '../../models/situation-declaration';
import { Utilisateur } from '../../models/Utilisateur';
import { NifUtilisateurService } from '../../services/nif-utilisateur.service';
import { SituationDeclarationService } from '../../services/situation-declaration.service';

@Component({
  selector: 'app-situation-declaration',
  templateUrl: './situation-declaration.component.html',
  styleUrls: ['./situation-declaration.component.scss']
})
export class SituationDeclarationComponent implements OnInit {

    @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;
  showUserList = false;
   filterednif!: Observable<Utilisateur[]>;
   nifControl = new FormControl('', Validators.required);
  formSubmitted = false;
    showUserListnomenclature = false;
      filterednomenclature!: Observable<Utilisateur[]>;
  nomenclatureList: Utilisateur[] = [];
          nomenclatureControl = new FormControl('', Validators.required);
  pageData: PagedData<SituationDeclaration> = { 
    content: [], 
    pageNumber: 0, 
    pageSize: 0, 
    totalElements: 0 
  };
  nifForm: FormGroup;
  isAuthorized: boolean = true;
  errorMessage: string = '';
  nifList: Utilisateur[] = [];
  pageSelectionne: number = 1;
  nombreElementParPage: number = 5; 
  nombreTotalEnregistrement: number = 0;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  page: Page = {
    pageNumber: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  };
  totalPages: number = 0;
  // Liste des pages pour la pagination
  pages: number[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private situationDeclarationService: SituationDeclarationService,
    private nifUtilisateurService: NifUtilisateurService,
    private datePipe: DatePipe
  ) {
    this.nifForm = this.fb.group({
      nif: ['', Validators.required],
       nomenclature: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['ALL', []],
      
    }, { validators: this.dateRangeValidator });
  }
  
//  dateRangeValidator(group: FormGroup) {
//     const start = group.get('dateDebut')?.value;
//     const end = group.get('dateFin')?.value;
//     if (start && end && new Date(start) > new Date(end)) {
//       return { dateRangeInvalid: true };
//     }
//     return null;
//   }




dateRangeValidator(group: FormGroup) {
  const start = group.get('dateDebut')?.value;
  const end = group.get('dateFin')?.value;
  const today = new Date();
  
  // Réinitialiser l'heure à 00:00:00 pour comparer uniquement les dates
  today.setHours(0, 0, 0, 0);
  
  const errors: any = {};
  
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Réinitialiser l'heure des dates à comparer
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Vérifier si la date de début est postérieure à la date de fin
    if (startDate > endDate) {
      errors.dateRangeInvalid = true;
    }
    
    // Vérifier si les dates sont dans le futur
    if (startDate > today) {
      errors.startDateFuture = true;
    }
    
    if (endDate > today) {
      errors.endDateFuture = true;
    }
  } else {
    // Vérifier individuellement si une seule date est fournie
    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate > today) {
        errors.startDateFuture = true;
      }
    }
    
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate > today) {
        errors.endDateFuture = true;
      }
    }
  }
  
  // Retourner null si aucune erreur, sinon retourner l'objet d'erreurs
  return Object.keys(errors).length > 0 ? errors : null;
}


  initPage(): void {
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    this.pageSelectionne = 1;
  }

  
  getAllNifDeclaration(nif: string,nomenclature: string, statut: string, dateDebut: string, dateFin: string): void {
    this.errorMessage = '';
    this.isLoading = true;
    
    console.log("🔹 Données envoyées à l'API :", { nif,nomenclature, statut, dateDebut, dateFin, page: this.page });

    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy-MM-dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');

    if (!formattedDateDebut || !formattedDateFin) {
      this.errorMessage = "Format de date invalide.";
      this.isLoading = false;
      return;
    }

    // Assurer que statut a toujours une valeur
    const statutValue = statut || 'ALL';

    this.situationDeclarationService.getDeclarationsByNifsAll(
      this.page, 
      '', // key vide 
      nif, 
      nomenclature,
      statutValue, 
      formattedDateDebut, 
      formattedDateFin
    ).subscribe({
      next: (pagedData: PagedData<SituationDeclaration>) => {
        console.log("✅ Données reçues de l'API :", pagedData);
        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
        
        // Calculer le nombre total de pages
        this.totalPages = Math.ceil(this.nombreTotalEnregistrement / this.nombreElementParPage);
        
        // Générer la pagination
        this.generatePagination();
        
        if (!pagedData?.content?.length) {
          console.warn("⚠️ Aucune donnée reçue !");
           this.errorMessage = "Aucune declaration trouvée avec ces critères.";
        }else {
          this.errorMessage = "";
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
  console.error("❌ Erreur API :", error);

  if (error?.error?.message) {
    this.errorMessage = error.error.message;
  } else {
    this.errorMessage = "Erreur lors de la récupération des données.";
  }

  this.isLoading = false;
}
    });
  }

  onSubmit(): void {
        this.formSubmitted = true; 
    this.errorMessage = '';
    
    if (this.nifForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs de validation
      Object.keys(this.nifForm.controls).forEach(key => {
        const control = this.nifForm.get(key);
        control?.markAsTouched();
      });
      
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }
  
    const { nif, nomenclature,statut, dateDebut, dateFin } = this.nifForm.value;
    
    // Réinitialiser la pagination lors d'une nouvelle recherche
    this.initPage();
  
    this.getAllNifDeclaration(nif,nomenclature, statut || 'ALL', dateDebut, dateFin);
  }
  
  /**
   * Génère la liste des numéros de pages pour la pagination
   */
  generatePagination(): void {
    this.pages = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    
    if (this.totalPages <= maxPagesToShow) {
      // Si le nombre total de pages est inférieur à maxPagesToShow, afficher toutes les pages
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Sinon, afficher un nombre limité de pages avec ... pour les pages cachées
      let startPage = Math.max(1, this.pageSelectionne - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Ajouter la première page
      if (startPage > 1) {
        this.pages.push(1);
        if (startPage > 2) {
          this.pages.push(-1); // -1 représente "..."
        }
      }
      
      // Ajouter les pages du milieu
      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
      
      // Ajouter la dernière page
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          this.pages.push(-1); // -1 représente "..."
        }
        this.pages.push(this.totalPages);
      }
    }
  }

  /**
   * Méthode pour changer de page
   */
  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.pageSelectionne) {
      return; // Ne rien faire si la page demandée est invalide ou déjà sélectionnée
    }
    
    this.pageSelectionne = pageNumber;
    this.page.pageNumber = pageNumber - 1; // L'API utilise une pagination basée sur 0
    
    const { nif, nomenclature,statut, dateDebut, dateFin } = this.nifForm.value;
    this.getAllNifDeclaration(
      nif || '', 
      nomenclature|| '', 
      statut || 'ALL', 
      dateDebut || '', 
      dateFin || ''
    );
  }

  /**
   * Méthode pour aller à la page précédente
   */
  goToPreviousPage(): void {
    if (this.pageSelectionne > 1) {
      this.goToPage(this.pageSelectionne - 1);
    }
  }

  /**
   * Méthode pour aller à la page suivante
   */
  goToNextPage(): void {
    if (this.pageSelectionne < this.totalPages) {
      this.goToPage(this.pageSelectionne + 1);
    }
  }

  /**
   * Méthode pour aller à la première page
   */
  goToFirstPage(): void {
    if (this.pageSelectionne !== 1) {
      this.goToPage(1);
    }
  }

  /**
   * Méthode pour aller à la dernière page
   */
  goToLastPage(): void {
    if (this.pageSelectionne !== this.totalPages) {
      this.goToPage(this.totalPages);
    }
  }

  /**
   * Gère le changement de taille de page
   */
  onPageSizeChange(): void {
    // Réinitialiser à la première page lors du changement de taille
    this.pageSelectionne = 1;
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    
    // Recalculer le nombre total de pages
    this.totalPages = Math.ceil(this.nombreTotalEnregistrement / this.nombreElementParPage);
    
    // Régénérer la pagination avec les nouvelles tailles
    this.generatePagination();
    
    // Si le formulaire est valide, recharger les données avec la nouvelle taille de page
    if (this.nifForm.valid) {
      const { nif,nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
      
      this.getAllNifDeclaration(
        nif || '', 
        nomenclature|| '',
        statut || 'ALL', 
        dateDebut || '', 
        dateFin || ''
      );
    }
  }
  
  /**
   * Méthode pour changer de page (utilisée par ngb-pagination)
   */
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageSelectionne) {
      return;
    }
    
    this.pageSelectionne = page;
    this.page.pageNumber = page - 1;
    
    const { nif,nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
    
    this.getAllNifDeclaration(

      nif || '', 
      nomenclature|| '',
      statut || 'ALL', 
      dateDebut || '', 
      dateFin || ''
    );
  }
  


  
  
  // Méthode d'exportation PDF
 /* exportToTPdf(): void {
    if (this.nifForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires avant d'exporter.";
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { nif, nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
    
    // Format de date attendu par le backend
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy-MM-dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');
    
    if (!formattedDateDebut || !formattedDateFin) {
      this.errorMessage = "Format de date invalide pour l'exportation.";
      this.isLoading = false;
      return;
    }
    
    this.situationDeclarationService.exportToTPdf(
      formattedDateDebut,
      formattedDateFin,
      nif || '',
      nomenclature || '',
      statut || 'ALL'
    ).subscribe({
      next: (blob: Blob) => {
        this.downloadFile(blob, `declarations_${formattedDateDebut}_${formattedDateFin}.pdf`);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.handleExportError(error, 'PDF');
        this.isLoading = false;
      }
    });
  }
*/

  // Méthode d'exportation PDF
  exportToTPdf(): void {
    if (this.nifForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires avant d'exporter.";
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { nif, nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
    
    // Format de date attendu par le backend
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy-MM-dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');
    
    if (!formattedDateDebut || !formattedDateFin) {
      this.errorMessage = "Format de date invalide pour l'exportation.";
      this.isLoading = false;
      return;
    }
    
    this.situationDeclarationService.exportToTPdf(
      formattedDateDebut,
      formattedDateFin,
      nif || '',
      nomenclature || '',
      statut || 'ALL'
    ).subscribe({
      next: (blob: Blob) => {
        this.downloadFile(blob, `declarations_${formattedDateDebut}_${formattedDateFin}.pdf`);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.handleExportError(error, 'PDF');
        this.isLoading = false;
      }
    });
  }
  // Méthode d'exportation Excel
 /* exportToTExcel(): void {
    if (this.nifForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires avant d'exporter.";
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { nif, nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
    
    // Format de date attendu par le backend
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy-MM-dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');
    
    if (!formattedDateDebut || !formattedDateFin) {
      this.errorMessage = "Format de date invalide pour l'exportation.";
      this.isLoading = false;
      return;
    }
    
    this.situationDeclarationService.exportToTExcel(
      formattedDateDebut,
      formattedDateFin,
      nif || '',
      nomenclature || '',
      statut || 'ALL'
    ).subscribe({
      next: (blob: Blob) => {
        this.downloadFile(blob, `declarations_${formattedDateDebut}_${formattedDateFin}.xls`);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.handleExportError(error, 'Excel');
        this.isLoading = false;
      }
    });
  }
*/

  // Méthode d'exportation Excel
  exportToTExcel(): void {
    if (this.nifForm.invalid) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires avant d'exporter.";
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { nif, nomenclature, statut, dateDebut, dateFin } = this.nifForm.value;
    
    // Format de date attendu par le backend
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy-MM-dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy-MM-dd');
    
    if (!formattedDateDebut || !formattedDateFin) {
      this.errorMessage = "Format de date invalide pour l'exportation.";
      this.isLoading = false;
      return;
    }
    
    this.situationDeclarationService.exportToTExcel(
      formattedDateDebut,
      formattedDateFin,
      nif || '',
      nomenclature || '',
      statut || 'ALL'
    ).subscribe({
      next: (blob: Blob) => {
        this.downloadFile(blob, `declarations_${formattedDateDebut}_${formattedDateFin}.xls`);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.handleExportError(error, 'Excel');
        this.isLoading = false;
      }
    });
  }
  private handleExportError(error: any, context: string): void {
    console.error(`Erreur lors de l'exportation en ${context}`, error);
    
    if (error.status === 0) {
      this.errorMessage = `Le serveur ne répond pas. Vérifiez votre connexion réseau.`;
      return;
    }
    
    if (error.error instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorText = reader.result as string;
          // Essayer de parser comme JSON si possible
          try {
            const jsonError = JSON.parse(errorText);
            this.errorMessage = jsonError.message || errorText;
          } catch (e) {
            // Si ce n'est pas du JSON, utiliser le texte brut
            this.errorMessage = errorText;
          }
        } catch (e) {
          this.errorMessage = `Une erreur est survenue lors de l'exportation en ${context}.`;
        }
      };
      reader.onerror = () => {
        this.errorMessage = `Une erreur est survenue lors de l'exportation en ${context}.`;
      };
      reader.readAsText(error.error);
    } else if (error.status === 400) {
      this.errorMessage = `Erreur 400: Requête incorrecte pour l'exportation en ${context}. Vérifiez vos paramètres.`;
    } else if (error.status === 500) {
      this.errorMessage = `Erreur serveur lors de la génération du fichier ${context}. Veuillez réessayer plus tard.`;
    } else {
      this.errorMessage = error.message || `Une erreur est survenue lors de l'exportation en ${context}.`;
    }
  }

  private downloadFile(blob: Blob, filename: string): void {
    // Vérifier que le blob a bien un contenu
    if (!blob || blob.size === 0) {
      this.errorMessage = "Le fichier généré est vide ou corrompu.";
      return;
    }

    try {
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément a pour télécharger le fichier
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      console.log('Téléchargement terminé - Type MIME du blob:', blob.type);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      this.errorMessage = "Erreur lors du téléchargement du fichier.";
    }
  }






   ngOnInit(): void {
        // Initialisation de la pagination
        this.page.pageNumber = 0;
        this.page.size = this.nombreElementParPage;
        this.pageData.page = this.page;
        
        // Récupérer le rôle
        const role = sessionStorage.getItem("role");
        this.isAdmin = role?.includes("admin") ?? false;
        
        // Charger la première page de NIF au démarrage
        this.getAllnif(0, 10);  // page 0, taille 10 (ajustez selon vos besoins)
      
        // 🔍 Recherche auto NIF dynamique (asynchrone)
        this.filterednif = this.nifControl.valueChanges.pipe(
          debounceTime(300),  // Attendre 300ms après chaque saisie
          distinctUntilChanged(),  // Ignorer les requêtes redondantes
          switchMap((value: any) => {
            if (value && value.length >= 2) {
              return this.nifUtilisateurService.getAlle(value) as Observable<Utilisateur[]>; // Recherche basée sur la valeur saisie
            } else {
              return of([] as Utilisateur[]); // Retourner une liste vide si la recherche est inférieure à 2 caractères
            }
          })
        ) as Observable<Utilisateur[]>;

         this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        if (value && typeof value === 'string' && value.length >= 2) {
          return this.nifUtilisateurService.getAllnomclature(value) as Observable<Utilisateur[]>;
        } else {
          return of([] as Utilisateur[]);
        }
      })
    ) as Observable<Utilisateur[]>;
      }
    
    
    
      getAllnif(page: number, size: number): void {
          this.isLoading = true;
          this.nifUtilisateurService.getAlle('nif', page, size).subscribe({
            next: (list: Utilisateur[]) => {
              this.nifList = list;
              this.isLoading = false;
            },
            error: (error: any) => {
              console.error('Erreur lors de la récupération des NIFs', error);
              this.errorMessage = "Erreur lors du chargement des NIFs.";
              this.isLoading = false;
            }
          });
        }
        
        
      
      
      
        initFilter(): void {
          this.filterednif = this.nifControl.valueChanges.pipe(
            startWith(''),
            map((value: any) => this.filterUsers(value || ''))
          ) as Observable<Utilisateur[]>;


          this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value: any) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return this.nifUtilisateurService.getAllnomclature(value, 0, 10) as Observable<Utilisateur[]>; // recherche dynamique
      } else {
        return of([] as Utilisateur[]); // vide si pas de valeur
      }
    })
  ) as Observable<Utilisateur[]>;
        }
      
        private filterUsers(value: string): Utilisateur[] {
          const filterValue = value.toLowerCase();
          return this.nifList.filter(user => user.nif.toLowerCase().includes(filterValue));
        }



      
      
      
        // Renseigner le champ NIF à partir de la sélection
      setSelectedUser(nifUtilisateur: Utilisateur): void {
        this.nifForm.patchValue({ nif: nifUtilisateur.nif });
        this.nifControl.setValue(nifUtilisateur.nif);
        this.showUserList = false;
      }
      
      // Affiche la liste des suggestions au focus
      showUsersList(): void {
        this.showUserList = true;
      }
      
      // Cache la liste si on clique en dehors
      closeUserList(event: Event): void {
        if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
          this.showUserList = false;
        }
        else if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserListnomenclature = false;
    }
      }

        showUsersListnomenclature(): void {
    this.showUserListnomenclature = true;
  }

   getAllnomenclature(page: number, size: number): void {
    this.isLoading = true;
    this.nifUtilisateurService.getAllnomclature('nomenclature', page, size).subscribe({
      next: (list: Utilisateur[]) => {
        this.nomenclatureList = list;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des nomenclature', error);
        this.errorMessage = "Erreur lors du chargement des nomenclature.";
        this.isLoading = false;
      }
    });
  }

 setSelectednomenclature(nomenclatureUtilisateur: Utilisateur): void {
    this.nifForm.patchValue({ nomenclature: nomenclatureUtilisateur.nomenclature });
    this.nomenclatureControl.setValue(nomenclatureUtilisateur.nomenclature);
    this.showUserListnomenclature = false;
  }
}




