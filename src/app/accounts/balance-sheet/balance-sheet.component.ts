import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {

  totalIncome: number = 0;
  totalExpenses: number = 0;
  netBalance: number = 0;

  // Filters
  selectedYear: string = '';
  selectedMonth: string = '';

  years: number[] = [];
  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadBalanceData();
  }

  // ================= LOAD DATA =================
  loadBalanceData() {
    Promise.all([
      this.api.getAllMaintenance().toPromise(),
      this.api.getExpenses().toPromise()
    ]).then(([maintenanceData, expenseData]: any) => {

      let incomeTotal = 0;
      let expenseTotal = 0;
      const yearSet = new Set<number>();

      // ===== CALCULATE INCOME (Maintenance) =====
      maintenanceData.forEach((member: any) => {
        member.records?.forEach((rec: any) => {
          if (rec.status === 'PAID') {
            yearSet.add(rec.year);

            if (
              (!this.selectedYear || rec.year === Number(this.selectedYear)) &&
              (!this.selectedMonth || rec.month === this.selectedMonth)
            ) {
              incomeTotal += Number(rec.amount || 0);
            }
          }
        });
      });

      // ===== CALCULATE EXPENSES =====
      expenseData.forEach((exp: any) => {
        const expDate = new Date(exp.date);
        const expYear = expDate.getFullYear();
        const expMonth = expDate.toLocaleString('default', { month: 'long' });

        yearSet.add(expYear);

        if (
          (!this.selectedYear || expYear === Number(this.selectedYear)) &&
          (!this.selectedMonth || expMonth === this.selectedMonth)
        ) {
          expenseTotal += Number(exp.amount || 0);
        }
      });

      this.years = Array.from(yearSet).sort((a, b) => b - a);

      this.totalIncome = incomeTotal;
      this.totalExpenses = expenseTotal;
      this.netBalance = this.totalIncome - this.totalExpenses;
    });
  }

  // ================= APPLY FILTERS =================
  applyFilters() {
    this.loadBalanceData();
  }

  // ================= PDF DOWNLOAD =================
  downloadBalancePDF() {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');

    let reportTitle = 'Full Society Balance Sheet';
    if (this.selectedYear) reportTitle = `Balance Sheet - ${this.selectedYear}`;
    if (this.selectedMonth) reportTitle = `${this.selectedMonth} Balance Sheet`;
    if (this.selectedYear && this.selectedMonth) {
      reportTitle = `${this.selectedMonth} ${this.selectedYear} Balance Sheet`;
    }

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Sai Balaji Society', 105, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Financial Balance Sheet', 105, 25, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Report: ${reportTitle}`, 14, 35);
    doc.text(`Generated Date: ${today}`, 14, 42);

    // Table Data
    const tableData = [
      ['Total Maintenance Income', `Rs. ${this.totalIncome.toLocaleString()}`],
      ['Total Society Expenses', `Rs. ${this.totalExpenses.toLocaleString()}`],
      ['Net Balance (Surplus / Deficit)', `Rs. ${this.netBalance.toLocaleString()}`]
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Category', 'Amount (Rs.)']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [30, 94, 255],
        textColor: 255
      }
    });

    doc.save('Society_Balance_Sheet.pdf');
  }
}