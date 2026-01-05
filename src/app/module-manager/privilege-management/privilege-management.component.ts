import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application } from '../models/application';
import { Privilege } from '../models/Privilege';
import { PrivilegeService } from '../services/privilege.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privilege-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privilege-management.component.html',
  styleUrls: ['./privilege-management.component.scss']
})
export class PrivilegeManagementComponent implements OnInit {

  @Input() application!: Application;
  @Output() closeModal = new EventEmitter<void>();
  @Output() privilegeUpdated = new EventEmitter<void>();

  privileges: Privilege[] = [];
  isLoading: boolean = false;
  isEditing: boolean = false;
  editingPrivilege: Privilege | null = null;
  newPrivilege: Privilege = new Privilege();

  constructor(private privilegeService: PrivilegeService) {}

  ngOnInit(): void {
    this.loadPrivileges();
  }

  loadPrivileges(): void {
    if (!this.application || !this.application.uuid) {
      console.error('Application non définie');
      return;
    }

    this.isLoading = true;
    this.privilegeService.getPrivilegesByApplication(this.application.uuid).subscribe({
      next: (privileges: Privilege[]) => {
        this.privileges = privileges;
        console.log('Privilèges chargés:', privileges);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des privilèges:', error);
        Swal.fire('Erreur', 'Impossible de charger les privilèges', 'error');
        this.isLoading = false;
      }
    });
  }

  startEdit(privilege: Privilege): void {
    this.isEditing = true;
    this.editingPrivilege = { ...privilege };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingPrivilege = null;
  }

  saveEdit(): void {
    if (!this.editingPrivilege) return;

    if (!this.editingPrivilege.nom || !this.editingPrivilege.description) {
      Swal.fire('Attention', 'Veuillez remplir tous les champs', 'warning');
      return;
    }

    this.privilegeService.updatePrivilege(this.editingPrivilege).subscribe({
      next: (updated) => {
        const index = this.privileges.findIndex(p => p.uuid === updated.uuid);
        if (index !== -1) {
          this.privileges[index] = updated;
        }
        Swal.fire('Succès', 'Privilège modifié avec succès', 'success');
        this.cancelEdit();
        this.privilegeUpdated.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        Swal.fire('Erreur', 'Impossible de modifier le privilège', 'error');
      }
    });
  }

  deletePrivilege(privilege: Privilege): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer le privilège "${privilege.nom}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      heightAuto: false,
      backdrop: true
    }).then((result) => {
      if (result.isConfirmed && privilege.uuid) {
        this.privilegeService.deletePrivilege(privilege.uuid).subscribe({
          next: () => {
            this.privileges = this.privileges.filter(p => p.uuid !== privilege.uuid);
            Swal.fire('Supprimé', 'Le privilège a été supprimé', 'success');
            this.privilegeUpdated.emit();
          },
          error: (error: any) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire('Erreur', 'Impossible de supprimer le privilège', 'error');
          }
        });
      }
    });
  }

  startCreate(): void {
    this.newPrivilege = new Privilege();
    this.newPrivilege.uuidApplication = this.application.uuid;
  }

  saveNewPrivilege(): void {
    if (!this.newPrivilege.nom || !this.newPrivilege.description) {
      Swal.fire('Attention', 'Veuillez remplir tous les champs', 'warning');
      return;
    }

    this.newPrivilege.uuidApplication = this.application.uuid;

    this.privilegeService.createPrivilege(this.newPrivilege).subscribe({
      next: (created: Privilege) => {
        this.privileges.push(created);
        Swal.fire('Succès', 'Privilège créé avec succès', 'success');
        this.newPrivilege = new Privilege();
        this.privilegeUpdated.emit();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        Swal.fire('Erreur', 'Impossible de créer le privilège', 'error');
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}

