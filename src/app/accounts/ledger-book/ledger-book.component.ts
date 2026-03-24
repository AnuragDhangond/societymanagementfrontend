import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-ledger-book',
  templateUrl: './ledger-book.component.html',
  styleUrls: ['./ledger-book.component.css']
})
export class LedgerBookComponent implements OnInit {

  allEntries: any[] = [];        // merged income + expense
  filteredEntries: any[] = [];   // filtered ledger
  runningBalance: number = 0;

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
    this.loadLedgerData();
  }

  // ================= LOAD & MERGE DATA =================
  loadLedgerData() {
    Promise.all([
      this.api.getAllMaintenance().toPromise(),
      this.api.getExpenses().toPromise()
    ]).then(([maintenanceData, expenseData]: any) => {

      const ledger: any[] = [];
      const yearSet = new Set<number>();

      // ===== INCOME (Maintenance) =====
      maintenanceData.forEach((member: any) => {
        member.records?.forEach((rec: any) => {
          if (rec.status === 'PAID') {

            // Convert Month+Year → 1st Date of Month
            const monthIndex = this.months.indexOf(rec.month);
            const date = new Date(rec.year, monthIndex, 1);

            ledger.push({
              date: date,
              type: 'income',
              particulars: `Maintenance (Flat ${member.flat}, ${member.wing}, ${member.name})`,
              credit: Number(rec.amount),
              debit: 0
            });

            yearSet.add(rec.year);
          }
        });
      });

      // ===== EXPENSES =====
      expenseData.forEach((exp: any) => {
        const expDate = new Date(exp.date);

        ledger.push({
          date: expDate,
          type: 'expense',
          particulars: exp.title || 'Society Expense',
          credit: 0,
          debit: Number(exp.amount)
        });

        yearSet.add(expDate.getFullYear());
      });

      // ===== SORT BY DATE (IMPORTANT) =====
      ledger.sort((a, b) => a.date.getTime() - b.date.getTime());

      this.allEntries = ledger;
      this.years = Array.from(yearSet).sort((a, b) => b - a);

      this.applyFilters();
    });
  }

  // ================= APPLY FILTERS =================
  applyFilters() {
    this.filteredEntries = this.allEntries.filter(entry => {
      const year = entry.date.getFullYear();
      const monthName = entry.date.toLocaleString('default', { month: 'long' });

      return (
        (!this.selectedYear || year === Number(this.selectedYear)) &&
        (!this.selectedMonth || monthName === this.selectedMonth)
      );
    });

    this.calculateRunningBalance();
  }

  // ================= RUNNING BALANCE =================
  calculateRunningBalance() {
    let balance = 0;

    this.filteredEntries = this.filteredEntries.map(entry => {
      balance = balance + entry.credit - entry.debit;
      return {
        ...entry,
        balance: balance
      };
    });

    this.runningBalance = balance;
  }

  // ================= PDF DOWNLOAD (FILTERED LEDGER) =================
  downloadLedgerPDF() {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');

    // Dynamic Title based on filters
    let title = 'Full Society Ledger';
    if (this.selectedYear) title = `Ledger - Year ${this.selectedYear}`;
    if (this.selectedMonth) title = `${this.selectedMonth} Ledger`;
    if (this.selectedYear && this.selectedMonth) {
      title = `${this.selectedMonth} ${this.selectedYear} Ledger`;
    }

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Sai Balaji Society', 105, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Official Account Ledger`, 105, 25, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Report: ${title}`, 14, 35);
    doc.text(`Generated: ${today}`, 14, 42);

    // Table Data
    const tableData = this.filteredEntries.map(entry => [
      entry.date.toLocaleDateString('en-GB'),
      entry.particulars,
      entry.credit ? `Rs. ${entry.credit.toLocaleString()}` : '-',
      entry.debit ? `Rs. ${entry.debit.toLocaleString()}` : '-',
      `Rs. ${entry.balance.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Date', 'Particulars', 'Credit (Rs.)', 'Debit (Rs.)', 'Balance (Rs.)']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [30, 94, 255],
        textColor: 255
      },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    doc.save('Society_Ledger_Report.pdf');
  }
}