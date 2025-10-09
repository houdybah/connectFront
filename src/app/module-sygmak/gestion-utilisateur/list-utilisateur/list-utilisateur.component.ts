import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  filter
} from 'rxjs/operators';
import {
  throwError,
  interval,
  Subscription
} from 'rxjs';
import {
  NavigationEnd,
  Router
} from '@angular/router';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  ToastService
} from 'src/app/core/services/toast.service';
import {
  UtilisateurService
} from '../../services/utilisateur.service';
import {
  Utilisateur
} from '../../models/Utilisateur';
import {
  Page
} from '../../models/Page';
import {
  PagedData
} from '../../models/paged-data';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-list-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.scss']
})
export class ListUtilisateurComponent implements OnInit, OnDestroy {

  page: Page = {
    pageNumber: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  };

  pageData: PagedData<Utilisateur> = {
    content: [],
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0
  };

  pageSelectionne = 1;
  nombreElementParPage = 5;
  nombreTotalEnregistrement = 0;
  rechercheEmailControl = new FormControl('');
  utilisateurRegisterParam: Utilisateur | null = null;
  loading = false;

   // Propriétés ajoutées pour la gestion des connexions
   private onlineUsers: any[] = [];
   private refreshSubscription: Subscription | null = null;
 
 

  constructor(
    private authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private utilisateurService: UtilisateurService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}


