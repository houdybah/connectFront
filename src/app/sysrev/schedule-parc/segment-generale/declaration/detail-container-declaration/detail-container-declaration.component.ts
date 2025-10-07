import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import {Declaration_1} from "../../../../models/Declaration_1";

@Component({
  selector: 'app-detail-Container-Declaration',
  templateUrl: './detail-Container-Declaration.component.html',
  styleUrl: './detail-Container-Declaration.component.scss',
  animations: [
      trigger('moveToTop', [
        transition(':enter', [
          style({ transform: 'translateY(20px)', opacity: 0 }),
          animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ])
      ]),
      trigger('highlightSelected', [
        transition(':enter', [
          style({ backgroundColor: '#fff9c4' }),
          animate('800ms ease-out', style({ backgroundColor: 'transparent' }))
        ])
      ])
    ]
})
export class DetailContainerDeclarationComponent {
   @Input() childProperty:Declaration_1 = new Declaration_1()
}







