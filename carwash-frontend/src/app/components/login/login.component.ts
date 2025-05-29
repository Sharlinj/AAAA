import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    this.http.post<any>('http://localhost:8087/api/users/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          // Assuming backend returns a token and user info
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.user);
          this.router.navigate(['/']); // Navigate to home/dashboard
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed. Check credentials.';
        }
      });
  }
}
