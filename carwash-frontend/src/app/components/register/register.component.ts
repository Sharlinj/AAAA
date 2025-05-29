import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', Validators.required] // default role
    });
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.http.post('http://localhost:8081/api/users/register', this.registerForm.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful! You can now login.';
          this.registerForm.reset({ role: 'customer' });
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Registration failed. Try again.';
        }
      });
  }
}
