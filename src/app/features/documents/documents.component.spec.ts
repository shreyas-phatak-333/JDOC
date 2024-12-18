import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsComponent } from './documents.component';
import { DocumentService } from 'src/app/service/document.service';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

class MockDocumentService {
  getDocuments() {
    return of([{ id: 1, fileName: 'test.pdf', description: 'Test document' }]);
  }
  deleteDocument(id: number) {
    return of({});
  }
  addDocument(fileObj: any) {
    return of({});
  }
}

class MockAuthService {
  hasRole(role: string) {
    return true;
  }
  getLoggedInUser() {
    return { username: 'testuser' };
  }
}

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  let documentService: MockDocumentService;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: AuthService, useClass: MockAuthService },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load documents on initialization', () => {
    component.getDocuments();
    expect(component.documents.length).toBeGreaterThan(0);
    expect(component.documents[0].fileName).toBe('test.pdf');
  });

  it('should call deleteDocument method', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(documentService, 'deleteDocument').and.callThrough();
    component.deleteDocument(1);
    expect(documentService.deleteDocument).toHaveBeenCalledWith(1);
  });

  it('should call onSave and add document when form is valid', () => {
    spyOn(documentService, 'addDocument').and.callThrough();
    component.documentForm.setValue({
      description: 'New document',
      fileName: 'newfile.pdf'
    });
    component.file = new File([''], 'newfile.pdf');
    component.onSave();
    expect(documentService.addDocument).toHaveBeenCalled();
  });

  it('should not call onSave if the form is invalid', () => {
    spyOn(documentService, 'addDocument').and.callThrough();
    component.documentForm.setValue({ description: '', fileName: '' });
    component.onSave();
    expect(documentService.addDocument).not.toHaveBeenCalled();
  });

  it('should set the file name when a file is selected', () => {
    const mockFile = new File([''], 'testfile.pdf');
    const event = { target: { files: [mockFile] } };
    component.onFileSelected(event);
    expect(component.documentForm.get('fileName')?.value).toBe('testfile.pdf');
  });

  it('should check if the user has a role', () => {
    expect(component.hasRole('admin')).toBeTrue();
  });

  it('should not save document if file is null', () => {
    spyOn(documentService, 'addDocument').and.callThrough();
    component.file = null;
    component.documentForm.setValue({ description: 'Document', fileName: '' });
    component.onSave();
    expect(documentService.addDocument).not.toHaveBeenCalled();
  });
});
