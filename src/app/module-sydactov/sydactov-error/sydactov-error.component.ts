import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sydactov-error',
  templateUrl: './sydactov-error.component.html',
  styleUrls: ['./sydactov-error.component.scss']
})
export class SydactovErrorComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/modules']);
  }

  retry(): void {
    window.location.reload();
  }
}

