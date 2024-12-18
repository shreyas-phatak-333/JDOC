import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserService } from 'src/app/service';
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  
  signUpForm!: FormGroup;
  errorMessage: string = '';
  isAdmin: boolean = false;
  hide = true;

  @Input() title!: string; 
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', [Validators.required])
    });
    this.isAdmin = this.authService.hasRole('admin');
    if(!this.isAdmin) {
      this.signUpForm.get('role')?.setValue('user');
      this.signUpForm.get('role')?.disable();
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.userService.addUser(this.signUpForm.value).subscribe({
        next: (res => {
          this.save.emit(res);
          if(this.title =="Add User") {
            Toast.fire({
              icon: "success",
              title: "New user has been added successfully"
            });
          }
        }),
        error: (e => {
          Toast.fire({
            icon: "error",
            title: "User Could not be added Please try later"
          });
        })
      })
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
