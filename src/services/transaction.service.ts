import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from 'src/models/Company';
import { Transaction } from 'src/models/Transaction';

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

  createTransaction(transaction:Transaction): Observable<any> {
    return this.http.post<Transaction>(`${this.BASE_URL}`, transaction);
  }


  checkTransactionAmount(reference:string, montant:number): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/checkBill/${montant}/${reference}`);
  }

}


