import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Privilege } from '../models/Privilege';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  private readonly privilegeUrl: string = `${environment.defaultauth}/privilege`;

  constructor(private readonly http: HttpClient) { }

  public createPrivilege(privilege: Privilege): Observable<Privilege> {
    return this.http.post<Privilege>(`${this.privilegeUrl}`, privilege);
  }

  public updatePrivilege(privilege: Privilege): Observable<Privilege> {
    return this.http.put<Privilege>(`${this.privilegeUrl}/${privilege.uuid}`, privilege);
  }

  public getPrivilege(uuidPrivilege: string): Observable<Privilege> {
    return this.http.get<Privilege>(`${this.privilegeUrl}/${uuidPrivilege}`);
  }

  public getAllPrivileges(): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${this.privilegeUrl}`);
  }

  public getPrivilegesByApplication(uuidApplication: string): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${this.privilegeUrl}/application/${uuidApplication}`);
  }

  public deletePrivilege(uuidPrivilege: string): Observable<any> {
    return this.http.delete<void>(`${this.privilegeUrl}/${uuidPrivilege}`);
  }
}

