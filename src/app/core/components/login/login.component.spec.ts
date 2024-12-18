import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockAuthService {
  login() {
    return of([{ email: 'test@example.com', password: '123456', role: 'user' }]); 
  }
  setLoggedInUser(user: any) {}
  Authenticated$ = { next: () => {} };
}

class MockRouter {
  navigate() {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should call onLogin and navigate to dashboard on successful login', () => {
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate');
    
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message when login fails', () => {
    const errorResponse = of([]); 
    spyOn(authService, 'login').and.returnValue(errorResponse);
    
    component.loginForm.controls['email'].setValue('wrong@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');
    component.onLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should toggle password visibility when the icon is clicked', () => {
    const initialType = component.hide;
    component.hide = !initialType;
    expect(component.hide).toBe(!initialType);
  });
});
