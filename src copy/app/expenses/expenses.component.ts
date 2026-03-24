import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  role: string | null = '';

  showForm = false;
  isEditMode = false;

  // ===== SUMMARY VALUES (ADMIN ONLY) =====
  totalCollection = 0;
  totalExpenses = 0;
  remainingAmount = 0;

  // ===== DATA =====
  expenses: any[] = [];

  expenseForm: any = {
    title: '',
    category: '',
    amount: '',
    date: '',
    description: ''
  };

  constructor(private api: ApiService) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    this.loadExpenses();

    if (this.role === 'admin') {
      this.loadMaintenanceTotal();
    }
  }

  // ================= EXPENSES =================
  loadExpenses() {
    this.api.getExpenses().subscribe({
      next: (data: any[]) => {
        this.expenses = data;

        this.totalExpenses = data.reduce(
          (sum: number, e: any) => sum + Number(e.amount || 0),
          0
        );

        this.calculateRemaining();
      },
      error: (err: any) => {
        console.error('Failed to load expenses', err);
      }
    });
  }

  // ================= MAINTENANCE TOTAL =================
  loadMaintenanceTotal() {
    this.api.getAllMaintenance().subscribe({
      next: (data: any[]) => {

        // YOUR DB STRUCTURE USES totalAmount
        this.totalCollection = data.reduce(
          (sum: number, item: any) => sum + Number(item.totalAmount || 0),
          0
        );

        this.calculateRemaining();
      },
      error: (err: any) => {
        console.error('Failed to load maintenance total', err);
      }
    });
  }

  calculateRemaining() {
    if (this.role === 'admin') {
      this.remainingAmount = this.totalCollection - this.totalExpenses;
    }
  }

  // ================= FORM =================
  openAddForm() {
    this.isEditMode = false;
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(exp: any) {
    this.isEditMode = true;
    this.expenseForm = {
      ...exp,
      date: exp.date ? exp.date.substring(0, 10) : '' // fix date input
    };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  resetForm() {
    this.expenseForm = {
      title: '',
      category: '',
      amount: '',
      date: '',
      description: ''
    };
  }

  // ================= SAVE =================
  saveExpense() {

    const payload = {
      title: this.expenseForm.title,
      category: this.expenseForm.category,
      amount: Number(this.expenseForm.amount),
      date: new Date(this.expenseForm.date),
      description: this.expenseForm.description
    };

    this.api.addExpense(payload).subscribe({
      next: () => {
        this.closeForm();
        this.loadExpenses();
      },
      error: (err: any) => {
        console.error('Failed to add expense', err);
      }
    });
  }

  // ================= UPDATE =================
  updateExpense() {

    const payload = {
      title: this.expenseForm.title,
      category: this.expenseForm.category,
      amount: Number(this.expenseForm.amount),
      date: new Date(this.expenseForm.date),
      description: this.expenseForm.description
    };

    this.api.updateExpense(this.expenseForm._id, payload).subscribe({
      next: () => {
        this.closeForm();
        this.loadExpenses();
      },
      error: (err: any) => {
        console.error('Failed to update expense', err);
      }
    });
  }

  // ================= DELETE =================
  deleteExpense(exp: any) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.api.deleteExpense(exp._id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (err: any) => {
          console.error('Failed to delete expense', err);
        }
      });
    }
  }
}
