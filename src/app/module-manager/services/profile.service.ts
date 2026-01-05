import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/Profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly profileUrl: string = `${environment.defaultauth}/profile`;

  constructor(private readonly http: HttpClient) { }

  public createProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(`${this.profileUrl}`, profile);
  }

  public updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.profileUrl}/${profile.uuid}`, profile);
  }

  public getProfile(uuidProfile: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.profileUrl}/${uuidProfile}`);
  }

  public getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.profileUrl}`);
  }

  public getProfilesByApplication(uuidApplication: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.profileUrl}/application/${uuidApplication}`);
  }

  public addPrivilegeToProfile(uuidProfile: string, uuidPrivilege: string): Observable<Profile> {
    return this.http.post<Profile>(`${this.profileUrl}/${uuidProfile}/privilege/${uuidPrivilege}`, {});
  }

  public removePrivilegeFromProfile(uuidProfile: string, uuidPrivilege: string): Observable<Profile> {
    return this.http.delete<Profile>(`${this.profileUrl}/${uuidProfile}/privilege/${uuidPrivilege}`);
  }

  public deleteProfile(uuidProfile: string): Observable<any> {
    return this.http.delete<void>(`${this.profileUrl}/${uuidProfile}`);
  }
}

