import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generatePDF(declaration: any) {
    const doc = new jsPDF();
    doc.text('Quittance de Déclaration', 10, 10);
    // doc.au({
    //   head: [['Champs', 'Valeur']],
    //   body: Object.entries(declaration).map(([key, value]) => [key, value])
    // });
    // doc.save(`quittance_${declaration.numeroBL}.pdf`);
  }
}
