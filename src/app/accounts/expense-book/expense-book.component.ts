import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-expense-book',
  templateUrl: './expense-book.component.html',
  styleUrls: ['./expense-book.component.css']
})
export class ExpenseBookComponent implements OnInit {

  // ===== DATA =====
  expenses: any[] = [];           // Full API data
  filteredExpenses: any[] = [];   // Filtered data for table & PDF
  totalExpense: number = 0;

  // ===== FILTERS (Month + Year Only) =====
  selectedYear: string = '';
  selectedMonth: string = '';

  // Dynamic year list from DB
  years: number[] = [];

  // Static month list (matches your dropdown)
  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(private api: ApiService) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadExpenses();
  }

  // ================= LOAD EXPENSES FROM API =================
  loadExpenses() {
    this.api.getExpenses().subscribe({
      next: (data: any[]) => {
        this.expenses = data || [];

        // Extract unique years dynamically from expense dates
        const yearSet = new Set<number>();

        this.expenses.forEach(exp => {
          if (exp.date) {
            const year = new Date(exp.date).getFullYear();
            yearSet.add(year);
          }
        });

        // Sort years descending (2026, 2025, 2024)
        this.years = Array.from(yearSet).sort((a, b) => b - a);

        // Apply filters initially (show all data)
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Error loading expenses', err);
      }
    });
  }

  // ================= APPLY MONTH + YEAR FILTER =================
  applyFilters() {
  this.filteredExpenses = this.expenses.filter(exp => {
    if (!exp.date) return false;

    const expDate = new Date(exp.date);
    const expYear = expDate.getFullYear();

    // Stable month extraction
    const expMonth = expDate.toLocaleString('en-GB', { month: 'long' });

    return (
      (!this.selectedYear || expYear === Number(this.selectedYear)) &&
      (!this.selectedMonth || expMonth === this.selectedMonth)
    );
  });

  // Recalculate total based on filtered data
  this.totalExpense = this.filteredExpenses.reduce(
    (sum: number, exp: any) => sum + Number(exp.amount || 0),
    0
  );
}

  // ================= PROFESSIONAL PDF DOWNLOAD (FILTERED LEDGER) =================
  downloadPDF() {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');

    // ===== SOCIETY TITLE =====
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Sai Balaji Society', 105, 15, { align: 'center' });

    // ===== DYNAMIC REPORT TITLE (BASED ON FILTERS) =====
    let reportTitle = 'Official Account Ledger – Expense Book';

    if (this.selectedMonth && this.selectedYear) {
      reportTitle = `${this.selectedMonth} ${this.selectedYear} Expense Ledger`;
    }
    else if (this.selectedYear) {
      reportTitle = `Year ${this.selectedYear} Expense Ledger`;
    }
    else if (this.selectedMonth) {
      reportTitle = `${this.selectedMonth} Expense Ledger`;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(reportTitle, 105, 25, { align: 'center' });

    // ===== GENERATED DATE =====
    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 35);

    // ===== SEPARATOR LINE =====
    doc.line(14, 40, 196, 40);

    // ===== TOTAL EXPENSE SUMMARY =====
    const totalFormatted = 'Rs. ' + this.totalExpense.toLocaleString();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Expenses: ${totalFormatted}`, 14, 48);

    // ===== PREPARE FILTERED TABLE DATA =====
    const tableData = (this.filteredExpenses || []).map(exp => [
      new Date(exp.date).toLocaleDateString('en-GB'),
      exp.title || '-',
      exp.category || '-',
      exp.description || '-',
      'Rs. ' + Number(exp.amount).toLocaleString()
    ]);

    // ===== LEDGER TABLE (AUDIT STYLE) =====
    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Particulars', 'Category', 'Description', 'Debit (Rs.)']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [30, 94, 255], // Matches your UI gradient theme
        textColor: 255,
        halign: 'center'
      },
      columnStyles: {
        4: { halign: 'right' } // Right align amount column (accounting format)
      }
    });

    // ===== GRAND TOTAL SECTION =====
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.line(14, finalY, 196, finalY);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Grand Total Expenses: Rs. ${this.totalExpense.toLocaleString()}`,
      14,
      finalY + 10
    );

    // ===== FOOTER (PROFESSIONAL AUDIT STYLE) =====
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized By: Society Admin', 14, finalY + 20);

    // ===== DYNAMIC FILE NAME =====
    let fileName = 'SaiBalaji_Expense_Ledger';

    if (this.selectedMonth) fileName += `_${this.selectedMonth}`;
    if (this.selectedYear) fileName += `_${this.selectedYear}`;

    doc.save(`${fileName}.pdf`);
  }
}