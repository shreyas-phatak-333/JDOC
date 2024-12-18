import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, UserService } from 'src/app/service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  showActionButtons!: boolean;
  users: any = [];
  modalTitle="Add User";
  userForm!: FormGroup;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit() {    
    
    this.showActionButtons = this.authService.hasRole('admin');
    this.getUsers();
    this.createForm();
  }

  createForm() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      id: new FormControl('',[Validators.required])
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res => {
        this.users = res;
      }),
      error: (e => {
        console.log(e.error);
      })
    });
  }

  onSave (message: string) {
    console.log("Received from child: " + message);
    const modal = document.getElementById('userModal');
    if(modal) {
      modal.style.display = 'none';
      this.getUsers();
    }
  }

  openEditUserModal(userId: number) {
    this.userService.getUser(userId).subscribe({
      next: (res => {
        this.userForm.get('email')?.setValue(res.email);
        this.userForm.get('username')?.setValue(res.username);
        this.userForm.get('role')?.setValue(res.role);
        this.userForm.get('id')?.setValue(res.id);
      }),
      error: (e => {
        console.log(e.error);        
      })
    })
  }

  editUser() {
    if(this.userForm.invalid) {
      return
    }
    else {
      this.userService.editUser(this.userForm.value).subscribe({
        next: (res => {
          Toast.fire({
            icon: "success",
            title: "User has been added successfully"
          });
          const modal = document.getElementById('editModal');
          if(modal) {
            modal.style.display = 'none';
            this.getUsers();
          }
        }),
        error: (e => {
          Toast.fire({
            icon: "error",
            title: "User could not be added Please try later"
          });
        })
      })
    }
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: (res => {
            Toast.fire({
              icon: "success",
              title: "User has been deleted successfully"
            });
            this.getUsers();
          }),
          error: (e => {
            Toast.fire({
              icon: "error",
              title: "User could not be deleted Please try later"
            });
          })
        });
      }
    });
  }
}
