import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = "http://localhost:5000/api/members";

  constructor(private http: HttpClient) { }

  // CREATE MEMBER
  postMember(data: any) {
    return this.http.post(this.apiURL, data);
  }

  // GET ALL MEMBERS
  getMember() {
    return this.http.get(this.apiURL);
  }

  // DELETE MEMBER (uses MongoDB _id)
  deleteMember(id: string) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  // UPDATE MEMBER (uses MongoDB _id)
  updateMember(id: string, data: any) {
    return this.http.put(`${this.apiURL}/${id}`, data);
  }
  
  loginUser(data: any) {
    return this.http.post<any>("http://localhost:5000/api/login/login", data);
  }

}
