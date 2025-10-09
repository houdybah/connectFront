import { Component } from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavLink, NgbNavLinkBase} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-parametres-tabs',
  templateUrl: './parametres-tabs.component.html',
  styleUrl: './parametres-tabs.component.scss'
})
export class ParametresTabsComponent {

    activeSelected=1;
    disabled = true;

    currentJustify = 'start';

    active=1;
    activev= "top";

    activeKeep=1;
}








