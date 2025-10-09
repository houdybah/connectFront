import { Component, Host, Input } from '@angular/core';
import { Unite } from '../../../models/Unite';


@Component({
  selector: 'app-reference-tabs',
  templateUrl: './reference-tabs.component.html',
  styleUrl: './reference-tabs.component.scss'
})
export class ReferenceTabsComponent {
  
 
  isEdit: boolean = false;
  unite!: Unite;
  isEnable: boolean = false;
  activeSelected=1;
  disabled = true;
 
  currentJustify = 'start';

  active=1;
  activev= "top";

  activeKeep=1;

}








