import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {

  //  ROLE
  isAdmin = false;
  isMember = false;

  // MEMBER STATE — auto-filled from localStorage
  isVerified = false;

  memberDetails: {
    name: string;
    email: string;
    mobile: string;
    flat: string;
    wing: string;
  } | null = null;

  // COMPLAINT FORM
  complaint = {
    category: '',
    subject: '',
    description: ''
  };

  // DATA FROM BACKEND
  myComplaints: any[] = [];
  allComplaints: any[] = [];

  // MASTER DATA
  membersList: any[] = [];
  categories = ['Water', 'Electricity', 'Parking', 'Lift', 'Other'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isMember = role === 'member';

    // Load members list
    this.loadMembers();

    // ADMIN: load all complaints
    if (this.isAdmin) {
      this.loadAllComplaints();
    }

    // MEMBER: auto-verify from localStorage
    if (this.isMember) {
      this.autoVerifyFlat();
    }
  }

  // =========================
  // LOAD MEMBERS
  // =========================
  loadMembers() {
    this.api.getMember().subscribe({
      next: (res: any) => {
        this.membersList = res;

        // Re-try auto-verify after members are loaded
        if (this.isMember && !this.isVerified) {
          this.autoVerifyFlat();
        }
      },
      error: () => alert('Failed to load members')
    });
  }

  // =========================
  // AUTO VERIFY (from localStorage)
  // =========================
  autoVerifyFlat() {
    const flat = localStorage.getItem('flat');
    const wing = localStorage.getItem('wing');

    if (!flat || !wing || flat === 'null' || wing === 'null' || flat === 'undefined' || wing === 'undefined') return;

    const member = this.membersList.find(
      m => m.address === flat && m.services === wing
    );

    if (member) {
      this.memberDetails = {
        name: member.name,
        email: member.email,
        mobile: member.mobile,
        flat: member.address,
        wing: member.services
      };
      this.isVerified = true;
      this.loadMyComplaints();
    } else {
      // Flat exists in user account but not in members collection yet
      // Use the stored user info directly
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.memberDetails = {
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        flat: flat,
        wing: wing
      };
      this.isVerified = true;
      this.loadMyComplaints();
    }
  }

  // =========================
  // MEMBER: SUBMIT COMPLAINT
  // =========================
  submitComplaint() {
    if (!this.isVerified || !this.memberDetails) return;

    const payload = {
      flat: this.memberDetails.flat,
      wing: this.memberDetails.wing,
      category: this.complaint.category,
      subject: this.complaint.subject,
      description: this.complaint.description
    };

    this.api.addComplaint(payload).subscribe({
      next: () => {
        alert('Complaint submitted successfully');
        this.complaint = { category: '', subject: '', description: '' };
        this.loadMyComplaints();
      },
      error: () => alert('Failed to submit complaint')
    });
  }

  // =========================
  // MEMBER: LOAD OWN COMPLAINTS
  // =========================
  loadMyComplaints() {
    if (!this.memberDetails) return;

    this.api.getMyComplaints(
      this.memberDetails.flat,
      this.memberDetails.wing
    ).subscribe({
      next: (res: any) => {
        this.myComplaints = res;
      },
      error: () => alert('Failed to load complaints')
    });
  }

  // =========================
  // ADMIN: LOAD ALL COMPLAINTS
  // =========================
  loadAllComplaints() {
    this.api.getAllComplaints().subscribe({
      next: (res: any) => {
        this.allComplaints = res;
      },
      error: () => alert('Failed to load complaints')
    });
  }

  // =========================
  // ADMIN: UPDATE STATUS
  // =========================
  updateStatus(item: any) {
    this.api.updateComplaintStatus(
      item._id,
      item.status,
      item.remark
    ).subscribe({
      next: () => alert('Status updated'),
      error: () => alert('Failed to update status')
    });
  }
}
