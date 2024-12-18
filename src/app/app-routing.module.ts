import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './core/components/sign-up/sign-up.component';
import { LoginComponent } from './core/components/login/login.component';
import { DashboardComponent, ProfileComponent, UserManagementComponent, DocumentsComponent } from './features';
import { AuthGuard, LoginGuard } from './core';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[LoginGuard] },
  { path: 'signup', component: SignUpComponent, canActivate:[LoginGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
