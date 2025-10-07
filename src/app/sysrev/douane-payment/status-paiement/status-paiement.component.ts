import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-paiement',
  templateUrl: './status-paiement.component.html',
  styleUrl: './status-paiement.component.scss'
})
export class StatusPaiementComponent implements OnInit{

  @Input() childProperty:any;


  ngOnInit(){
    
  }




}
