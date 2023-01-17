import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { UserStoryService } from 'src/app/shared/services/user-story/user-story.service';
import { UserStory } from 'src/app/shared/interface/user-story';
import { MatDialog } from '@angular/material/dialog';
import { UserstoryEditComponent } from '../../userstory-edit/userstory-edit.component';
import {SprintService} from "../../../../../shared/services/sprint/sprint.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Sprint} from "../../../../../shared/interface/sprint";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent implements OnInit {
  projectId: string;

  todo: UserStory[];
  inprogress: UserStory[];
  done: UserStory[];
  sprint: Sprint;

  constructor(
    private route: ActivatedRoute,
    private userStoryService: UserStoryService,
    private sprintService: SprintService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.sprintService.getActiveSprint(this.projectId).subscribe(sprint => {
      this.sprint = sprint;
      if(this.sprint) {
        this.userStoryService.getUserStoriesForSprint(this.projectId, sprint.id).subscribe(response => {
          if(this.sprint) {
            this.todo = response.filter(data => data.status === 'todo');
            this.inprogress = response.filter(data => data.status === 'inprogress');
            this.done = response.filter(data => data.status === 'done');
          }else {
            this.todo = [];
            this.inprogress = [];
            this.done = [];
          }
        });
      }else {
        this.todo = [];
        this.inprogress = [];
        this.done = [];
      }
    });
  }

  /**
   * handle drop event
   * @param event
   * @param status
   */
  drop(event: CdkDragDrop<UserStory[], any>, status) {
    let userStory = event.item.data;

    if (event.previousContainer === event.container) {
      let tempUserStories: any[];

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      tempUserStories = this.todo.concat(this.inprogress, this.done);
      this.userStoryService.reorderUserStory(tempUserStories).catch(() => {
        this.snackbar.open('Error while reordering user story \'' + userStory.name + '\'.');
      });
    } else {
      let tempUserStories: any[];

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      userStory.status = status;
      userStory.order = event.container.data.findIndex(us => us.id === userStory.id);

      tempUserStories = this.todo.concat(this.inprogress, this.done);
      this.userStoryService.updateUserStoryStatus(userStory, tempUserStories).catch(() => {
        this.snackbar.open('Error while moving user story \'' + userStory.name + '\'.');
      });
    }
  }

  /**
   * Open edit user story dialog
   * @param userstory
   */
  onEditClick(userstory: UserStory): void {
    this.dialog.open(UserstoryEditComponent, {
      data: {
        projectId: this.projectId,
        userstory: userstory
      }
    });
  }

  /**
   * Archive or de-archive user story
   * @param userStory
   */
  handleArchive(userStory: any) {
    userStory.archived = !userStory.archived;

    this.userStoryService.handleArchiveUserStory(userStory).then(() => {
      let snackBarRef = this.snackbar.open('User story has been archived', 'Undo');
      snackBarRef.onAction().subscribe(() => {
        userStory.archived = !userStory.archived;
        console.log(userStory);
        this.userStoryService.handleArchiveUserStory(userStory).then(() => {
          this.snackbar.open('User story has been de-archived');
        }).catch(() => {
          this.snackbar.open('Error while de-archiving user story');
        });
      })
    }).catch(() => {
      this.snackbar.open('Error while archiving user story');
    });
  }
}
