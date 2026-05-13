import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  private ADMIN_SIGNUP_CODE = '9164';

  constructor(
    private formbuilder: FormBuilder,
    private _http: HttpClient,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
      role: ['', Validators.required],
      adminCode: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      flat: [''],
      wing: ['']
    });
  }

  signUp() {
    if (this.signupForm.invalid) {
      alert("Please fill all fields correctly.");
      return;
    }

    const { role, adminCode, flat, wing, ...rest } = this.signupForm.value;

    // Admin validation
    if (role === 'admin') {
      if (!adminCode) {
        alert("Admin Signup Code is required!");
        return;
      }
      if (adminCode !== this.ADMIN_SIGNUP_CODE) {
        alert("Invalid Admin Signup Code!");
        return;
      }
    }

    // Member validation — flat + wing required
    if (role === 'member') {
      const flatStr = String(flat).trim();
      if (!flatStr || !/^\d{3}$/.test(flatStr)) {
        alert("Flat number must be exactly 3 digits (e.g. 101, 202)");
        return;
      }
      if (!wing) {
        alert("Please select a Wing");
        return;
      }
    }

    // Build payload
    const signupData: any = {
      ...rest,
      role
    };

    // Only include flat/wing for members
    if (role === 'member') {
      signupData.flat = flat;
      signupData.wing = wing;
    }

    this._http.post<any>(
      `${environment.apiUrl}/signup/register`,
      signupData
    ).subscribe({
      next: () => {
        alert('Signup Successful!');
        this.signupForm.reset();
        this._router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed!');
      }
    });
  }
}
