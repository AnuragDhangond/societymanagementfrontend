import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  // ================= ROLE FLAGS =================
  isAdmin = false;
  isMember = false;
  isEditMode = false;

  // ================= ADMIN STATE =================
  showAddForm = false;
  selectedFlat: any = null;
  totalAmount = 0;

  membersList: any[] = [];
  maintenanceList: any[] = [];

  // ================= MEMBER STATE =================
  memberFlat = '';
  memberWing = '';
  memberHistory: any[] = [];
  memberDetails: any = null;
  showMemberTable = false;
  showMemberAddForm = false;

  // ================= CONSTANT DATA =================
  wings = ['Wing A', 'Wing B'];

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  years = [2024, 2025, 2026];

  // ================= SUMMARY STATE (NEW) =================
  // YEARLY
selectedYear = new Date().getFullYear();
selectedYearWing = 'Wing A';

// MONTHLY
selectedMonth = new Date().toLocaleString('default', { month: 'long' });
selectedMonthWing = 'Wing A';



  monthlyTotal = 0;
  yearlyTotal = 0;

  // ================= FORM MODEL =================
  form = {
    flat: '',
    wing: '',
    month: '',
    year: '',
    amount: null as number | null
  };

  constructor(private api: ApiService) {}

  // ================= INIT =================
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isMember = role === 'member';

    this.loadMembers();

    if (this.isAdmin) {
      this.loadMaintenance();
      this.loadSummary(); // ✅ ADDED (only 1 line)
    }
  }

  // ================= LOAD MEMBERS =================
  loadMembers() {
    this.api.getMember().subscribe({
      next: (res: any) => this.membersList = res,
      error: () => alert('Failed to load members')
    });
  }

  // ================= LOAD MAINTENANCE =================
  loadMaintenance() {
    this.api.getMaintenance().subscribe({
      next: (res: any[]) => {
        this.maintenanceList = res;
        this.calculateTotal();
      },
      error: () => alert('Failed to load maintenance data')
    });
  }

  calculateTotal() {
    this.totalAmount = this.maintenanceList.reduce(
      (sum, x) => sum + x.totalAmount,
      0
    );
  }

  // ================= SUMMARY (NEW) =================
  loadSummary() {

  // ===== YEARLY (OBJECT RESPONSE) =====
  this.api.getYearlyWingSummary(this.selectedYear, this.selectedYearWing)
    .subscribe({
      next: (res: any) => {
        this.yearlyTotal = res?.totalAmount || 0;
      },
      error: () => this.yearlyTotal = 0
    });

  // ===== MONTHLY (ARRAY RESPONSE) =====
  this.api.getMonthlyWingSummary(this.selectedYear, this.selectedMonthWing)
    .subscribe((res: any[]) => {
      const monthData = res.find(
        x => x._id.toLowerCase() === this.selectedMonth.toLowerCase()
      );
      this.monthlyTotal = monthData ? monthData.totalAmount : 0;
    });
}




  // ================= SELECT FLAT =================
  selectFlat(item: any) {
    if (!this.isAdmin) return;
    this.selectedFlat = item;
  }

  closeHistory() {
    this.selectedFlat = null;
  }

  // ================= ADD FORM =================
  toggleForm() {
    if (!this.isAdmin) return;
    this.resetFormState();
    this.showAddForm = true;
  }

  cancelForm() {
    this.resetFormState();
  }

  // ================= EDIT =================
  editMaintenance(record: any) {
    if (!this.isAdmin || !this.selectedFlat) return;

    this.isEditMode = true;

    this.form = {
      flat: this.selectedFlat.flat,
      wing: this.selectedFlat.wing,
      month: record.month,
      year: record.year,
      amount: record.amount
    };

    this.showAddForm = true;
    this.selectedFlat = null;
  }

  // ================= DELETE =================
  deleteMaintenance(record: any) {
    if (!this.selectedFlat) return;

    if (!confirm('Are you sure you want to delete this record?')) return;

    const { flat, wing } = this.selectedFlat;

    this.api.deleteMaintenance(flat, wing, record.month, record.year)
      .subscribe({
        next: () => {
          alert('Maintenance deleted');
          this.loadMaintenance();
          this.loadSummary(); // ✅ keep summary in sync
          this.selectedFlat = null;
        },
        error: () => alert('Failed to delete maintenance')
      });
  }

  // ================= SUBMIT =================
  submitMaintenance() {

    const flat = this.isMember ? this.memberDetails?.flat : this.form.flat;
    const wing = this.isMember ? this.memberDetails?.wing : this.form.wing;

    if (!flat || !wing || !this.form.month || !this.form.year || !this.form.amount) {
      alert('All fields are required');
      return;
    }

    if (this.isEditMode) {
      this.api.updateMaintenance({
        flat,
        wing,
        month: this.form.month,
        year: this.form.year,
        amount: this.form.amount
      }).subscribe({
        next: () => {
          alert('Maintenance updated successfully');
          this.resetFormState();
          this.loadMaintenance();
          this.loadSummary(); // ✅ sync
        },
        error: err =>
          alert(err.error?.message || 'Failed to update maintenance')
      });
      return;
    }

    this.api.addMaintenance({
      flat,
      wing,
      month: this.form.month,
      year: this.form.year,
      amount: this.form.amount
    }).subscribe({
      next: () => {
        alert('Maintenance added successfully');
        this.resetFormState();
        this.loadMaintenance();
        this.loadSummary(); // ✅ sync
      },
      error: err =>
        alert(err.error?.message || 'Failed to save maintenance')
    });
  }

  // ================= RESET =================
  resetFormState() {
    this.isEditMode = false;
    this.showAddForm = false;
    this.showMemberAddForm = false;
    this.form = { flat: '', wing: '', month: '', year: '', amount: null };
  }

  // ================= MEMBER VIEW =================
  viewMyMaintenance() {
    const member = this.membersList.find(
      m => m.address === this.memberFlat && m.services === this.memberWing
    );

    if (!member) {
      alert('Flat number is invalid or not registered. Contact administrator.');
      this.showMemberTable = false;
      return;
    }

    this.api.getMaintenanceByFlat(this.memberFlat, this.memberWing)
      .subscribe({
        next: (res: any) => {
          this.memberDetails = res.member;
          this.memberHistory = res.records;
          this.showMemberTable = true;
        },
        error: () => alert('Failed to load maintenance history')
      });
  }
}
