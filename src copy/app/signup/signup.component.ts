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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signUp() {
    if (this.signupForm.invalid) {
      alert("Please fill all fields correctly.");
      return;
    }

    const { role, adminCode, ...rest } = this.signupForm.value;

    //  Admin validation
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

    // Payload (role included)
    const signupData = {
      ...rest,
      role
    };

    this._http.post<any>(
      `${environment.apiUrl}/api/signup/register`,
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
