import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ProjectService} from '../../../shared/services/project/project.service';
import {AuthService} from '../../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomErrorStateMatcher} from "../../../shared/matchers/CustomErrorStateMatcher";
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.sass']
})
export class ProjectAddComponent implements OnInit {
  projectName: string;
  projectDescription: string;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  descriptionFormControl = new FormControl('', [])

  matcher = new CustomErrorStateMatcher();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ProjectAddComponent>,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(): void {
    if (!this.nameFormControl.errors && !this.descriptionFormControl.errors) {
      this.userService.getUser(this.authService.user.uid).subscribe(response => {
        const project = {
          name: this.nameFormControl.value,
          description: this.descriptionFormControl.value,
          owner: this.authService.user.uid,
          image: 'assets/avatar/project-avatar-alien.png',
          archived: false,
          members: [{
            uid: response.uid,
            displayName: response.displayName,
            email: response.email,
            photoURL: response.photoURL,
            role: 'owner'
          }]
        };
  
        this.projectService.addProject(project).then(() => {
          this.openSnackBar('Project successfully created');
          this.onCancelClick();
        }).catch(() => {
          this.openSnackBar('Something went wrong!');
        });
      })
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message);
  }
}
