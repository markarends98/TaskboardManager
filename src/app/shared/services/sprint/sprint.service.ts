import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Sprint} from '../../interface/sprint';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {UserStory} from "../../interface/user-story";
import {UserStoryService} from "../user-story/user-story.service";
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private afs: AngularFirestore, private userStoryService: UserStoryService) {
  }

  /**
   * Get all sprints for a project
   * @param projectId
   */
  getSprints(projectId: string) {
    return this.afs.collection<Sprint>('sprints', ref => ref.where('project', '==', projectId).orderBy('created_at'))
      .snapshotChanges()
      .pipe(
        map(docs => docs.map(doc => {
          return this.convertDocToSprint(doc.payload.doc);
        }))
      );
  }

  /**
   * Get all finished sprints for a project
   * @param projectId
   */
  getSprintArchive(projectId: string) {
    return this.afs.collection<Sprint>('sprints', ref => ref.where('project', '==', projectId).where('status', '==', 'finished').orderBy('created_at'))
      .snapshotChanges()
      .pipe(
        map(docs => docs.map(doc => {
          return this.convertDocToSprint(doc.payload.doc);
        }))
      );
  }

  /**
   * Get single sprint
   * @param sprintId
   */
  getSprint(sprintId: string) {
    return this.afs.collection<Sprint>('sprints').doc(sprintId).snapshotChanges().pipe(
      map(doc => {
        return this.convertDocToSprint(doc.payload);
      })
    );
  }

  /**
   * Edit a sprint
   * @param id
   * @param name
   * @param description
   * @param startDate
   * @param endDate
   */
  editSprint({id, name, description, startDate, endDate}: Sprint) {
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    
    return this.afs.collection<Sprint>('sprints').doc<Sprint>(id).update({
      name,
      description,
      startDate,
      endDate
    });
  }

  /**
   * Add a new sprint
   * @param name
   * @param description
   * @param startDate
   * @param endDate
   * @param creator
   * @param project
   */
  addSprint({name, description, startDate, endDate, creator, project}: any) {
    return this.afs.collection('sprints').add({
      name,
      description,
      startDate,
      endDate,
      creator,
      project,
      status: 'open',
      created_at: new Date()
    });
  }

  /**
   * Edit a sprint's status
   * @param id
   * @param startDate
   * @param endDate
   */
  startSprint({id, startDate, endDate}: Sprint) {
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);

    return this.afs.collection<Sprint>('sprints').doc<Sprint>(id).update({
      status: 'active',
      startDate,
      endDate
    });
  }

  /**
   * Edit a sprint's status
   * @param id
   * @param userStories
   */
  finishSprint({id}: Sprint, userStories: UserStory[]) {
    return this.afs.collection<Sprint>('sprints').doc<Sprint>(id).update({
      status: 'finished'
    }).then(() => {
      return this.userStoryService.moveToBacklog(userStories);
    });
  }

  /**
   * get active sprint for a project
   * @param projectId
   */
  getActiveSprint(projectId: string) {
    return this.afs.collection<Sprint>('sprints', ref => ref.where('project', '==', projectId)
      .where('status', '==', 'active')
      .orderBy('created_at'))
      .snapshotChanges()
      .pipe(
        map(docs => {
          if (docs.length > 0) {
            let doc = docs[0];
            return this.convertDocToSprint(doc.payload.doc);
          }
          return null;
        })
      );
  }

  /**
   * convert doc object to Sprint
   * @param doc
   */
  convertDocToSprint(doc: any) {
    const data = doc.data();
    Object.keys(data).filter(key => data[key] instanceof Timestamp)
      .forEach(key => data[key] = data[key].toDate());
    const id = doc.id;
    return {id, ...(data as object)} as Sprint;
  }
}
