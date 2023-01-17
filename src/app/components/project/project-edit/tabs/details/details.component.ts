import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute } from "@angular/router";
import { ProjectService } from 'src/app/shared/services/project/project.service';
import { Project } from 'src/app/shared/interface/project';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CustomErrorStateMatcher} from "../../../../../shared/matchers/CustomErrorStateMatcher";
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit {
  project: Project;
  projectId: string;
  isOwner: boolean;

  icons: string[] = [
    'assets/avatar/project-avatar-alien.png',
    'assets/avatar/project-avatar-ape.png',
    'assets/avatar/project-avatar-bottle.png',
    'assets/avatar/project-avatar-cloud.png',
    'assets/avatar/project-avatar-notebook.png',
    'assets/avatar/project-avatar-parrot.png',
    'assets/avatar/project-avatar-rocket.png',
  ]

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  descriptionFormControl = new FormControl('', [])

  matcher = new CustomErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private projectService: ProjectService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.projectService.getProject(this.projectId).subscribe(project => {
      this.project = project;
      this.project.owner == this.authService.user.uid ? this.isOwner = true : this.isOwner = false
      this.nameFormControl.setValue(this.project.name);
      this.descriptionFormControl.setValue(this.project.description);

      if(!this.isOwner) {
        this.nameFormControl.disable()
        this.descriptionFormControl.disable()
      }
    })
  }

  changeIcon(event: any, id: any) {
    if(event.target.src) {
      this.project.image = event.target.getAttribute('src');

      Array.from(id.children).forEach((element: any) => {
        element.classList.remove('icon-active');
      });

      event.target.classList.add('icon-active');
    }
  }

  onEditClick() {
    this.project.name = this.nameFormControl.value;
    this.project.description = this.descriptionFormControl.value;

    if(this.isOwner) {
      if (!this.nameFormControl.errors && !this.descriptionFormControl.errors) {
        this.projectService.editProject(this.project).then(() => {
          this.snackbar.open('Project settings have been updated')
        }).catch(() => {
          this.snackbar.open('Something went wrong while trying to save project settings');
        });
      }
    } else {
      this.snackbar.open("You can't edit this project since you're not the owner")
    }
  }
}
