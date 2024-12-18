import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/service';
import { of } from 'rxjs';

class MockAuthService {
  Authenticated$ = of(true);  
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService } 
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should update isAuthenticated when Authenticated$ emits', () => {
    fixture.detectChanges();
    expect(component.isAuthenticated).toBe(true);  
  });
  
});
