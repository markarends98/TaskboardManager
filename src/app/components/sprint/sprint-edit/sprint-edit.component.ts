import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {SprintService} from '../../../shared/services/sprint/sprint.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Sprint} from '../../../shared/interface/sprint';
import {CustomErrorStateMatcher} from "../../../shared/matchers/CustomErrorStateMatcher";

@Component({
  selector: 'app-sprint-edit',
  templateUrl: './sprint-edit.component.html',
  styleUrls: ['./sprint-edit.component.sass']
})
export class SprintEditComponent implements OnInit {
  projectId: string;
  sprintId: string;
  sprint: Sprint;
  sprintActive: boolean = false;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  descriptionFormControl = new FormControl('');

  startDateFormControl = new FormControl('', [
    Validators.required
  ]);

  endDateFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new CustomErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private sprintService: SprintService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SprintEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { project: string, sprint: string }) {
    this.projectId = data.project;
    this.sprintId = data.sprint;
  }

  ngOnInit(): void {
    this.sprintService.getSprint(this.sprintId).subscribe(sprint => {
      if (sprint) {
        this.sprint = sprint;
        this.sprintActive = this.sprint.status === 'active';
        this.nameFormControl.setValue(this.sprint.name);
        this.descriptionFormControl.setValue(this.sprint.description);
        this.startDateFormControl.setValue(this.sprint.startDate);
        this.endDateFormControl.setValue(this.sprint.endDate);
      }
    });
  }

  onEditClick(): void {
    if (!this.hasErrors()) {
      this.sprint.name = this.nameFormControl.value;
      this.sprint.description = this.descriptionFormControl.value;

      if(this.sprintActive) {
        this.sprint.startDate = this.startDateFormControl.value;
        this.sprint.endDate = this.endDateFormControl.value;
      }

      this.sprintService.editSprint(this.sprint).then(() => {
        this.dialogRef.close();
        this.snackBar.open('Sprint \'' + this.sprint.name + '\' has been updated.');
      }).catch(() => {
        this.snackBar.open('Could not update sprint \'' + this.sprint.name + '\', try again later.');
      });
    }
  }

  hasErrors(): boolean {
    return this.nameFormControl.errors !== null ||
      (
        this.sprintActive ?
          (this.startDateFormControl.errors !== null || this.endDateFormControl.errors !== null)
          : false
      );
  }
}
