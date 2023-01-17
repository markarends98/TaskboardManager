import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintAddComponent } from '../../../../sprint/sprint-add/sprint-add.component';
import { ActivatedRoute } from '@angular/router';
import { Sprint } from '../../../../../shared/interface/sprint';
import { SprintService } from '../../../../../shared/services/sprint/sprint.service';
import { SprintEditComponent } from '../../../../sprint/sprint-edit/sprint-edit.component';
import { UserStoryService } from '../../../../../shared/services/user-story/user-story.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStory } from '../../../../../shared/interface/user-story';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import {UserstoryEditComponent} from "../../userstory-edit/userstory-edit.component";
import {SprintStartComponent} from "../../../../sprint/sprint-start/sprint-start.component";
import {SprintFinishComponent} from "../../../../sprint/sprint-finish/sprint-finish.component";

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.sass']
})
export class BacklogComponent implements OnInit {
  sprints: Sprint[] = [];
  userStories: {} = {};
  sprintControls: any[] = [];
  projectId: string;
  showAddBacklog = false;
  backlogControl: FormControl;
  hasActiveSprint: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sprintService: SprintService,
    private userStoryService: UserStoryService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.backlogControl = new FormControl('');
    this.sprintService.getSprints(this.projectId).subscribe(sprints => {
      this.sprints = sprints.filter(sprint => sprint.status !== 'finished');
      this.hasActiveSprint = (this.sprints.some(sprint => sprint.status === 'active'));
      this.sprintControls = [];
      this.sprints.forEach(sprint => {
        if(!this.userStories.hasOwnProperty(sprint.id)) {
          this.userStories[sprint.id] = [];
        }
        this.sprintControls.push({
          sprint: sprint.id,
          show: false,
          control: new FormControl('')
        });
      });
    });

