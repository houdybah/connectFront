import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qrcode-scanner-two',
  templateUrl: './qrcode-scanner-two.component.html',
  styleUrl: './qrcode-scanner-two.component.scss'
})
export class QrcodeScannerTwoComponent {
  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;
  @ViewChild('resultModal') resultModal: any;
  @ViewChild('manualInputField') manualInputField!: ElementRef;

  scanActive = false;
  scanResult: string = '';
  scannerEnabled = true;
  manualInput: string = 'RDV-'; // Nouveau champ pour la saisie manuelle
  inputMethod: 'scan' | 'manual' = 'scan'; // Pour tracker la méthode d'entrée
  
  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX
  ];
     
  resultDetails: any = null;
  scanningTimer: any = null;
  timeoutDuration = 5000; // 5 secondes
  countdown: number = 5;

  constructor(private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.startScanner();
  }

  startScanner() {
    this.scanActive = true;
    this.scanResult = '';
    this.resultDetails = null;
    this.inputMethod = 'scan';
  }

  stopScanner() {
    this.scanActive = false;
    if (this.scanningTimer) {
      clearInterval(this.scanningTimer);
      this.scanningTimer = null;
    }
  }

  // Nouvelle méthode pour valider la saisie manuelle
  validateManualInput() {
    if (!this.manualInput || this.manualInput.trim() === '') {
      return;
    }

    this.inputMethod = 'manual';
    this.scanResult = this.manualInput.trim();
    
    // Création des détails du résultat pour la saisie manuelle
    this.resultDetails = {
      type: 'Référence',
      reference: this.manualInput.trim(),
      value: this.manualInput.trim(),
      scannedAt: new Date().toLocaleString()
    };

    // Arrêt du scanner si actif
    this.scanActive = false;
    
    // Ouverture de la modal avec les résultats
    this.openResultModal();
    
    // Démarrage du timer pour fermer la modal
    this.startCountdown();
  }

  onScanSuccess(result: any) {
    this.inputMethod = 'scan';
    this.scanResult = result;
         
    // Parsing du résultat pour l'affichage
    try {
      // Pour les codes QR contenant des informations structurées (comme JSON)
      const parsedResult = JSON.parse(result);
      this.resultDetails = {
        ...parsedResult,
        scannedAt: new Date().toLocaleString()
      };
      console.log(this.resultDetails.reference);
    } catch (e) {
      // Si ce n'est pas un JSON, on l'affiche comme texte
      this.resultDetails = {
        type: this.detectType(result),
        value: result,
        reference: result, // Ajout de la référence pour compatibilité
        scannedAt: new Date().toLocaleString()
      };
    }
         
    // Arrêt immédiat du scanner
    this.scanActive = false;
         
    // Ouverture de la modal avec les résultats
    this.openResultModal();
         
    // Démarrage du timer
    this.startCountdown();
  }

  // Méthode séparée pour démarrer le compte à rebours
  startCountdown() {
    this.countdown = 5;
    this.scanningTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.scanningTimer);
        this.modalService.dismissAll();
        const reference = this.resultDetails.reference || this.resultDetails.value;
        
        this.router.navigate(['/douane/resultat', reference]);
      }
    }, 1000);
  }

  openResultModal() {
    this.modalService.open(this.resultModal, { 
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  resetScanner() {
    if (this.scanningTimer) {
      clearInterval(this.scanningTimer);
      this.scanningTimer = null;
    }
    this.modalService.dismissAll();
    this.scanResult = '';
    this.resultDetails = null;
    this.scanActive = false;
    this.manualInput = ''; // Reset du champ de saisie manuelle
    this.inputMethod = 'scan';
  }

  // Nouvelle méthode pour démarrer un nouveau scan/saisie
  startNewScan() {
    this.resetScanner();
    setTimeout(() => {
      if (this.inputMethod === 'manual') {
        // Focus sur le champ de saisie manuelle
        this.manualInputField.nativeElement.focus();
      } else {
        // Redémarrer le scanner
        this.scanActive = true;
      }
    }, 100);
  }

  // Méthode obsolète remplacée par startNewScan
  scanAgain() {
    this.startNewScan();
  }

  // Détection du type de code scanné
  detectType(value: string): string {
    // Quelques détections basiques
    if (/^https?:\/\//.test(value)) {
      return 'URL';
    } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return 'Email';
    } else if (/^\d{10,15}$/.test(value)) {
      return 'Numéro';
    } else {
      return 'Référence';
    }
  }
}