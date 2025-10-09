import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  exportAsExcelFile(data: any[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