    this.userStoryService.getUserStories(this.projectId).subscribe(userStories => {
      this.userStories = {};

      this.sprints.forEach(sprint => {
        if(!this.userStories.hasOwnProperty(sprint.id)) {
          this.userStories[sprint.id] = [];
        }
      });
      this.userStories['backlog'] = [];

      userStories.forEach(userStory => {
        let sprint = userStory.sprint;
        if (userStory.sprint === '') {
          sprint = 'backlog';
        }

        if (!this.userStories.hasOwnProperty(sprint)) {
          this.userStories[sprint] = [];
        }

        this.userStories[sprint].push(userStory);
      });
    });
  }

  /**
 * Show add user story input on sprint
 * @param sprintNumber
 */
  prepareAddUserStory(sprintNumber: number) {
    const sprint = this.sprintControls[sprintNumber];
    if (sprint) {
      sprint.show = true;
    }
  }

  /**
   * Show name input for user story
   * @param sprintNumber
   */
  showAddUserStory(sprintNumber: number): boolean {
    const sprint = this.sprintControls[sprintNumber];
    return sprint && sprint.show;
  }

  /**
   * Hide name input for user story
   * @param sprintNumber
   */
  cancelAddUserStory(sprintNumber: number) {
    const sprint = this.sprintControls[sprintNumber];
    if (sprint) {
      sprint.show = false;
      sprint.control.setValue('');
    }
  }

  /**
   * Add user story to sprint
   * @param sprintNumber
   */
  addUserStoryToSprint(sprintNumber: number) {
    const name = this.getControl(sprintNumber).value;
    const sprint = this.sprintControls[sprintNumber].sprint;
    this.addUserStory(name, sprint).then(() => {
      this.cancelAddUserStory(sprintNumber);
      this.snackbar.open('User story \'' + name + '\' has been added.');
    }).catch(() => {
      this.snackbar.open('Could not add user story \'' + name + '\', try again later.');
    });
  }

  /**
   * Add user story to database
   * @param name user story name
   * @param sprint user story sprint
   */
  addUserStory(name: string, sprint: string) {
    return new Promise((resolve, reject) => {
      if (name.trim().length === 0) {
        return reject();
      }

      let order =
        sprint === '' ?
          this.userStories['backlog'].length :
          this.userStories.hasOwnProperty(sprint) ?
            this.userStories[sprint].length : 0;

      const newUserStory = {
        name,
        sprint,
        order,
        project: this.projectId
      };

      this.userStoryService.addUserStory(newUserStory)
        .then(() => {
          return resolve();
        })
        .catch(error => {
          return reject(error);
        });
    });
  }

  /**
   * Edit user story
   * @param userStory
   */
  onEditClick(userStory: UserStory): void {
    this.dialog.open(UserstoryEditComponent, {
      data: {
        projectId: this.projectId,
        userstory: userStory
      }
    });
  }

  /**
   * Open create sprint
   */
  openCreateSprintDialog(): void {
    this.dialog.open(SprintAddComponent, {
      data: {
        project: this.projectId
      }
    });
  }

  /**
   * Open edit sprint
   * @param sprintId
   */
  openEditSprintDialog(sprintId: string) {
    this.dialog.open(SprintEditComponent, {
      data: {
        project: this.projectId,
        sprint: sprintId
      }
    });
  }

  /**
   * Show add backlog input
   */
  prepareAddBacklog() {
    this.showAddBacklog = true;
  }

  /**
   * Hide add backlog input
   */
  cancelAddBacklog() {
    this.showAddBacklog = false;
    this.backlogControl.setValue('');
  }

  /**
   * Add user story to backlog
   */
  addToBacklog() {
    const name = this.backlogControl.value;
    const sprint = '';

    this.addUserStory(name, sprint).then(() => {
      this.cancelAddBacklog();
      this.snackbar.open('User story \'' + name + '\' has been added.');
    }).catch(() => {
      this.snackbar.open('Could not add user story \'' + name + '\', try again later.');
    });
  }

  /**
   * Get name control for user story
   * @param sprintNumber
   */
  getControl(sprintNumber: number): FormControl {
    return this.sprintControls[sprintNumber].control;
  }

  dropSprintEvent(event: CdkDragDrop<UserStory[], any>, sprint: string) {
    let userStory = event.item.data;

    if (event.previousContainer === event.container) {
      if (userStory) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.userStoryService.reorderUserStory(event.container.data).catch(() => {
          this.snackbar.open('Error while reordering user story \'' + userStory.name + '\'.');
        });
      }
    } else {
      if (userStory) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        userStory.sprint = sprint;
        userStory.order = event.container.data.findIndex(us => us.id === userStory.id);

        this.userStoryService.moveUserStory(userStory, event.container.data).catch(() => {
          this.snackbar.open('Error while moving user story \'' + userStory.name + '\'.');
        });
      }
    }
  }

  /**
   * Archive or de-archive user story
   * @param userStory
   */
  handleArchive(userStory: any) {
    userStory.archived = !userStory.archived;

    this.userStoryService.handleArchiveUserStory(userStory).then(() => {
      let snackBarRef = this.snackbar.open('User story \'' + userStory.name + '\' has been archived.', 'Undo');
      snackBarRef.onAction().subscribe(() => {
        userStory.archived = !userStory.archived;
        this.userStoryService.handleArchiveUserStory(userStory).then(() => {
          this.snackbar.open('User story \'' + userStory.name + '\' has been restored');
        }).catch(() => {
          this.snackbar.open('Error while restoring user story \'' + userStory.name + '\'.');
        });
      })
    }).catch(() => {
      this.snackbar.open('Error while archiving user story \'' + userStory.name + '\'.');
    });
  }

  /**
   * Open start sprint dialog
   * @param sprint
   */
  startSprint(sprint: Sprint) {
    if(!this.hasActiveSprint) {
      this.dialog.open(SprintStartComponent, {
        data: {
          sprint: sprint
        }
      });
    }else {
      this.snackbar.open('Cannot start sprint \'' + sprint.name + '\', there already is an active sprint.');
    }
  }

  /**
   * Open finish sprint dialog
   * @param sprint
   */
  finishSprint(sprint: Sprint) {
    let userStories = this.userStories[sprint.id];
    let userStoriesFilter = userStories ? userStories.filter(us => us.status !== 'done') : [];
    this.dialog.open(SprintFinishComponent, {
      data: {
        sprint: sprint,
        userStories: userStoriesFilter
      }
    });
  }
}
