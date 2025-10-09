import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-declaration',
  templateUrl: './menu-declaration.component.html',
  styleUrl: './menu-declaration.component.scss'

})
export class MenuDeclarationComponent implements OnInit {
  active = 1; 
  unActive = false; 

  constructor() { }

  ngOnInit(): void { }
}




