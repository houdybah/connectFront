import { Component, Host, Input, OnInit } from '@angular/core';
import { DeclarationListComponent } from '../Declaration-list/Declaration-list.component';
import {Declaration_1} from "../../../../models/Declaration_1";

@Component({
  selector: 'app-index-bon',
  templateUrl: './index-bon.component.html',
  styleUrl: './index-bon.component.scss'
})
export class IndexBonComponent implements OnInit {
 @Input() childProperty = new Declaration_1()
  parentProperty = new Declaration_1();

  declarationCmpListEditor!:DeclarationListComponent

 constructor(@Host() private declarationCmpList:DeclarationListComponent) {
  this.declarationCmpListEditor = declarationCmpList
 }
  ngOnInit(): void {
    this.parentProperty = this.childProperty
  }

  getDeclarations() {
    this.declarationCmpListEditor.closeModal()
     this.declarationCmpListEditor.onSearch();
  }
}







