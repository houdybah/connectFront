import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sysrecette-error',
  templateUrl: './sysrecette-error.component.html',
  styleUrls: ['./sysrecette-error.component.scss']
})
export class SysrecetteErrorComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/modules']);
  }

  retry(): void {
    window.location.reload();
  }
}

