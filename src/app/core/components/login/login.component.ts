import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  hide = true;
  email: any;
  password: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onLogin() {
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;
    this.authService.login(this.email, this.password).subscribe({
      next: (users) => {
        if (users?.length > 0) {
          const user = users[0];
          this.authService.setLoggedInUser(user);
          this.authService.Authenticated$.next(true);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      },
      error: () => {
        this.errorMessage = 'Error occurred during login';
      }
    });
  }

}
