import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserService } from 'src/app/service';
import { of } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);

    await TestBed.configureTestingModule({
      declarations: [ AddUserComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }, 
        {
          provide: UserService,
          useValue: {
            addUser: jasmine.createSpy().and.returnValue(of({}))
          }
        }
      ]
    }).compileComponents();
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.signUpForm).toBeDefined();
    expect(component.signUpForm.controls['email']).toBeDefined();
    expect(component.signUpForm.controls['username']).toBeDefined();
    expect(component.signUpForm.controls['password']).toBeDefined();
    expect(component.signUpForm.controls['role']).toBeDefined();
  });

  it('should mark the form as invalid when required fields are empty', () => {
    component.signUpForm.controls['email'].setValue('');
    component.signUpForm.controls['username'].setValue('');
    component.signUpForm.controls['password'].setValue('');
    component.signUpForm.controls['role'].setValue('');

    expect(component.signUpForm.invalid).toBeTrue();
  });

  it('should submit the form when valid', () => {
    const validUser = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      role: 'user'
    };    
    component.signUpForm.setValue(validUser);
    component.onSignUp();
  });

  it('should show an error message when form is invalid and submit is attempted', () => {
    component.signUpForm.controls['email'].setValue('');
    component.signUpForm.controls['username'].setValue('');
    component.signUpForm.controls['password'].setValue('');
    component.signUpForm.controls['role'].setValue('');

    component.onSignUp();

    expect(component.errorMessage).toBe('Please fill out the form correctly.');
  });

  it('should toggle password visibility', () => {
    expect(component.hide).toBeTrue();  

    component.hide = !component.hide;
    expect(component.hide).toBeFalse(); 
  });

  it('should enable role selection for admin users', () => {
    authService.hasRole.and.returnValue(true);
    component.ngOnInit();

    const roleControl = component.signUpForm.get('role');
    expect(roleControl?.enabled).toBeTrue();
  });

  it('should disable role selection for non-admin users', () => {
    authService.hasRole.and.returnValue(false); 
    component.ngOnInit();

    const roleControl = component.signUpForm.get('role');
    expect(roleControl?.disabled).toBeTrue();
  });
});
