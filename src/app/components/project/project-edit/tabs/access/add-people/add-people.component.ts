import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DetailsComponent } from '../../details/details.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/shared/services/project/project.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/shared/interface/project';
import {CustomErrorStateMatcher} from "../../../../../../shared/matchers/CustomErrorStateMatcher";

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.sass']
})
export class AddPeopleComponent implements OnInit {
  users = [];
  project: Project;
  filteredUsers: Observable<any[]>;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new CustomErrorStateMatcher();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: { project: Project }) {
    this.project = data.project;
    this.filteredUsers = this.emailFormControl.valueChanges
      .pipe(
        startWith(''),
        map(user => user ? this._filterUsers(user) : [])
      );
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(user => user.email.toLowerCase().indexOf(filterValue) >= 0);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddClick(): void {
    if (!this.emailFormControl.errors) {
      if (this.project.members.filter(member => member.email === this.emailFormControl.value).length == 0) {
        let user;
        user = this.users.find(x => x.email == this.emailFormControl.value);

        if(user) {
          user.role = 'member'
        } else {
          this.snackBar.open('Could not find user connected to that email address');
          return;
        }

        this.projectService.addProjectMember(this.project.id, user).then((e) => {
          this.snackBar.open('Successfully added project member');
          this.onCancelClick();
        }).catch(() => {
          this.snackBar.open('Something went wrong, try again later');
        });
      } else {
        this.snackBar.open('This person is already a member of your project');
      }
    }
  }
}
