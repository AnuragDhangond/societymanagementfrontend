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

  // =========================
  // MEMBER VERIFY INPUT
  // =========================
  flat = '';
  wing = '';
  isVerified = false;

  //  MEMBER DETAILS (KEEP)
  memberDetails: {
    name: string;
    email: string;
    mobile: string;
    flat: string;
    wing: string;
  } | null = null;

  // =========================
  // COMPLAINT FORM
  // =========================
  complaint = {
    category: '',
    subject: '',
    description: ''
  };

  // =========================
  // DATA FROM BACKEND
  // =========================
  myComplaints: any[] = [];
  allComplaints: any[] = [];

  // =========================
  // MASTER DATA
  // =========================
  membersList: any[] = [];
  wings = ['Wing A', 'Wing B'];
  categories = ['Water', 'Electricity', 'Parking', 'Lift', 'Other'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isMember = role === 'member';

    //  REQUIRED FOR FLAT VERIFY
    this.loadMembers();

    //  ADMIN: LOAD ALL COMPLAINTS
    if (this.isAdmin) {
      this.loadAllComplaints();
    }
  }

  // =========================
  // LOAD MEMBERS
  // =========================
  loadMembers() {
    this.api.getMember().subscribe({
      next: (res: any) => {
        this.membersList = res;
      },
      error: () => alert('Failed to load members')
    });
  }

  // =========================
  // VERIFY FLAT (FRONTEND)
  // =========================
  verifyFlat() {
    const member = this.membersList.find(
      m => m.address === this.flat && m.services === this.wing
    );

    if (!member) {
      alert('Flat not registered. Contact administrator.');
      this.isVerified = false;
      this.memberDetails = null;
      return;
    }

    // AUTOFILL DETAILS
    this.memberDetails = {
      name: member.name,
      email: member.email,
      mobile: member.mobile,
      flat: member.address,
      wing: member.services
    };

    this.isVerified = true;

    // LOAD MEMBER COMPLAINTS
    this.loadMyComplaints();
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
