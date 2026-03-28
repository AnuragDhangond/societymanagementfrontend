import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  resetPassword() {
    if (this.forgotPasswordForm.invalid) {
      alert("Please fill in valid email, 10-digit mobile number, and a new 6+ char password.");
      return;
    }

    let { email, mobile, newPassword } = this.forgotPasswordForm.value;
    
    // Clean up inputs just in case there are accidental spaces
    let payload = {
      email: email.trim(),
      mobile: mobile.trim(),
      newPassword: newPassword
    };

    this.api.resetPassword(payload).subscribe(
      (res: any) => {
        alert("Password reset successfully! Redirecting to login...");
        this.forgotPasswordForm.reset();
        this.router.navigate(['/login']);
      },
      (err: any) => {
        console.error("Reset Password API Error:", err);
        alert(err.error?.message || "Failed to reset password. Please check your credentials.");
      }
    );
  }
}
