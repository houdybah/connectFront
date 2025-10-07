import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ResultModalComponent} from "../result-modal/result-modal.component";


@Component({
  selector: 'app-index-qr-code',
  templateUrl: './index-qr-code.component.html',
  styleUrl: './index-qr-code.component.scss'
})
export class IndexQrCodeComponent {
  title = 'Scanner de QR Code';
  lastResult: string = '';

  constructor(private modalService: NgbModal) {}

  onScanSuccess(result: string): void {
    this.lastResult = result;

    let isOk = false;
    while(isOk){
      if(this.lastResult !== ''){
        isOk = true;
        this.openResultsModal(result);
      }
    }

    console.log(isOk)
   
    
  }

  openResultsModal(result: string): void {
    const modalRef = this.modalService.open(ResultModalComponent, { centered: true });
    modalRef.componentInstance.qrResult = result;
  }
}
