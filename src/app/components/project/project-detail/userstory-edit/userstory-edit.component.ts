import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserStory } from 'src/app/shared/interface/user-story';
import { ProjectService } from 'src/app/shared/services/project/project.service';
import { Project } from 'src/app/shared/interface/project';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserStoryService } from 'src/app/shared/services/user-story/user-story.service';
import { BoardComponent } from '../tabs/board/board.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import {CustomErrorStateMatcher} from "../../../../shared/matchers/CustomErrorStateMatcher";
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-userstory-edit',
  templateUrl: './userstory-edit.component.html',
  styleUrls: ['./userstory-edit.component.sass']
})
export class UserstoryEditComponent implements OnInit {
  project: Project;
  userStory: UserStory;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  descriptionFormControl = new FormControl('', []);
  numberFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(20)
  ]);
  assigneeFormControl = new FormControl('', []);

  matcher = new CustomErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private userStoryService: UserStoryService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<BoardComponent>,
    @Inject(MAT_DIALOG_DATA) data: { projectId: string, userstory: UserStory }
  ) {
    projectService.getProject(data.projectId).subscribe(response => {
      this.project = response;
    })
    this.userStory = data.userstory;
  }

  ngOnInit(): void {
    this.nameFormControl.setValue(this.userStory.name);
    this.descriptionFormControl.setValue(this.userStory.description);
    this.numberFormControl.setValue(this.userStory.story_points);
    this.assigneeFormControl.setValue(this.userStory.assignee.uid != undefined ? this.userStory.assignee.uid : '');
  }

  onQuickAssignClick() {
    this.assigneeFormControl.setValue(this.authService.user.uid);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    if (!this.nameFormControl.errors && !this.descriptionFormControl.errors && !this.numberFormControl.errors && !this.assigneeFormControl.errors) {
      if (this.project.members.filter(member => member.uid === this.assigneeFormControl.value).length > 0 || this.assigneeFormControl.value == '') {
        this.userStory.name = this.nameFormControl.value;
        this.userStory.description = this.descriptionFormControl.value;
        this.userStory.story_points = this.numberFormControl.value;

        if(this.assigneeFormControl.value != '') {
          this.userService.getUser(this.assigneeFormControl.value).subscribe(response => {
            this.userStory.assignee = {
              uid: response.uid,
              displayName: response.displayName,
              email: response.email,
              photoURL: response.photoURL
            }
  
            this.actuallyUpdateUserStory();
          })
        } else {
          this.userStory.assignee = {};
          this.actuallyUpdateUserStory();
        }
      } else {
        this.snackBar.open("You have not selected a user")
      }
    }
  }

  actuallyUpdateUserStory() {
    this.userStoryService.updateUserStory(this.userStory).then(() => {
      this.snackBar.open('User story has been saved');
    }).catch(() => {
      this.snackBar.open('Something went wrong, try again later')
    })

    this.onCancelClick();
  }
}
