import { Component, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'; 
import { CommonModule } from '@angular/common'; 
import { ListUtilisateurComponent } from '../list-utilisateur/list-utilisateur.component';
import { NifListComponent } from '../nif-list/nif-list.component';

@Component({
  standalone: true,
  selector: 'app-menu-utilisateur',
  templateUrl: './menu-utilisateur.component.html',
  styleUrls: ['./menu-utilisateur.component.scss'], 
  imports: [CommonModule, NgbNavModule,
    ListUtilisateurComponent, 
    NifListComponent 
  ] 
})
export class MenuUtilisateurComponent implements OnInit {
  active = 1; 
  unActive = false; 

  constructor() { }

  ngOnInit(): void { }
}
