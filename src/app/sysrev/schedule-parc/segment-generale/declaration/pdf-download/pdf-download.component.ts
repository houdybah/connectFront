import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-download',
  templateUrl: './pdf-download.component.html',
  styleUrl: './pdf-download.component.scss'
})
export class PdfDownloadComponent {
  @Input() base64Data: string = '';
  @Input() pdfIcon:string = '';
  @Input() resultatFile:string = '';
  @Input() title:string = '';
  fileUrl!: SafeUrl;
  svgIcon!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    //console.log(this.resultatFile,this.pdfIcon,this.resultatFile,this.title)
    // Assurez-vous que la chaîne base64 contient l'en-tête approprié pour les PDF

    if(this.resultatFile !== 'BON_Compagnie_null'){
      // ✅ CORRECTION - Vérifier que base64Data n'est pas null/undefined avant startsWith
      const base64WithHeader = (this.base64Data && this.base64Data.startsWith('data:application/pdf'))
        ? this.base64Data
        : `data:application/pdf;base64,${this.base64Data || ''}`;
    
        // Créer une URL sécurisée à partir des données base64
        this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(base64WithHeader);
       // console.log(this.fileUrl)
      
        this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(this.pdfIcon);
       // console.log(this.svgIcon)
    }
    
   }
}