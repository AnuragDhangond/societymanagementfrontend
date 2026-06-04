import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ElectionDates {
  nominationStart: string;
  nominationEnd: string;
  electionDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  flatNo: string;
  role: 'Chairman' | 'Secretary' | 'Treasurer (Kajindar)' | 'Body Member';
  status: 'PENDING' | 'APPROVED';
}

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  // Mock Dynamic Data
  private mockDates: ElectionDates = {
    nominationStart: '2024-11-01',
    nominationEnd: '2024-11-15',
    electionDate: '2024-11-30'
  };

  private mockCandidates: Candidate[] = [
    { id: '1', name: 'Ramesh Patel', flatNo: 'A-101', role: 'Chairman', status: 'APPROVED' },
    { id: '2', name: 'Suresh Kumar', flatNo: 'B-205', role: 'Secretary', status: 'PENDING' }
  ];

  constructor() { }

  getElectionDates(): Observable<ElectionDates> {
    return of(this.mockDates).pipe(delay(500));
  }

  getAllCandidates(): Observable<Candidate[]> {
    return of(this.mockCandidates).pipe(delay(500));
  }

  getApprovedCandidates(): Observable<Candidate[]> {
    const approved = this.mockCandidates.filter(c => c.status === 'APPROVED');
    return of(approved).pipe(delay(500));
  }

  submitInterest(candidate: Omit<Candidate, 'id' | 'status'>): Observable<Candidate> {
    const newCandidate: Candidate = {
      ...candidate,
      id: Math.random().toString(36).substring(2, 9),
      status: 'PENDING'
    };
    this.mockCandidates.push(newCandidate);
    return of(newCandidate).pipe(delay(800));
  }

  approveCandidate(id: string): Observable<boolean> {
    const candidate = this.mockCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.status = 'APPROVED';
      return of(true).pipe(delay(500));
    }
    return of(false);
  }
}
