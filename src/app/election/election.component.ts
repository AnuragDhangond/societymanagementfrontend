import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit {
  electionDates: any = null;
  approvedCandidates: any[] = [];
  allCandidates: any[] = []; // Admin only
  
  applicationForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  roles = ['Chairman', 'Secretary', 'Treasurer (Kajindar)', 'Body Member'];
  
  // User Credentials from Session
  userName = '';
  userFlat = '';
  userWing = '';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.applicationForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserCredentials();
    this.fetchElectionData();
  }

  loadUserCredentials() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || '';
    this.userFlat = localStorage.getItem('flat') || '';
    this.userWing = localStorage.getItem('wing') || '';
    this.isAdmin = localStorage.getItem('role') === 'admin';
  }

  fetchElectionData(): void {
    this.apiService.getElectionDates().subscribe({
      next: (dates) => this.electionDates = dates,
      error: (err) => console.error('Error fetching dates', err)
    });

    if (this.isAdmin) {
      this.fetchAdminData();
    } else {
      this.apiService.getApprovedCandidates().subscribe({
        next: (candidates) => this.approvedCandidates = candidates,
        error: (err) => console.error('Error fetching approved candidates', err)
      });
    }
  }

  fetchAdminData(): void {
    this.apiService.getAllCandidates().subscribe({
      next: (candidates) => this.allCandidates = candidates,
      error: (err) => console.error('Error fetching all candidates', err)
    });
  }

  onSubmitApplication(): void {
    if (this.applicationForm.invalid) return;

    if (!this.userName || !this.userFlat || !this.userWing) {
      this.submitError = 'Session invalid. Please login again to apply.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      name: this.userName,
      flatNo: this.userFlat,
      wing: this.userWing,
      role: this.applicationForm.value.role
    };

    this.apiService.applyForElection(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.applicationForm.reset();
        
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.message || 'Failed to submit application.';
      }
    });
  }

  approveCandidate(id: string): void {
    this.apiService.approveCandidate(id).subscribe({
      next: () => {
        this.fetchAdminData(); // Refresh the list
      },
      error: (err) => console.error('Error approving candidate', err)
    });
  }
}
