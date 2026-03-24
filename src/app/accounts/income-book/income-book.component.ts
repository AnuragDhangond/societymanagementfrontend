import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-income-book',
  templateUrl: './income-book.component.html',
  styleUrls: ['./income-book.component.css']
})
export class IncomeBookComponent implements OnInit {

  allEntries: any[] = [];     // full data
  ledgerEntries: any[] = [];  // filtered data
  totalIncome: number = 0;

  // ⭐ Filters
  selectedYear: string = '';
  selectedMonth: string = '';
  selectedWing: string = '';

  years: number[] = [];
  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadIncomeLedger();
  }

  loadIncomeLedger() {
    this.api.getAllMaintenance().subscribe({
      next: (data: any[]) => {

        let flattened: any[] = [];
        let yearSet = new Set<number>();

        data.forEach(member => {
          member.records?.forEach((rec: any) => {
            if (rec.status === 'PAID') {
              flattened.push({
                name: member.name,
                flat: member.flat,
                wing: member.wing,
                month: rec.month,
                year: rec.year,
                amount: rec.amount
              });

              yearSet.add(rec.year);
            }
          });
        });

        this.years = Array.from(yearSet).sort((a, b) => b - a);
        this.allEntries = flattened;
        this.applyFilters();
      }
    });
  }

  // ⭐ APPLY FILTERS (Month / Year / Wing)
  applyFilters() {
    this.ledgerEntries = this.allEntries.filter(entry => {
      return (
        (!this.selectedYear || entry.year == this.selectedYear) &&
        (!this.selectedMonth || entry.month === this.selectedMonth) &&
        (!this.selectedWing || entry.wing === this.selectedWing)
      );
    });

    this.totalIncome = this.ledgerEntries.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
  }

  // Call filter when dropdown changes
  ngDoCheck() {
    this.applyFilters();
  }

  // ⭐ SMART PDF (FILTERED DATA ONLY)
  downloadIncomePDF() {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');

    // Dynamic title based on filters
    // ===== PROFESSIONAL DYNAMIC TITLE (FIXED) =====
let filterTitle = 'Full Income Ledger';

// Month + Year + Wing (Best format)
if (this.selectedMonth && this.selectedYear && this.selectedWing) {
  filterTitle = `${this.selectedMonth} ${this.selectedYear} Income Ledger (${this.selectedWing})`;
}
// Month + Year
else if (this.selectedMonth && this.selectedYear) {
  filterTitle = `${this.selectedMonth} ${this.selectedYear} Income Ledger`;
}
// Year + Wing
else if (this.selectedYear && this.selectedWing) {
  filterTitle = `Year ${this.selectedYear} Income Ledger (${this.selectedWing})`;
}
// Only Month
else if (this.selectedMonth) {
  filterTitle = `${this.selectedMonth} Income Ledger`;
}
// Only Year
else if (this.selectedYear) {
  filterTitle = `Year ${this.selectedYear} Income Ledger`;
}
// Only Wing
else if (this.selectedWing) {
  filterTitle = `Wing ${this.selectedWing} Income Ledger`;
}

    doc.setFontSize(18);
    doc.text('Sai Balaji Society', 14, 15);

    doc.setFontSize(14);
    doc.text(filterTitle, 14, 25);

    doc.setFontSize(10);
    doc.text(`Generated: ${today}`, 14, 32);

    doc.text(
      `Total Income: Rs. ${this.totalIncome.toLocaleString()}`,
      14,
      40
    );

    const tableData = this.ledgerEntries.map(e => [
      e.month,
      e.year,
      e.name,
      e.flat,
      e.wing,
      `Rs. ${Number(e.amount).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Month', 'Year', 'Member', 'Flat', 'Wing', 'Credit (Rs.)']],
      body: tableData,
      headStyles: {
        fillColor: [30, 94, 255]
      },
      styles: { fontSize: 9 }
    });

    doc.save('Income_Ledger_Filtered.pdf');
  }
}