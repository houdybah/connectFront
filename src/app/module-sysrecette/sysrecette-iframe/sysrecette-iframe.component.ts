import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sysrecette-iframe',
  templateUrl: './sysrecette-iframe.component.html',
  styleUrls: ['./sysrecette-iframe.component.scss']
})
export class SysrecetteIframeComponent implements OnInit, OnDestroy {
  
  sysrecetteUrl: SafeResourceUrl;
  isLoading = true;
  hasError = false;

  constructor(private sanitizer: DomSanitizer) {
    console.log('[SYSRECETTE IFRAME] Constructor appelé');
    this.sysrecetteUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:49706/');
    console.log('[SYSRECETTE IFRAME] URL configurée:', 'http://localhost:49706/');
  }

  ngOnInit(): void {
    console.log('[SYSRECETTE IFRAME] ngOnInit appelé');
    console.log('[SYSRECETTE IFRAME] Composant initialisé, iframe devrait se charger...');
    
    // Afficher le loading pendant 3 secondes minimum pour debug
    setTimeout(() => {
      console.log('[SYSRECETTE IFRAME] Timeout écoulé, masquage du loading');
      this.isLoading = false;
    }, 3000);
  }

  onIframeLoad(): void {
    console.log('[SYSRECETTE IFRAME] onIframeLoad - Iframe chargée avec succès!');
    this.isLoading = false;
    this.hasError = false;
  }

  onIframeError(): void {
    console.error('[SYSRECETTE IFRAME] onIframeError - Erreur de chargement de l\'iframe');
    this.isLoading = false;
    this.hasError = true;
  }

  ngOnDestroy(): void {
    console.log('[SYSRECETTE IFRAME] ngOnDestroy appelé');
  }
}

