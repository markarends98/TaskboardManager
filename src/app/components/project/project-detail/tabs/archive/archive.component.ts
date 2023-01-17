import { Component, OnInit } from '@angular/core';
import {UserStoryService} from "../../../../../shared/services/user-story/user-story.service";
import {UserStory} from "../../../../../shared/interface/user-story";
import {ActivatedRoute} from "@angular/router";
import {MatListOption} from "@angular/material/list";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SprintService} from "../../../../../shared/services/sprint/sprint.service";
import {Sprint} from "../../../../../shared/interface/sprint";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.sass']
})
export class ArchiveComponent implements OnInit {
  userStoryArchive: UserStory[] = [];
  private projectId: string;
  sprints: Sprint[] = [];
  sprintUserStories: {} = {};

  constructor(private userStoryService: UserStoryService,
              private sprintService: SprintService,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');

    this.sprintService.getSprintArchive(this.projectId).subscribe(sprints => {
      this.sprints = sprints;
    });

    this.userStoryService.getUserStories(this.projectId, false).subscribe(userStories => {
      this.sprintUserStories = {};

      this.sprints.forEach(sprint => {
        this.sprintUserStories[sprint.id] = [];
      });

      userStories.forEach(userStory => {
        if (!this.sprintUserStories.hasOwnProperty(userStory.sprint)) {
          this.sprintUserStories[userStory.sprint] = [];
        }

        this.sprintUserStories[userStory.sprint].push(userStory);
      });
    });

    this.userStoryService.getUserStories(this.projectId, true).subscribe(userStories => {
      this.userStoryArchive = userStories;
    });
  }

  /**
   * Restore selected user stories
   * @param selected
   */
  restore(selected: MatListOption[]) {
    let selectedUserStories = selected.map(selectedOption => selectedOption.value);
    this.userStoryService.restoreUserStories(selectedUserStories).then(() => {
      this.snackbar.open('User stories have been restored.');
    }).catch(() => {
      this.snackbar.open('Could not restore user stories, try again later.');
    });
  }

}
