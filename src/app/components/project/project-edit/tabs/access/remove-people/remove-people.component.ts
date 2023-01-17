import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/shared/services/project/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessComponent } from '../access.component';
import { Project } from 'src/app/shared/interface/project';
import { User } from 'src/app/shared/interface/user';

@Component({
  selector: 'app-remove-people',
  templateUrl: './remove-people.component.html',
  styleUrls: ['./remove-people.component.sass']
})
export class RemovePeopleComponent implements OnInit {
  project: Project;
  user: User;

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AccessComponent>,
    @Inject(MAT_DIALOG_DATA) data: { project: Project, user: User }
  ) {
    this.project = data.project;
    this.user = data.user;
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    if(this.project.owner !== this.user.uid) {
      this.projectService.removeProjectMember(this.project.id, this.user).then(() => {
        this.snackBar.open('Successfully yeeted project member');
        this.onCancelClick();
      }).catch(() => {
        this.snackBar.open('Something went wrong, try again later');
      });
    } else {
      this.snackBar.open("You can't remove the project owner, you silly goose");
    }
  }
}
