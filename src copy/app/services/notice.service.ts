import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private API_URL = `${environment.apiUrl}/notices`;

  constructor(private http: HttpClient) {}

  getNotices() {
    return this.http.get<any[]>(this.API_URL);
  }

  addNotice(notice: any) {
    return this.http.post(this.API_URL, notice);
  }
}
