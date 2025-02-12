import { Component } from '@angular/core';

@Component({
  selector: 'app-reference-tabs',
  templateUrl: './reference-tabs.component.html',
  styleUrl: './reference-tabs.component.scss'
})
export class ReferenceTabsComponent {
  activeSelected=1;
  disabled = true;

  currentJustify = 'start';

  active=1;
  activev= "top";

  activeKeep=1;
}
