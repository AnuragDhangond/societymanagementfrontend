import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../services/notice.service';

interface Notice {
  title: string;
  description: string;
  createdAt?: string;
}

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  role: string | null = '';
  title: string = '';
  description: string = '';

  notices: Notice[] = [];

  constructor(private noticeService: NoticeService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.loadNotices();   // load from MongoDB
  }

  loadNotices() {
    this.noticeService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: (err) => {
        console.error('Error fetching notices', err);
      }
    });
  }

  addNotice() {
    if (!this.title || !this.description) {
      alert('Please fill all fields');
      return;
    }

    const noticeData = {
      title: this.title,
      description: this.description
    };

    this.noticeService.addNotice(noticeData).subscribe({
      next: () => {
        this.loadNotices();   
        this.title = '';
        this.description = '';
      },
      error: (err) => {
        console.error('Error adding notice', err);
      }
    });
  }
}
