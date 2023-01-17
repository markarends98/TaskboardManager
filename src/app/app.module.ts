import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import {AppRoutingModule} from './shared/routing/app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment.prod';
// Firebase
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
// Materials
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import {MAT_TABS_CONFIG, MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from "@angular/material/checkbox";
// Custom components
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {VerifyEmailComponent} from './components/verify-email/verify-email.component';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {AuthorizationLayoutComponent} from './layout/authorization-layout/authorization-layout.component';
import {AppLayoutComponent} from './layout/app-layout/app-layout.component';
import {ProfileComponent} from './components/profile/profile.component';
import {TableComponent} from './components/table/table.component';
import {ProjectsComponent} from './components/project/projects/projects.component';
import {ProjectDetailComponent} from './components/project/project-detail/project-detail.component';
import {ProjectEditComponent} from './components/project/project-edit/project-edit.component';
import {ProjectAddComponent} from './components/project/project-add/project-add.component';
import {SprintAddComponent} from './components/sprint/sprint-add/sprint-add.component';
import {SprintEditComponent} from './components/sprint/sprint-edit/sprint-edit.component';
// Custom services
import {AuthService} from './shared/services/auth.service';
import {ProjectService} from './shared/services/project/project.service';
import {MatListModule} from "@angular/material/list";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {BacklogComponent} from './components/project/project-detail/tabs/backlog/backlog.component';
import {BoardComponent} from './components/project/project-detail/tabs/board/board.component';
import {UserstoryEditComponent} from './components/project/project-detail/userstory-edit/userstory-edit.component';
import {DetailsComponent} from './components/project/project-edit/tabs/details/details.component';
import {AccessComponent} from './components/project/project-edit/tabs/access/access.component';
import {AddPeopleComponent} from './components/project/project-edit/tabs/access/add-people/add-people.component';
import {RemovePeopleComponent} from './components/project/project-edit/tabs/access/remove-people/remove-people.component';
import {ArchiveComponent} from './components/project/project-detail/tabs/archive/archive.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SprintStartComponent } from './components/sprint/sprint-start/sprint-start.component';
import { SprintFinishComponent } from './components/sprint/sprint-finish/sprint-finish.component';
import { BurndownChartComponent } from './components/project/project-detail/tabs/burndown-chart/burndown-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    SignInComponent,
    SignUpComponent,
    AuthorizationLayoutComponent,
    AppLayoutComponent,
    ProfileComponent,
    TableComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    ProjectAddComponent,
    SprintAddComponent,
    SprintEditComponent,
    BacklogComponent,
    BoardComponent,
    UserstoryEditComponent,
    DetailsComponent,
    AccessComponent,
    AddPeopleComponent,
    RemovePeopleComponent,
    ArchiveComponent,
    NotFoundComponent,
    SprintStartComponent,
    SprintFinishComponent,
    BurndownChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    FormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatListModule,
    MatTabsModule,
    DragDropModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ChartsModule
  ],
  providers: [
    AuthService,
    ProjectService,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_TABS_CONFIG, useValue: {animationDuration: '0ms'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
