import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company } from '../models/Company';
import { DetailTransaction } from '../models/DetailTransaction';
import { ResponseDto } from '../models/ResponseDto';
import { Transaction } from '../models/Transaction';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly BASE_URL = `${environment.defaultauth}/transaction`;

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<any> {
  
    
    return this.http.get(`${this.BASE_URL}`);
  }

  getcompany(reference:string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/entreprise/${reference}`);
  }

  createTransaction(transaction:Transaction): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.BASE_URL}`, transaction);
  }


  createTransactionGucegAndDeclarant(transactions:DetailTransaction[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.BASE_URL}/gucegAndDeclarant`, transactions);
  }


  checkTransactionAmount(reference:string, montant:number): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/checkBill/${montant}/${reference}`);
  }


  getTransaction(uuid:string){
    return this.http.get(`${this.BASE_URL}/${uuid}`);
  }

}




