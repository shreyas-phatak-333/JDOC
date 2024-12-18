import { Component, OnInit } from '@angular/core';
import { DocumentService, AuthService } from 'src/app/service';
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
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documents: any = [];

  file: File | null = null;
  documentForm!: FormGroup;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getDocuments();
    this.createForm();

    this.documentForm.get('fileName')?.disable();
  }

  getDocuments() {
    this.documentService.getDocuments().subscribe((documents: any[]) => {
      this.documents = documents.map((doc, index) => ({ ...doc, srNo: index + 1 }));
    });
  }

  createForm() {
    this.documentForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      fileName: new FormControl('')
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  deleteDocument(id: number) {
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
        this.documentService.deleteDocument(id).subscribe({        
          next: (res => {
            Toast.fire({
              icon: "success",
              title: "Document has been deleted successfully"
            });
            this.getDocuments();
          }),
          error: (e => {
            Toast.fire({
              icon: "error",
              title: "Document could not be deleted Please try later"
            });
          })
        });
      }
    });
  }

  downloadDocument(filePath: string) {
    window.open(filePath, '_blank');
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.documentForm.get('fileName')?.setValue(this.file?.name);
  }

  onSave() {
    console.log(this.documentForm.value);
    
    if (this.file && this.documentForm.valid) {
      var fileObj = {
        "fileName" : this.file.name,
        "description": this.documentForm.get('description')?.value,
        "addedBy": this.authService.getLoggedInUser().username
      }
      this.documentService.addDocument(fileObj).subscribe({
        next: (res => {
          this.getDocuments();
          this.documentForm.reset();
          this.file=null ;
          Toast.fire({
            icon: "success",
            title: "Document has been added successfully"
          });
        }),
        error:(e => {
          Toast.fire({
            icon: "error",
            title: "Document could not be added Please try later"
          });
        })
      });
      const modal = document.getElementById('documentModal');
      if(modal) {
        modal.style.display = 'none';
        this.getDocuments();
      }
    } 
  }


}
