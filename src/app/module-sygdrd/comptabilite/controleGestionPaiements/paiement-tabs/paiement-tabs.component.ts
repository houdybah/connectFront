import { Component } from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavLink, NgbNavLinkBase} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-paiement-tabs',
  templateUrl: './paiement-tabs.component.html',
  styleUrl: './paiement-tabs.component.scss'
})
export class PaiementTabsComponent {
    activeSelected=1;
    disabled = true;

    currentJustify = 'start';

    active=1;
    activev= "top";

    activeKeep=1;
}








