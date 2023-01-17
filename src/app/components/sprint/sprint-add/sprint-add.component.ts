import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SprintService} from '../../../shared/services/sprint/sprint.service';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Sprint} from "../../../shared/interface/sprint";
import {CustomErrorStateMatcher} from "../../../shared/matchers/CustomErrorStateMatcher";

@Component({
  selector: 'app-sprint-add',
  templateUrl: './sprint-add.component.html',
  styleUrls: ['./sprint-add.component.sass']
})
export class SprintAddComponent implements OnInit {
  projectId: string;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  descriptionFormControl = new FormControl('');

  matcher = new CustomErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private sprintService: SprintService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SprintAddComponent>,
    @Inject(MAT_DIALOG_DATA) data: { project: string }) {
    this.projectId = data.project;
  }

  ngOnInit(): void {

  }

  onAddClick(): void {
    const newSprint = {
      name: this.nameFormControl.value,
      description: this.descriptionFormControl.value,
      startDate: '',
      endDate: '',
      project: this.projectId,
      creator: this.authService.user.uid
    };

    if (!this.hasErrors()) {
      this.sprintService.addSprint(newSprint).then(() => {
        this.dialogRef.close();
        this.snackBar.open('Sprint \'' + newSprint.name + '\' has been added.');
      }).catch(() => {
        this.snackBar.open('Could not add sprint \'' + newSprint.name + '\', try again later.');
      });
    }
  }

  hasErrors() :boolean {
    return this.nameFormControl.errors !== null;
  }
}
