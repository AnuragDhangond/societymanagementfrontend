import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  totalIncome = 0;
  totalExpenses = 0;
  currentBalance = 0;

  role: string | null = '';

  lineChart: any;
  pieChart: any;

  maintenanceData: any[] = [];
  expenseData: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');

    if (this.role === 'admin') {
      this.loadIncome();
      this.loadExpenses();
    }
  }

  ngAfterViewInit(): void {
  }

  loadIncome() {
    this.api.getAllMaintenance().subscribe({
      next: (data: any[]) => {
        this.maintenanceData = data;

        this.totalIncome = data.reduce(
          (sum: number, item: any) => sum + Number(item.totalAmount || 0),
          0
        );

        this.calculateBalance();
        this.tryRenderCharts();
      },
      error: (err: any) => {
        console.error('Failed to load income', err);
      }
    });
  }

  loadExpenses() {
    this.api.getExpenses().subscribe({
      next: (data: any[]) => {
        this.expenseData = data;

        this.totalExpenses = data.reduce(
          (sum: number, e: any) => sum + Number(e.amount || 0),
          0
        );

        this.calculateBalance();
        this.tryRenderCharts();
      },
      error: (err: any) => {
        console.error('Failed to load expenses', err);
      }
    });
  }

  calculateBalance() {
    this.currentBalance = this.totalIncome - this.totalExpenses;
  }

  tryRenderCharts() {
    if (this.maintenanceData.length && this.expenseData.length) {
      this.renderLineChart();
      this.renderPieChart();
    }
  }

renderLineChart() {
  const incomeMap: any = {};
  const expenseMap: any = {};

  this.maintenanceData.forEach(member => {
    member.records?.forEach((rec: any) => {
      if (rec.status === 'PAID') {
        const shortMonth = rec.month.substring(0, 3); // Nov instead of November
        const key = `${shortMonth} ${rec.year}`;

        incomeMap[key] = (incomeMap[key] || 0) + Number(rec.amount || 0);
      }
    });
  });

  this.expenseData.forEach(exp => {
    const date = new Date(exp.date);
    const shortMonth = date.toLocaleString('default', { month: 'short' }); // Jan, Feb
    const key = `${shortMonth} ${date.getFullYear()}`;

    expenseMap[key] = (expenseMap[key] || 0) + Number(exp.amount || 0);
  });

  const allKeys = Array.from(
    new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)])
  );

  const labels = allKeys.sort((a: string, b: string) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const incomeData = labels.map(label => incomeMap[label] || 0);
  const expenseData = labels.map(label => expenseMap[label] || 0);

  if (this.lineChart) {
    this.lineChart.destroy();
  }

  this.lineChart = new Chart('lineChart', {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Income (Maintenance)',
          data: incomeData,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46,125,50,0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#c62828',
          backgroundColor: 'rgba(198,40,40,0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      layout: {
        padding: 10
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,    
            maxTicksLimit: 4,  
            maxRotation: 0,    
            minRotation: 0,
            font: {
              size: 10          
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    }
  });
}

  renderPieChart() {
    const categoryMap: any = {};

    this.expenseData.forEach(exp => {
      const category = exp.category || 'Other';
      categoryMap[category] =
        (categoryMap[category] || 0) + Number(exp.amount || 0);
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#1e5eff',
              '#6a1bff',
              '#c62828',
              '#ff9800',
              '#2e7d32'
            ]
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
}