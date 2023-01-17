import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {SprintService} from "../../../shared/services/sprint/sprint.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Sprint} from "../../../shared/interface/sprint";
import {UserStory} from "../../../shared/interface/user-story";

@Component({
  selector: 'app-sprint-finish',
  templateUrl: './sprint-finish.component.html',
  styleUrls: ['./sprint-finish.component.sass']
})
export class SprintFinishComponent implements OnInit {
  sprint: Sprint;
  check: boolean;
  private userStories: UserStory[];

  constructor(
    private authService: AuthService,
    private sprintService: SprintService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<SprintFinishComponent>,
    @Inject(MAT_DIALOG_DATA) data: { sprint: Sprint, userStories: UserStory[] }
  ) {
    this.sprint = data.sprint;
    this.userStories = data.userStories;
  }

  ngOnInit(): void {
  }

  onFinishClick() {
    this.sprintService.finishSprint(this.sprint, this.userStories).then(() => {
      this.snackbar.open('Sprint \'' + this.sprint.name + '\' has finished, and can be found in the archive.');
      this.dialogRef.close();
    }).catch(() => {
      this.snackbar.open('Could not finish sprint \'' + this.sprint.name + '\', try again later.');
    });
  }
}
