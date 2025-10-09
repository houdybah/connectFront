import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Utilisateur } from '../../models/Utilisateur';
import { UtilisateurService } from '../../services/utilisateur.service';


@Component({
  selector: 'app-menu-utilisateur',
  templateUrl: './menu-utilisateur.component.html',
  styleUrls: ['./menu-utilisateur.component.scss']
})
export class MenuUtilisateurComponent implements OnInit {
  active = 1;
  unActive = false;
  role: string = '';

  constructor( private cdr: ChangeDetectorRef,
    private utilisateurService: UtilisateurService) {}

 ngOnInit(): void {
  this.utilisateurService.getUtilisateurConnecte().subscribe({
    next: (user: Utilisateur) => {
      console.log('Utilisateur connecté reçu :', user);
      if (user && user.roles && user.roles.length > 0) {
        this.role = user.roles[0].toLowerCase(); // force la casse
        console.log('Role détecté:', this.role);
      } else {
        console.warn('Utilisateur sans rôle ou roles vide');
      }
    },
    error: (err) => {
      console.error('Erreur récupération utilisateur connecté', err);
    }
  });
}


  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isMarketeur(): boolean {
    return this.role === 'marketeur';
  }

isConsultation(): boolean {
    return this.role === 'consultation';
  }


  
}





