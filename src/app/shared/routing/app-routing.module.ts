import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "../../shared/guard/auth.guard";
import { SecureInnerPagesGuard } from '../guard/secure-inner-pages.guard';
import { AuthorizationLayoutComponent } from 'src/app/layout/authorization-layout/authorization-layout.component';
import { AppLayoutComponent } from 'src/app/layout/app-layout/app-layout.component';

import { SignInComponent } from '../../components/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { ProjectsComponent } from 'src/app/components/project/projects/projects.component';
import { ProjectDetailComponent } from 'src/app/components/project/project-detail/project-detail.component';
import { ProjectEditComponent } from 'src/app/components/project/project-edit/project-edit.component';
import { ProjectGuard } from '../guard/project.guard';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';


const routes: Routes = [
  // Authorization layout
  {
    path: '',
    component: AuthorizationLayoutComponent,
    children: [
      { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
      { path: 'sign-up', component: SignUpComponent, canActivate: [SecureInnerPagesGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
      { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] }
    ]
  },

  // App layout
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
      { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuard, ProjectGuard] },
      { path: 'projects/:id/settings', component: ProjectEditComponent, canActivate: [AuthGuard, ProjectGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: '404', component: NotFoundComponent, canActivate: [AuthGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
