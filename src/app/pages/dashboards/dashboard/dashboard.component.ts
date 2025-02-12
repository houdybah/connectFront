import { Component, OnInit } from '@angular/core'



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
 
 

  // Données des statistiques
  stats = {
    paid: {
      count: 45,
      amount: 15000.75
    },
    pending: {
      count: 20,
      amount: 5000.50
    },
    ft: {
      count: 10,
      amount: 2500.25
    },
    flashcash: {
      count: 15,
      amount: 3500.00
    }
  };

  constructor() {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Dashboard', active: true }
    ];

  }


 


}
