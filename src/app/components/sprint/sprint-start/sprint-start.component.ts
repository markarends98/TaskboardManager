import {Component, Inject, OnInit} from '@angular/core';
import {SprintService} from "../../../shared/services/sprint/sprint.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Sprint} from "../../../shared/interface/sprint";
import {FormControl, Validators} from "@angular/forms";
import {CustomErrorStateMatcher} from "../../../shared/matchers/CustomErrorStateMatcher";

@Component({
  selector: 'app-sprint-start',
  templateUrl: './sprint-start.component.html',
  styleUrls: ['./sprint-start.component.sass']
})
export class SprintStartComponent implements OnInit {
  sprint: Sprint;

  minStart: Date = new Date();
  matcher = new CustomErrorStateMatcher();

  startDateFormControl = new FormControl('', [
    Validators.required
  ]);

  endDateFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private sprintService: SprintService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<SprintStartComponent>,
    @Inject(MAT_DIALOG_DATA) data: { sprint: Sprint }
    ) {
      this.sprint = data.sprint;
      this.startDateFormControl.setValue(this.minStart);
    }

  ngOnInit(): void {
  }

  onStartClick() {
    if(!this.hasErrors()) {
      this.sprint.startDate = this.startDateFormControl.value;
      this.sprint.endDate = this.endDateFormControl.value;

      this.sprintService.startSprint(this.sprint).then(() => {
        this.snackbar.open('Sprint \'' + this.sprint.name + '\' has started.');
        this.dialogRef.close();
      }).catch(() => {
        this.snackbar.open('Could not start sprint \'' + this.sprint.name + '\', try again later.');
      });
    }
  }

  hasErrors() :boolean {
    return this.startDateFormControl.errors !== null || this.endDateFormControl.errors !== null;
  }
}
