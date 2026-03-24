import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseURL = environment.apiUrl; // already includes /api

  constructor(private http: HttpClient) {}

  // ================= MEMBERS =================

  postMember(data: any) {
    return this.http.post(`${this.baseURL}/members`, data);
  }

  getMember() {
    return this.http.get<any[]>(`${this.baseURL}/members`);
  }

  deleteMember(id: string) {
    return this.http.delete(`${this.baseURL}/members/${id}`);
  }

  updateMember(id: string, data: any) {
    return this.http.put(`${this.baseURL}/members/${id}`, data);
  }

  // ================= MAINTENANCE =================

  addMaintenance(data: any) {
    return this.http.post(`${this.baseURL}/maintenance/add`, data);
  }

  getMaintenance() {
    return this.http.get<any[]>(`${this.baseURL}/maintenance`);
  }

  getMaintenanceByFlat(flat: string, wing: string) {
    return this.http.get(
      `${this.baseURL}/maintenance/flat?flat=${flat}&wing=${encodeURIComponent(wing)}`
    );
  }

  getAllMaintenance() {
  return this.getMaintenance();
  }


  updateMaintenance(data: any) {
    return this.http.put(`${this.baseURL}/maintenance/update`, data);
  }

  deleteMaintenance(flat: string, wing: string, month: string, year: number) {
    return this.http.request(
      'delete',
      `${this.baseURL}/maintenance/delete`,
      {
        body: { flat, wing, month, year }
      }
    );
  }

  // ================= AUTH =================

  loginUser(data: any) {
    return this.http.post(`${this.baseURL}/login/login`, data);
  }

  signupUser(data: any) {
    return this.http.post(`${this.baseURL}/signup`, data);
  }

  // ================= COMPLAINTS =================

  verifyFlat(flat: string, wing: string) {
    return this.http.get(
      `${this.baseURL}/complaints/verify?flat=${flat}&wing=${encodeURIComponent(wing)}`
    );
  }

  addComplaint(data: any) {
    return this.http.post(`${this.baseURL}/complaints/add`, data);
  }

  getMyComplaints(flat: string, wing: string) {
    return this.http.get(
      `${this.baseURL}/complaints/my?flat=${flat}&wing=${encodeURIComponent(wing)}`
    );
  }

  getAllComplaints() {
    return this.http.get(`${this.baseURL}/complaints`);
  }

  updateComplaintStatus(id: string, status: string, remark: string) {
    return this.http.put(
      `${this.baseURL}/complaints/${id}`,
      { status, remark }
    );
  }

  // ================= EXPENSES =================

  getExpenses() {
    return this.http.get<any[]>(`${this.baseURL}/expenses`);
  }

  addExpense(data: any) {
    return this.http.post<any>(`${this.baseURL}/expenses`, data);
  }

  updateExpense(id: string, data: any) {
    return this.http.put<any>(`${this.baseURL}/expenses/${id}`, data);
  }

  deleteExpense(id: string) {
    return this.http.delete<any>(`${this.baseURL}/expenses/${id}`);
  }

  // ================= MAINTENANCE REPORTS =================

  getMonthlyWingSummary(year: number, wing: string) {
    return this.http.get<any[]>(
      `${this.baseURL}/maintenance/summary/monthly?year=${year}&wing=${encodeURIComponent(wing)}`
    );
  }

  getYearlyWingSummary(year: number, wing: string) {
    return this.http.get<any[]>(
      `${this.baseURL}/maintenance/summary/yearly?year=${year}&wing=${encodeURIComponent(wing)}`
    );
  }
}
