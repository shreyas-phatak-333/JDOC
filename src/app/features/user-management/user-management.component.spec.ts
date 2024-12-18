import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { AuthService, UserService } from 'src/app/service';
import { of, throwError } from 'rxjs';

class MockAuthService {
  hasRole(role: string): boolean {
    return role === 'admin'; 
  }
}

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let mockAuthService: MockAuthService;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser', 'getUser','editUser']);
  
    mockUserService.getUsers.and.returnValue(of([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]));
    mockUserService.deleteUser.and.returnValue(of(null));
    mockUserService.editUser.and.returnValue(of({ success: true }));

    TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set showActionButtons to true if user has admin role', () => {
    component.ngOnInit();
    expect(component.showActionButtons).toBeTrue();
  });

  it('should call getUsers and populate users on init', () => {
    component.ngOnInit();
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.users[0].name).toBe('John Doe');
    expect(component.users[1].name).toBe('Jane Doe');
  });

  it('should handle error if getUsers fails', () => {
    mockUserService.getUsers.and.returnValue(throwError(() => new Error('Failed to load users')));
    component.getUsers();
  });

  it('should call deleteUser and reload users on successful deletion', () => {
    spyOn(component, 'getUsers').and.callThrough();
    component.deleteUser(1);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should handle error if deleteUser fails', () => {
    mockUserService.deleteUser.and.returnValue(throwError(() => new Error('Failed to delete user')));
    component.deleteUser(1);
  });

  it('should set modalTitle to "Add User" by default', () => {
    expect(component.modalTitle).toBe('Add User');
  });

  it('should populate the form with user data when openEditUserModal is called', () => {
    const mockUser = { id: 1, email: 'user1@example.com', username: 'user1', role: 'admin' };   
    mockUserService.getUser.and.returnValue(of(mockUser));
    component.openEditUserModal(1);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
    expect(component.userForm.get('username')?.value).toBe(mockUser.username);
    expect(component.userForm.get('role')?.value).toBe(mockUser.role);
    expect(component.userForm.get('id')?.value).toBe(mockUser.id);
  });
  

  it('should save the user when form is valid', () => {
    component.userForm.setValue({
      email: 'test@test.com',
      username: 'testuser',
      role: 'admin',
      id: 1
    });
    component.editUser();
    expect(mockUserService.editUser).toHaveBeenCalledWith(component.userForm.value);
  });
});
