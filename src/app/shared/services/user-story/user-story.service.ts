import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { UserStory } from '../../interface/user-story';
import { map } from 'rxjs/operators';
import {Sprint} from "../../interface/sprint";
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class UserStoryService {
  userStoryRef: AngularFirestoreCollection

  constructor(private afs: AngularFirestore) {
    this.userStoryRef = this.afs.collection<UserStory>('user_stories');
  }

  /**
   * Get all user stories for an project
   * @param projectId
   * @param archived
   */
  getUserStories(projectId: string, archived: boolean = false) {
    return this.afs.collection<UserStory>('user_stories', ref => ref.where('project', '==', projectId)
      .where('archived', '==', archived)
      .orderBy('order', 'asc')
      .orderBy('order_modified', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          return this.convertDocToUserStory(a.payload.doc);
        }))
      );
  }

  /**
   * Get all user stories for an sprint
   * @param projectId
   * @param sprint
   */
  getUserStoriesForSprint(projectId: string, sprint: string) {
    return this.afs.collection<UserStory>('user_stories', ref => ref.where('project', '==', projectId)
      .where('sprint', '==', sprint)
      .where('archived', '==', false)
      .orderBy('order', 'asc')
      .orderBy('order_modified', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          return this.convertDocToUserStory(a.payload.doc);
        }))
      );
  }

  /**
   * Add user story
   * @param name
   * @param project
   * @param sprint
   * @param order
   */
  addUserStory({ name, project, sprint, order }: any) {
    return this.userStoryRef.add({
      name,
      description: '',
      story_points: 0,
      project,
      sprint,
      order,
      archived: false,
      order_modified: new Date(),
      assignee: '',
      status: 'todo',
      completionDate: null
    });
  }

  /**
   * Move user story to another sprint
   * @param id
   * @param sprint
   * @param order
   * @param userStories
   */
  moveUserStory({ id, sprint, order }, userStories: UserStory[]) {
    return this.userStoryRef.doc<UserStory>(id).update({
      sprint,
      order,
      order_modified: new Date()
    }).then(() => {
      return this.reorderUserStory(userStories);
    });
  }

  /**
   * update an user story
   * @param userStory
   */
  updateUserStory(userStory: UserStory) {
    return this.afs.collection<UserStory>('user_stories').doc(userStory.id).update(userStory);
  }

  /**
   * update status of user story
   * @param id
   * @param status
   * @param order
   * @param userStories
   */
  updateUserStoryStatus({ id, status, order }, userStories: UserStory[]) {
    let tempDate = new Date();
    tempDate.setHours(0,0,0,0)
    return this.userStoryRef.doc<UserStory>(id).update({
      status,
      order,
      order_modified: new Date(),
      completionDate: (status === 'done' ? tempDate : null)
    }).then(() => {
      return this.reorderUserStory(userStories);
    });
  }

  /**
   * update order of user story
   * @param userStories
   */
  reorderUserStory(userStories: UserStory[]) {
    return Promise.all(userStories.map((userStory, order) => {
      return this.userStoryRef.doc<UserStory>(userStory.id).update({
        order,
        order_modified: new Date()
      });
    }));
  }

  /**
   * archive or de-archive user story
   * @param id
   * @param archive
   */
  handleArchiveUserStory({id, archived}) {
    return this.userStoryRef.doc<UserStory>(id).update({
      archived: archived
    });
  }

  /**
   * Restore multiple user stories from archive
   * @param userStories
   */
  restoreUserStories(userStories: UserStory[]) {
    return Promise.all(userStories.map((userStory) => {
      return this.userStoryRef.doc<UserStory>(userStory.id).update({
        archived: false
      });
    }));
  }

  /**
   * Move user stories to backlog
   * @param userStories
   */
  moveToBacklog(userStories: UserStory[]) {
    return Promise.all(userStories.map((userStory) => {
      return this.userStoryRef.doc<UserStory>(userStory.id).update({
        sprint: ''
      });
    }));
  }

  convertDocToUserStory(doc: any) {
    const data = doc.data();
    Object.keys(data).filter(key => data[key] instanceof Timestamp)
      .forEach(key => data[key] = data[key].toDate());
    const id = doc.id;
    return {id, ...(data as object)} as UserStory;
  }
}
