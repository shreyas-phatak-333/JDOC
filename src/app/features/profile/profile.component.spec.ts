import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService, AuthService } from 'src/app/service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

class MockAuthService {
  getLoggedInUser() {
    return { id: 1 };
  }

  logout() {
  }
}

class MockUserService {
  getUser(id: number) {
    if (id === 1) {
      return of({ id: 1, name: 'John Doe' });
    } else {
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    }
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: MockAuthService;
  let mockUserService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [ProfileComponent], 
      providers: [
        { provide: AuthService, useClass: MockAuthService }, 
        { provide: UserService, useClass: MockUserService } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService);
    mockUserService = TestBed.inject(UserService);
  });

  it('should create the ProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentUserId on ngOnInit', () => {
    spyOn(mockAuthService, 'getLoggedInUser').and.returnValue({ id: 1 });
    component.ngOnInit();
    expect(component.currentUserId).toBe(1);
  });

  it('should call getUserDetails on ngOnInit', () => {
    spyOn(component, 'getUserDetails').and.callThrough();
    component.ngOnInit();
    expect(component.getUserDetails).toHaveBeenCalled();
  });

  it('should fetch user details on getUserDetails and set the user property', () => {
    spyOn(mockUserService, 'getUser').and.callThrough();
    component.getUserDetails();
    fixture.detectChanges();
    expect(mockUserService.getUser).toHaveBeenCalledWith(1);
    expect(component.user).toEqual({ id: 1, name: 'John Doe' });
  });

  it('should call logout method', () => {
    spyOn(mockAuthService, 'logout').and.callThrough();
    component.logOut();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
