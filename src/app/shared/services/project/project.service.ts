import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Project } from '../../interface/project';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';
import { User } from '../../interface/user';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectRef: AngularFirestoreCollection;

  constructor(
    private afs: AngularFirestore,
  ) {
    this.projectRef = afs.collection('projects');
  }

  getProjects(user: User) {
    return this.afs.collection('projects')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...(data as object) } as Project;
        }))
      );
  }

  getProject(id: string) {
    return this.projectRef.doc(id).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data();
        const id = actions.payload.id;
        return { id, ...(data as object) } as Project;
      })
    );
  }

  addProjectMember(id: string, {uid, displayName, email, photoURL, role}: any) {
    return this.afs.collection('projects', ref => ref.where('members', 'array-contains', email)).doc(id).update({
      members: firebase.firestore.FieldValue.arrayUnion({
        uid,
        displayName,
        email,
        photoURL,
        role
      })
    });
  }

  removeProjectMember(id: string, user: any) {
    return this.afs.collection('projects').doc(id).update({
      members: firebase.firestore.FieldValue.arrayRemove({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role
      })
    }).then(() => {
      return this.afs.collection('user_stories', ref => ref.where('assignee', '==', user.uid).where('project', '==', id))
      .snapshotChanges().pipe(
        map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...(data as object) };
          })
        })
      ).subscribe(items => {
        items.forEach(userstory => {
          this.afs.collection('user_stories').doc(userstory.id).update({
            assignee: ''
          });
        })
      })
    })
  }

  addProject(project: any) {
    return this.projectRef.add(project);
  }

  editProject({ id, name, description, image }: Project) {
    return this.projectRef.doc(id).update({
      name,
      description,
      image
    });
  }

  archiveProject(id: string) {
    return this.projectRef.doc(id).update({
      archived: true
    });
  }

  deArchiveProject(id: string) {
    return this.projectRef.doc(id).update({
      archived: false
    });
  }
}
