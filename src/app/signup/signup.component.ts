import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder, 
    private _http: HttpClient, 
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formbuilder.group({
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

    this._http.post<any>('http://localhost:5000/api/signup/register', this.signupForm.value)
      .subscribe({
        next: (res) => {
          alert('Signup Successful!');
          this.signupForm.reset();
          this._router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Signup failed!');
        }
      });
  }
}
