import { Component, EventEmitter, Output } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrl: './qrcode-scanner.component.scss'
})
export class QrcodeScannerComponent {
  @Output() scanSuccess = new EventEmitter<string>();
  
  allowedFormats = [BarcodeFormat.QR_CODE];
  scannerEnabled = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  onScanSuccess(result: string): void {
    this.scanSuccess.emit(result);
    if(this.scanSuccess.length ===1){
      this.scannerEnabled = true;
    }
    
  }

  resetScanner(): void {
    this.scannerEnabled = true;
  }
}
