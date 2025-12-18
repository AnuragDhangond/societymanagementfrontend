import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Form
  loginForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,     
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: [''],
      password: ['']
    });
  }

  // LOGIN FUNCTION
  logIn() {
  this.api.loginUser(this.loginForm.value).subscribe(
    res => {
      alert("Login Successful!");

      localStorage.setItem('isLoggedIn', 'true');

      localStorage.setItem('user', JSON.stringify(res.user));
      this._router.navigate(['/members']);
    },
    err => {
      alert("Invalid Email or Password");
    }
  );
}

}
