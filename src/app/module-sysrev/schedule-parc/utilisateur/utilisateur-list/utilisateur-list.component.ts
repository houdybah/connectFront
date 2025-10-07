import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utilisateur } from '../../../models/Utilisateur';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { UtilisateurFormComponent } from '../utilisateur-form/utilisateur-form.component';
import { UtilisateurPage } from '../../../models/UtilisateurPage';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrl: './utilisateur-list.component.scss'
})
export class UtilisateurListComponent {
  users: Utilisateur[] = [];
  totalUsers: number = 0;
  page: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';
  searchTerms = new Subject<string>();
  loading: boolean = false;

  constructor(
    private userService: UtilisateurService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Configurer la recherche avec debounce
    this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.page = 1;
      this.loadUsers();
    });


    // this.userService.getUtilisateurs(this.page - 1, this.pageSize, this.searchTerm).subscribe(
    //   res => {
    //     console.log(res)
    //     this.users = res.data;
    //     // this.totalUsers = res.page.totalElements;
      
    //   }
    // )
    
   this.loadUsers();
  }

  editUser(user: Utilisateur): void {
  const modalRef = this.modalService.open(UtilisateurFormComponent, { size: 'md', centered: true });
  modalRef.componentInstance.title = 'Modifier l\'Utilisateur';
  modalRef.componentInstance.isEditMode = true;
  modalRef.componentInstance.userToEdit = { ...user }; // Copie de l'Utilisateur pour éviter les mutations

  modalRef.result.then(
    result => {
      if (result === 'saved') {
        this.loadUsers(); // Recharger la liste après modification
      }
    },
    () => {} // Dismiss
  );
}
  loadUsers(): void {
    this.loading = true;
    this.userService.getUtilisateurs(this.page - 1, this.pageSize, this.searchTerm)
      .subscribe(
        (userPage: UtilisateurPage) => {
          console.log(userPage)
          this.users = userPage.data;
          this.totalUsers = userPage.page.totalElements;
          this.loading = false;
        },
        (error: any) => {
          console.error('Erreur lors du chargement des utilisateurs', error);
          this.loading = false;
        }
      );
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadUsers();
  }

  openUserForm(): void {
    const modalRef = this.modalService.open(UtilisateurFormComponent, { size: 'md', centered: true });
    modalRef.componentInstance.title = 'Ajouter un Utilisateur';
    
    modalRef.result.then(
      result => {
        if (result === 'saved') {
          this.loadUsers();
        }
      },
      () => {} // Dismiss
    );
  }

  toggleUserBlock(user: Utilisateur): void {
    this.userService.toggleUserBlock(user.uuid, !user.enabled)
      .subscribe(
        (updatedUser: Utilisateur) => {
          console.log(updatedUser)
          const index = this.users.findIndex(u => u.uuid === updatedUser.uuid);
          if (index !== -1) {
            this.users[index].enabled = user.enabled;
          }
          this.loadUsers();
        },
        (error: any) => {
          console.error(`Erreur lors de la modification du statut de l'Utilisateur`, error);
        }
      );
  }

  deleteUser(uuid: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet Utilisateur?')) {
      this.userService.delete(uuid)
        .subscribe(
          () => {
            this.users = this.users.filter(user => user.uuid !== uuid);
            this.totalUsers--;
          },
          (error: any) => {
            console.error('Erreur lors de la suppression de l\'Utilisateur', error);
          }
        );
    }
  }

  check(username:string):boolean{
    let isUser = false;
    // this.userService.currentLogin().subscribe(res => {
    //   console.log(res)
    //   if(username === res.email){
    //    isUser = true
    //   }
    // })

    return isUser;
  }
}