  ngOnInit(): void {
    this.initRecherche();
    this.loadUtilisateursAvecFiltre();
    this.loadOnlineUsers();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUtilisateursAvecFiltre();
        this.loadOnlineUsers();
      });

    // Actualisation automatique toutes les 30 secondes
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadOnlineUsers();
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

 /* ngOnInit(): void {
    this.initRecherche();
    this.loadUtilisateursAvecFiltre();
    this.loadOnlineUsers();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadUtilisateursAvecFiltre());

    setInterval(() => {
      this.cdRef.detectChanges();
    }, 30000);
  }
*/
  private initRecherche(): void {
    this.rechercheEmailControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const filtre = value ? value.trim() : '';
        this.pageSelectionne = 1;
        this.page.pageNumber = 0;
        this.page.size = this.nombreElementParPage;
        this.loading = true;

        return this.utilisateurService.getAll(this.page, filtre).pipe(
          catchError(error => {
            this.handleError(error);
            return throwError(() => error);
          })
        );
      })
    ).subscribe(result => {
      this.loading = false;
      this.updatePageData(result);
    });
  }

  private updatePageData(result: PagedData<Utilisateur>): void {
    const utilisateursTries = result.content.sort((a, b) => b.email.localeCompare(a.email));
    this.pageData = {
      ...result,
      content: utilisateursTries
    };
    this.nombreTotalEnregistrement = result.totalElements || 0;
    this.pageSelectionne = result.pageNumber + 1;
  }

  loadUtilisateursAvecFiltre(): void {
    const filtre = this.rechercheEmailControl.value?.trim() || '';
    this.page.pageNumber = this.pageSelectionne - 1;
    this.page.size = this.nombreElementParPage;
    this.loading = true;

    this.utilisateurService.getAll(this.page, filtre).subscribe({
      next: (result) => {
        this.loading = false;
        this.updatePageData(result);
      },
      error: (error: any) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  onPageChange(page: number): void {
    this.pageSelectionne = page;
    this.loadUtilisateursAvecFiltre();
  }

  onPageSizeChange(): void {
    this.pageSelectionne = 1;
    this.loadUtilisateursAvecFiltre();
  }

  openModal(modal: any, utilisateur: Utilisateur | null): void {
    this.utilisateurRegisterParam = utilisateur;
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.loadUtilisateursAvecFiltre();
  }


 /* deleteUtilisateur(utilisateur: Utilisateur): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action supprimera définitivement cet utilisateur.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then(result => {
    if (result.isConfirmed) {
      this.utilisateurService.delete(utilisateur.uuid).subscribe({
        next: () => {
          Swal.fire('Supprimé', 'Utilisateur supprimé avec succès.', 'success');

          const currentUserUuid = this.authService.getCurrentUserUuid(); 
          if (utilisateur.uuid === currentUserUuid) {

            this.authService.logout().subscribe(() => {
           this.router.navigate(['/login']);
               });
       
          } else {
            this.loadUtilisateursAvecFiltre(); // Sinon, recharge la liste
          }
        },
        error: () => Swal.fire('Erreur', 'La suppression a échoué.', 'error')
      });
    }
  });
}
*/
deleteUtilisateur(utilisateur: Utilisateur): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Cette action supprimera définitivement cet utilisateur.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then(result => {
    if (result.isConfirmed) {
      // Déconnecter l'utilisateur s'il est en ligne avant la suppression
      // Note: forceLogout non disponible dans cette version
      // if (this.isUserOnline(utilisateur.uuid)) {
      //   this.authService.forceLogout(utilisateur.uuid).subscribe({
      //     next: () => this.proceedWithDeletion(utilisateur),
      //     error: () => this.proceedWithDeletion(utilisateur)
      //   });
      // } else {
        this.proceedWithDeletion(utilisateur);
      // }
    }
  });
}

private proceedWithDeletion(utilisateur: Utilisateur): void {
  this.utilisateurService.delete(utilisateur.uuid).subscribe({
    next: () => {
      Swal.fire('Supprimé', 'Utilisateur supprimé avec succès.', 'success');
      // Note: getCurrentUserUuid non disponible dans cette version
      // const currentUserUuid = this.authService.getCurrentUserUuid();
      // if (utilisateur.uuid === currentUserUuid) {
      //   this.authService.logout().subscribe(() => {
      //     this.router.navigate(['/login']);
      //   });
      // } else {
        this.loadUtilisateursAvecFiltre();
        // this.loadOnlineUsers();
      // }
    },
    error: () => Swal.fire('Erreur', 'La suppression a échoué.', 'error')
  });
}
  blockUser(uuid: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment bloquer cet utilisateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, bloquer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.utilisateurService.block(uuid).subscribe({
          next: () => {
            this.toastService.success('Utilisateur bloqué avec succès');
            this.loadUtilisateursAvecFiltre();
          },
          error: () => this.toastService.error('Erreur lors du blocage')
        });
      }
    });
  }

  unblockUser(uuid: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment débloquer cet utilisateur ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, débloquer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.utilisateurService.unblock(uuid).subscribe({
          next: () => {
            this.toastService.success('Utilisateur débloqué avec succès');
            this.loadUtilisateursAvecFiltre();
          },
          error: () => this.toastService.error('Erreur lors du déblocage')
        });
      }
    });
  }

  connectUser(uuid: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment connecter cet utilisateur ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, connecter',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.utilisateurService.deconnecter(uuid).subscribe({
          next: () => {
            this.toastService.success('Utilisateur connecté avec succès');
            const utilisateur = this.pageData.content.find(u => u.uuid === uuid);
            if (utilisateur) {
              utilisateur.online = true;
              utilisateur.lastConnexion = new Date().toISOString();
            }
          },
          error: () => this.toastService.error('Erreur lors de la connexion')
        });
      }
    });
  }

  /* deconnecter(uuid: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment déconnecter cet utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.utilisateurService.deconnecter(uuid).subscribe({
          next: () => {
            Swal.fire('Déconnecté !', 'Utilisateur déconnecté avec succès.', 'success');
            this.loadUtilisateursAvecFiltre();
          },
          error: () => Swal.fire('Erreur', 'Échec de la déconnexion.', 'error')
        });
      }
    });
  }
*/
// Méthode mise à jour pour utiliser l'endpoint JWT
deconnecter(uuid: string): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Voulez-vous vraiment déconnecter cet utilisateur ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, déconnecter',
    cancelButtonText: 'Annuler'
  }).then(result => {
    if (result.isConfirmed) {
      // Note: forceLogout non disponible dans cette version
      // Utilisation de deconnecter à la place
      this.utilisateurService.deconnecter(uuid).subscribe({
        next: (response: any) => {
          Swal.fire('Déconnecté !', 'Utilisateur déconnecté avec succès.', 'success');
          this.loadUtilisateursAvecFiltre();
          this.loadOnlineUsers();
        },
        error: () => Swal.fire('Erreur', 'Échec de la déconnexion.', 'error')
      });
    }
  });
}
  getDureeConnexion(dateConnexion: string, online: boolean): string {
    if (!dateConnexion) return online ? 'Connecté' : 'Déconnecté';

    const maintenant = new Date();
    const date = new Date(dateConnexion);
    let diffMs = maintenant.getTime() - date.getTime();
    if (diffMs < 0) diffMs = 0;

    const secondes = Math.floor(diffMs / 1000);
    const minutes = Math.floor(secondes / 60);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);

    const prefix = online ? 'Connecté depuis' : 'Déconnecté depuis';

    if (jours > 0) return `${prefix} ${jours} jour${jours > 1 ? 's' : ''}`;
    if (heures > 0) return `${prefix} ${heures} heure${heures > 1 ? 's' : ''}`;
    if (minutes > 0) return `${prefix} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return online ? 'Connecté il y a quelques secondes' : 'Déconnecté il y a quelques secondes';
  }

   // Méthodes ajoutées pour la gestion des connexions
   private loadOnlineUsers(): void {
    // Note: getOnlineUsers non disponible dans cette version
    // this.authService.getOnlineUsers().subscribe({
    //   next: (response: any) => {
    //     if (response.success) {
    //       this.onlineUsers = response.onlineUsers;
    //     }
    //   },
    //   error: (error: any) => {
    //     console.error('Erreur lors du chargement des utilisateurs en ligne:', error);
    //   }
    // });
  }

  
  isUserOnline(userUuid: string): boolean {
    return this.onlineUsers.some(u => u.uuid === userUuid);
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.length;
  }


  private handleError(error: any): void {
    console.error('Erreur:', error);
    this.loading = false;
    this.pageData = {
      content: [],
      pageNumber: 0,
      pageSize: 0,
      totalElements: 0
    };
    this.nombreTotalEnregistrement = 0;
    this.toastService.error('Une erreur est survenue');
  }




getCurrentUserRoles(): string[] {
  const currentUser = this.authService.currentUser();
  return currentUser?.roles || [];
}

isAdmin(): boolean {
  return this.getCurrentUserRoles().includes('admin');
}

isMarketeur(): boolean {
  return this.getCurrentUserRoles().includes('marketeur');
}


isConsultation(): boolean {
  return this.getCurrentUserRoles().includes('consultation');
}



// Dans ListUtilisateurComponent
get isAdminUser(): boolean {
  return this.isAdmin();
}

}




