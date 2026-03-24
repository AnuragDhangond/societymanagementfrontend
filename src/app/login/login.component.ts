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

  loginForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private router: Router   
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: [''],
      password: ['']
    });
  }

  logIn() {
  this.api.loginUser(this.loginForm.value).subscribe(
    (res: any) => {

      alert("Login Successful!");

      localStorage.setItem('isLoggedIn', 'true');

      localStorage.setItem('user', JSON.stringify(res.user));

      localStorage.setItem('role', res.user.role);

      localStorage.setItem('userId', res.user.id);

      this.router.navigate(['/members']);
    },
    err => {
      alert("Invalid Email or Password");
    }
  );
}

}
