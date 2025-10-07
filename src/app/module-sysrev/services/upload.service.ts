import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private readonly _fileNameUrl: string = `${environment.defaultauth}` + `/upload`;

  constructor(private http: HttpClient) { }

  SaveFile(file: File): Observable<File> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    return this.http.post<File>(this._fileNameUrl, formData, {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data'
      })
    })
      ;
  }
}


