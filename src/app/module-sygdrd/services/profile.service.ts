import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Profile} from "../models/Profile";
import {Observable} from "rxjs";
import {Page} from "../models/Page";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly profileNameUrl: string =`${environment.defaultauth}` + `/profile`;

  constructor(private http : HttpClient) { }

  public newProfile (profile : Profile ) : Observable <Profile> {
    return this.http.post<Profile>(`${this.profileNameUrl}`,profile)
  }
  public updateProfile(profile : Profile) : Observable <Profile> {
    return this.http.put<Profile> (`${this.profileNameUrl}/${profile.uuid}`,profile)
  }
  public getOneProfile(uuidProfile : string): Observable  <Profile> {
    return  this.http.get<Profile>(`${this.profileNameUrl}/${uuidProfile}`)
  }
  public getAllProfile () : Observable  <any> {
    return this.http.get<Profile[]>(`${this.profileNameUrl}`)
  }
  public deleteProfile (uuidProfile : string): Observable <any> {
    return this.http.delete<void>(`${this.profileNameUrl}/${uuidProfile}`)
  }

  getProfiless(page:Page, key:String): Observable<any> {
    let url = `${this.profileNameUrl}/?key=${key}&page=${page.pageNumber}&size=${page.size}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    });
  }
  
  
}







