import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { MemberData } from './member.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-dash',
  templateUrl: './member-dash.component.html',
  styleUrls: ['./member-dash.component.css']
})
export class MemberDashComponent implements OnInit {

  formValue!: FormGroup;
  memberModelObj: MemberData = new MemberData();
  allMemberData: any = [];
  showAdd = false;
  showBtn = false;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      services: ['']
    });

    // 🔑 Listen to navbar button
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'addMember') {
        this.clickAddMember();

        // 🔑 clear param so it doesn't reopen
        this.router.navigate([], {
          queryParams: { action: null },
          queryParamsHandling: 'merge'
        });
      }
    });

    this.getAllData();
  }

  // OPEN ADD MODAL
  clickAddMember() {
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;

    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
    }
  }

  // CLOSE MODAL
  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // ADD MEMBER
  addMember() {
    const newMember = {
      name: this.formValue.value.name,
      email: this.formValue.value.email,
      mobile: Number(this.formValue.value.mobile),
      address: this.formValue.value.address,
      services: this.formValue.value.services
    };

    this.api.postMember(newMember).subscribe(() => {
      this.formValue.reset();
      this.closeModal();
      this.getAllData();
    });
  }

  // GET ALL MEMBERS
  getAllData() {
    this.api.getMember().subscribe(res => {
      this.allMemberData = res;
    });
  }

  // DELETE MEMBER
  deleteMem(id: string) {
    if (!confirm('Are you sure you want to delete this member?')) return;

    this.api.deleteMember(id).subscribe(() => {
      this.getAllData();
    });
  }

  // EDIT MEMBER
  onEditMem(data: any) {
    this.showAdd = false;
    this.showBtn = true;
    this.memberModelObj._id = data._id;

    this.formValue.patchValue({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      services: data.services
    });

    this.clickAddMember();
  }

  // UPDATE MEMBER
  updateMem() {
    const updatedMember = {
      name: this.formValue.value.name,
      email: this.formValue.value.email,
      mobile: Number(this.formValue.value.mobile),
      address: this.formValue.value.address,
      services: this.formValue.value.services
    };

    this.api.updateMember(this.memberModelObj._id!, updatedMember).subscribe(() => {
      this.formValue.reset();
      this.closeModal();
      this.getAllData();
    });
  }
}
