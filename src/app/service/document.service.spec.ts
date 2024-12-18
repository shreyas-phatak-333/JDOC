import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  const mockDocuments = [
    { id: 1, name: 'Document 1', type: 'pdf' },
    { id: 2, name: 'Document 2', type: 'txt' }
  ];

  const newDocument = { name: 'Document 3', type: 'docx' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve documents from the API', () => {
    service.getDocuments().subscribe((documents) => {
      expect(documents.length).toBe(2);
      expect(documents).toEqual(mockDocuments);
    });

    const req = httpMock.expectOne('http://localhost:3000/documents');
    expect(req.request.method).toBe('GET');
    req.flush(mockDocuments);
  });

  it('should add a new document to the API', () => {
    service.addDocument(newDocument).subscribe((response) => {
      expect(response).toEqual({ ...newDocument, id: 3 });
    });

    const req = httpMock.expectOne('http://localhost:3000/documents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDocument);
    req.flush({ ...newDocument, id: 3 });
  });

  it('should delete the document from the API', () => {
    const documentId = 1;

    service.deleteDocument(documentId).subscribe((response) => {
      expect(response).toEqual({ message: 'Document deleted' });
    });

    const req = httpMock.expectOne(`http://localhost:3000/documents/${documentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Document deleted' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
