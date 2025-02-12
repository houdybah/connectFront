import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurRegister } from 'src/models/utilisateur-register';
import { FormUtilisateurComponent } from '../form-utilisateur/form-utilisateur.component';
import { Utilisateur } from 'src/models/Utilisateur';

@Component({
  selector: 'app-list-utilisateur',
  standalone: true,
  imports: [FormUtilisateurComponent ],
  templateUrl: './list-utilisateur.component.html',
  styleUrl: './list-utilisateur.component.scss'
})
export class ListUtilisateurComponent implements OnInit {
 
  utilisateurRegisterParam: Utilisateur | null = null;
  
  
   
  constructor(
    private modalService: NgbModal,
   
  ) {
   
  }

  ngOnInit(): void {
    //this.getAllCategories();
  }


  openModal(modal: any, categorie: Utilisateur | null): void {
    this.utilisateurRegisterParam = categorie;
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  //  this.getAllCategories();
  }


}
