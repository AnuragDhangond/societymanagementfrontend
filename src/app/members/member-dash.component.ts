import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { MemberData } from './member.model';
import { UiService } from '../shared/ui.service';

@Component({
  selector: 'app-member-dash',
  templateUrl: './member-dash.component.html',
  styleUrls: ['./member-dash.component.css']
})
export class MemberDashComponent implements OnInit {

  formValue!: FormGroup;
  memberModelObj: MemberData = new MemberData();
  allMemberData: any[] = [];

  showAdd = false;
  showBtn = false;

  isAdmin = false;
  isMember = false;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private ui: UiService
  ) {}

  ngOnInit(): void {

    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isMember = role === 'member';

    this.formValue = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      services: ['', Validators.required]
    });

    if (this.isAdmin) {
      this.ui.openAddMember$.subscribe(() => {
        this.clickAddMember();
      });
    }

    this.getAllData();
  }

  // ==========================
  // MODAL CONTROL
  // ==========================
  openModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    document.body.classList.remove('modal-open');

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  onClose() {
    this.formValue.reset();
    this.showAdd = false;
    this.showBtn = false;
    this.closeModal();
  }

  // ==========================
  // ADD MEMBER
  // ==========================
  clickAddMember() {
    if (!this.isAdmin) return;

    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
    this.openModal();
  }

  addMember() {
    if (!this.isAdmin || this.formValue.invalid) return;

    this.api.postMember(this.formValue.value).subscribe(() => {
      this.onClose();
      this.getAllData();
    });
  }

  // ==========================
  // GET ALL MEMBERS
  // ==========================
  getAllData() {
    this.api.getMember().subscribe((res: any) => {
      this.allMemberData = res;
    });
  }

  // ==========================
  // DELETE MEMBER
  // ==========================
  deleteMem(id: string) {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this member?')) return;

    this.api.deleteMember(id).subscribe(() => {
      this.getAllData();
    });
  }

  // ==========================
  // EDIT MEMBER
  // ==========================
  onEditMem(data: any) {
    if (!this.isAdmin) return;

    this.showAdd = false;
    this.showBtn = true;
    this.memberModelObj._id = data._id;

    this.formValue.patchValue(data);
    this.openModal();
  }

  // ==========================
  // UPDATE MEMBER
  // ==========================
  updateMem() {
    if (!this.isAdmin || this.formValue.invalid) return;

    this.api.updateMember(this.memberModelObj._id!, this.formValue.value)
      .subscribe(() => {
        this.onClose();
        this.getAllData();
      });
  }
}
